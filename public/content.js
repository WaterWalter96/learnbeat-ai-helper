
// Content script for LearnbeatAI Chrome Extension
// Runs in the context of web pages

// Global variables
let isSelectionMode = false;
let isInputSelectionMode = false;

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle text selection mode
  if (message.action === "startSelection") {
    isSelectionMode = true;
    
    // Show visual feedback that selection mode is active
    const overlay = document.createElement('div');
    overlay.id = 'learnbeat-selection-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(74, 120, 251, 0.1)';
    overlay.style.border = '2px solid #4A78FB';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    const message = document.createElement('div');
    message.textContent = 'Klik op een tekstelement om het te selecteren';
    message.style.background = '#0A192F';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.fontFamily = 'Arial, sans-serif';
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // Add click event listener to capture clicked text
    document.addEventListener('click', handleTextSelection);
    
    sendResponse({ success: true });
    return true;
  }
  
  // Handle fill text in input mode
  if (message.action === "fillText") {
    isInputSelectionMode = true;
    const textToFill = message.text;
    
    // Show visual feedback that input selection mode is active
    const overlay = document.createElement('div');
    overlay.id = 'learnbeat-input-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(100, 255, 218, 0.1)';
    overlay.style.border = '2px solid #64FFDA';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    const message = document.createElement('div');
    message.textContent = 'Klik op een invoerveld om de tekst in te vullen';
    message.style.background = '#0A192F';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.fontFamily = 'Arial, sans-serif';
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // Add click event listener to capture clicked input
    document.addEventListener('click', function handleInputSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Find target element (input, textarea, or contenteditable)
      const target = e.target;
      
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.getAttribute('contenteditable') === 'true'
      ) {
        // Fill in the text
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          target.value = textToFill;
          // Trigger input event to notify the page of the change
          target.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // For contenteditable
          target.textContent = textToFill;
          // Trigger input event
          target.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
        
        // Clean up
        document.removeEventListener('click', handleInputSelection);
        isInputSelectionMode = false;
        const overlay = document.getElementById('learnbeat-input-overlay');
        if (overlay) document.body.removeChild(overlay);
        
        chrome.runtime.sendMessage({ 
          action: "textFilled", 
          success: true 
        });
      }
    }, { once: true });
    
    sendResponse({ success: true });
    return true;
  }
});

// Function to handle text selection
function handleTextSelection(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // Get the text from the clicked element
  let selectedText = '';
  
  if (e.target.textContent) {
    selectedText = e.target.textContent.trim();
  }
  
  // Clean up
  document.removeEventListener('click', handleTextSelection);
  isSelectionMode = false;
  const overlay = document.getElementById('learnbeat-selection-overlay');
  if (overlay) document.body.removeChild(overlay);
  
  // Send the selected text back to the popup
  chrome.runtime.sendMessage({ 
    action: "textSelected", 
    text: selectedText 
  });
}

// Initialize the content script
function initialize() {
  console.log('LearnbeatAI content script initialized');
}

// Run initialization
initialize();
