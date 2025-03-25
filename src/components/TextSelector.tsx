
import React, { useState, useEffect } from 'react';

interface TextSelectorProps {
  onTextSelected: (text: string) => void;
}

const TextSelector: React.FC<TextSelectorProps> = ({ onTextSelected }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  
  // Function to request text selection from content script
  const requestTextSelection = () => {
    setIsSelecting(true);
    
    // Send message to content script to start selection mode
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "startSelection" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              setIsSelecting(false);
              return;
            }
            
            if (response && response.success) {
              // Selection mode started, wait for text
              console.log("Selection mode activated");
            }
          }
        );
      }
    });
  };
  
  // Listen for text selection from content script
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.action === "textSelected" && message.text) {
        setSelectedText(message.text);
        setIsSelecting(false);
        onTextSelected(message.text);
      }
    };
    
    chrome.runtime.onMessage.addListener(handleMessage);
    
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [onTextSelected]);
  
  return (
    <div className="glass-card mb-6">
      <h2 className="section-title">Selecteer Tekst</h2>
      
      <div className="space-y-4">
        <button 
          onClick={requestTextSelection}
          disabled={isSelecting}
          className={`premium-button w-full ${isSelecting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSelecting ? 'Klik op een tekstelement...' : 'Selecteer Tekst'}
        </button>
        
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
