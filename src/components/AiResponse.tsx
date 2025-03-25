
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AiResponseProps {
  selectedText: string;
}

type ResponseType = 'kort-simpel' | 'kort-complex' | 'lang-simpel' | 'lang-complex' | 'custom';

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
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    // Construct the prompt based on the selected response type
    let prompt = '';
    
    switch (responseType) {
      case 'kort-simpel':
        prompt = `Geef een kort en simpel antwoord van één zin op de volgende vraag of tekst. Gebruik eenvoudige taal: ${selectedText}`;
        break;
      case 'kort-complex':
        prompt = `Geef een kort maar complex antwoord van één zin op de volgende vraag of tekst. Gebruik vakjargon waar nodig: ${selectedText}`;
        break;
      case 'lang-simpel':
        prompt = `Geef een uitgebreid maar simpel antwoord van meerdere zinnen op de volgende vraag of tekst. Gebruik eenvoudige taal: ${selectedText}`;
        break;
      case 'lang-complex':
        prompt = `Geef een uitgebreid en complex antwoord van meerdere zinnen op de volgende vraag of tekst. Gebruik vakjargon en gedetailleerde uitleg: ${selectedText}`;
        break;
      case 'custom':
        prompt = `${customPrompt}: ${selectedText}`;
        break;
      default:
        prompt = `Beantwoord de volgende vraag of tekst: ${selectedText}`;
    }
    
    try {
      // In a real implementation, you would call an actual AI API here
      // For this demo, we'll simulate an AI response
      const response = await simulateAiResponse(prompt);
      setAiResponse(response);
    } catch (err) {
      setError('Er is een fout opgetreden bij het genereren van het antwoord.');
      console.error(err);
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
  
  // Simulate AI response (in a real extension, this would call an actual AI API)
  const simulateAiResponse = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simplified simulation of different response types
        if (prompt.includes('kort-simpel')) {
          resolve('Dit is een kort en eenvoudig antwoord op je vraag.');
        } else if (prompt.includes('kort-complex')) {
          resolve('De complexe interactie tussen variabelen genereert een multifactoriële uitkomst met significante implicaties.');
        } else if (prompt.includes('lang-simpel')) {
          resolve('Dit is een langer antwoord dat uit meerdere zinnen bestaat. Het gebruikt eenvoudige taal zodat iedereen het kan begrijpen. We voegen wat extra uitleg toe om het duidelijker te maken. Dit helpt om het onderwerp beter te begrijpen.');
        } else if (prompt.includes('lang-complex')) {
          resolve('De multidimensionale analyse van het vraagstuk vereist een nuancering van verschillende theoretische kaders. In de eerste plaats dient de epistemologische fundering geëvalueerd te worden vanuit zowel kwalitatief als kwantitatief perspectief. De daaruit voortvloeiende synthese leidt tot een geïntegreerd model waarbij zowel de empirische als conceptuele elementen tot hun recht komen. Concluderend kan gesteld worden dat de inherente complexiteit een holistische benadering rechtvaardigt.');
        } else {
          resolve('Dit is een antwoord op basis van je aangepaste prompt. De AI heeft de inhoud geanalyseerd en een passend antwoord gegenereerd dat voldoet aan je specifieke wensen.');
        }
      }, 1500); // Simulate API delay
    });
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
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Bijv: Geef een samenvatting in 3 bullet points..."
              className="w-full input-field text-sm min-h-[80px]"
            />
          )}
        </div>
        
        {/* Generate button */}
        <button
          onClick={generateResponse}
          disabled={isGenerating || !selectedText}
          className={`premium-button w-full ${
            isGenerating || !selectedText ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? 'Genereren...' : 'Beantwoord Vraag'}
        </button>
        
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
            
            <button
              onClick={fillResponseInPage}
              className="premium-button button-accent w-full"
            >
              Vul in op Pagina
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiResponse;
