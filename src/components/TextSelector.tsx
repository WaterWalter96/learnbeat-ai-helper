
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextSelectorProps {
  onTextSelected: (text: string) => void;
}

const TextSelector: React.FC<TextSelectorProps> = ({ onTextSelected }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [pastedText, setPastedText] = useState('');
  const { toast } = useToast();
  
  // Function to request text selection from content script
  const requestTextSelection = () => {
    setIsSelecting(true);
    
    // Check if running in a Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      // Send message to content script to get currently selected text
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "getSelectedText" },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Chrome runtime error:", chrome.runtime.lastError);
                setIsSelecting(false);
                toast({
                  title: "Fout",
                  description: "Kon niet verbinden met de pagina. Probeer de pagina te verversen.",
                  variant: "destructive"
                });
                return;
              }
              
              if (response && response.text) {
                // Text was selected on the page
                handleTextReceived(response.text);
              } else {
                // No text was selected
                setIsSelecting(false);
                toast({
                  title: "Geen tekst geselecteerd",
                  description: "Selecteer eerst tekst op de pagina of plak tekst in het tekstveld.",
                });
              }
            }
          );
        } else {
          // No active tab
          setIsSelecting(false);
          toast({
            title: "Fout",
            description: "Kon geen actief tabblad vinden.",
            variant: "destructive"
          });
        }
      });
    } else {
      // For demo mode when not running as extension
      setSelectedText("Dit is een voorbeeldtekst. In de echte extensie kunt u tekst selecteren van de pagina.");
      setIsSelecting(false);
      onTextSelected("Dit is een voorbeeldtekst. In de echte extensie kunt u tekst selecteren van de pagina.");
      toast({
        title: "Demo Modus",
        description: "Dit is een demo. In de echte extensie kunt u tekst selecteren van de pagina.",
      });
    }
  };
  
  // Function to handle received text (from selection or paste)
  const handleTextReceived = (text: string) => {
    setSelectedText(text);
    setIsSelecting(false);
    onTextSelected(text);
    toast({
      title: "Tekst Geselecteerd",
      description: "De geselecteerde tekst is succesvol verwerkt.",
    });
  };
  
  // Handle pasted text
  const handlePastedTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
  };
  
  // Submit pasted text
  const submitPastedText = () => {
    if (pastedText.trim()) {
      handleTextReceived(pastedText.trim());
    } else {
      toast({
        title: "Lege tekst",
        description: "Voer eerst tekst in voordat je deze verwerkt.",
        variant: "destructive"
      });
    }
  };
  
  // Create a stable reference to the message handler function
  const handleMessage = useCallback((message: any, sender: any, sendResponse: (response?: any) => void) => {
    if (message.action === "textSelected" && message.text) {
      handleTextReceived(message.text);
    }
  }, [toast, onTextSelected]);
  
  // Listen for text selection from content script
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);
      
      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }
  }, [handleMessage]);
  
  return (
    <div className="glass-card mb-6">
      <h2 className="section-title">Selecteer of Plak Tekst</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <Button 
            onClick={requestTextSelection}
            disabled={isSelecting}
            className={`premium-button w-full ${isSelecting ? 'opacity-70 cursor-not-allowed' : ''}`}
            variant="default"
          >
            {isSelecting ? 'Ophalen van geselecteerde tekst...' : 'Haal geselecteerde tekst op'}
          </Button>
          
          <div className="text-sm text-center text-ext-text-light">OF</div>
          
          <Textarea
            placeholder="Plak hier je tekst..."
            value={pastedText}
            onChange={handlePastedTextChange}
            className="min-h-[100px] text-sm resize-none"
          />
          
          <Button
            onClick={submitPastedText}
            disabled={!pastedText.trim()}
            variant="outline"
            className="w-full"
          >
            Gebruik geplakte tekst
          </Button>
        </div>
        
        {selectedText && (
          <div className="bg-ext-medium/50 border border-ext-accent/20 rounded-md p-3 max-h-[150px] overflow-y-auto">
            <p className="text-sm text-ext-text-light">{selectedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSelector;
