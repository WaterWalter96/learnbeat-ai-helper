
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface TextSelectorProps {
  onTextSelected: (text: string) => void;
}

const TextSelector: React.FC<TextSelectorProps> = ({ onTextSelected }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const { toast } = useToast();
  
  // Function to request text selection from content script
  const requestTextSelection = () => {
    setIsSelecting(true);
    
    // Check if running in a Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      // Send message to content script to start selection mode
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "startSelection" },
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
              
              if (response && response.success) {
                // Selection mode started, wait for text
                console.log("Selection mode activated");
              } else {
                // Something went wrong with the content script
                setIsSelecting(false);
                toast({
                  title: "Fout",
                  description: "Er is een probleem opgetreden bij het starten van de tekstselectie.",
                  variant: "destructive"
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
  
  // Create a stable reference to the message handler function
  const handleMessage = useCallback((message: any) => {
    if (message.action === "textSelected" && message.text) {
      setSelectedText(message.text);
      setIsSelecting(false);
      onTextSelected(message.text);
      toast({
        title: "Tekst Geselecteerd",
        description: "De geselecteerde tekst is succesvol verwerkt.",
      });
    }
  }, [onTextSelected, toast]);
  
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
      <h2 className="section-title">Selecteer Tekst</h2>
      
      <div className="space-y-4">
        <Button 
          onClick={requestTextSelection}
          disabled={isSelecting}
          className={`premium-button w-full ${isSelecting ? 'opacity-70 cursor-not-allowed' : ''}`}
          variant="default"
        >
          {isSelecting ? 'Klik op een tekstelement...' : 'Selecteer Tekst'}
        </Button>
        
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
