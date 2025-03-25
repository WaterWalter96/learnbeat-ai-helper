
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateAIResponse, generateMockResponse, type ResponseType } from '@/services/aiService';

interface AiResponseProps {
  selectedText: string;
}

const AiResponse: React.FC<AiResponseProps> = ({ selectedText }) => {
  const [responseType, setResponseType] = useState<ResponseType>('kort-simpel');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  // Generate AI response
  const generateResponse = async () => {
    if (!selectedText) {
      setError('Selecteer eerst een tekst');
      toast({
        title: "Fout",
        description: "Selecteer eerst een tekst voordat je een antwoord genereert.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      let response: string;
      
      // Check if we're in a Chrome extension environment
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Use real API
        response = await generateAIResponse(selectedText, responseType, responseType === 'custom' ? customPrompt : undefined);
      } else {
        // Use mock for development
        response = await generateMockResponse(responseType);
      }
      
      setAiResponse(response);
      
      toast({
        title: "Antwoord gegenereerd",
        description: "De AI heeft een antwoord gegenereerd op basis van je tekst.",
      });
    } catch (err) {
      console.error('Error generating response:', err);
      setError('Er is een fout opgetreden bij het genereren van het antwoord.');
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het genereren van het antwoord.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to fill in the response in a text field on the page
  const fillResponseInPage = () => {
    if (!aiResponse) return;
    
    // Check if running in a Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "fillText", text: aiResponse },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                setError('Kon het antwoord niet invullen. Klik op een tekstveld op de pagina.');
                toast({
                  title: "Fout",
                  description: "Kon het antwoord niet invullen. Klik op een tekstveld op de pagina.",
                  variant: "destructive"
                });
                return;
              }
              
              if (response && response.success) {
                toast({
                  title: "Invullen Gestart",
                  description: "Klik op een invoerveld op de pagina om het antwoord in te vullen.",
                });
              }
            }
          );
        }
      });
    } else {
      // For demo mode when not running as extension
      toast({
        title: "Demo Modus",
        description: "Dit is een demo. In de echte extensie kunt u het antwoord invullen op de pagina.",
      });
    }
  };
  
  return (
    <div className="glass-card mb-6">
      <h2 className="section-title">AI Antwoord Genereren</h2>
      
      <div className="space-y-6">
        {/* Response type selector */}
        <div className="space-y-3">
          <p className="text-sm text-ext-text-light mb-2">Kies hoe je het antwoord wilt ontvangen:</p>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'kort-simpel', label: 'Kort & Simpel' },
              { id: 'kort-complex', label: 'Kort & Complex' },
              { id: 'lang-simpel', label: 'Lang & Simpel' },
              { id: 'lang-complex', label: 'Lang & Complex' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setResponseType(option.id as ResponseType)}
                className={`px-3 py-2 rounded-md text-sm transition-all duration-300 ${
                  responseType === option.id
                    ? 'bg-ext-blue text-white'
                    : 'bg-ext-medium/70 text-ext-text-light hover:bg-ext-medium'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setResponseType('custom')}
            className={`w-full px-3 py-2 rounded-md text-sm transition-all duration-300 ${
              responseType === 'custom'
                ? 'bg-ext-blue text-white'
                : 'bg-ext-medium/70 text-ext-text-light hover:bg-ext-medium'
            }`}
          >
            Aangepast
          </button>
          
          {responseType === 'custom' && (
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Bijv: Geef een samenvatting in 3 bullet points..."
              className="w-full input-field text-sm min-h-[80px]"
            />
          )}
        </div>
        
        {/* Generate button */}
        <Button
          onClick={generateResponse}
          disabled={isGenerating || !selectedText}
          className={`premium-button w-full ${
            isGenerating || !selectedText ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? 'Genereren...' : 'Beantwoord Vraag'}
        </Button>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-200 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* AI Response */}
        {aiResponse && (
          <div className="space-y-3">
            <div className="bg-ext-medium/50 border border-ext-accent/20 rounded-md p-3 max-h-[200px] overflow-y-auto">
              <p className="text-sm">{aiResponse}</p>
            </div>
            
            <Button
              onClick={fillResponseInPage}
              className="premium-button button-accent w-full"
              variant="default"
            >
              Vul in op Pagina
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiResponse;
