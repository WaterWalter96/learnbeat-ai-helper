
// Background script for LearnbeatAI Chrome Extension
// Handles communication between popup and content scripts

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle 'getSelectedText' message
  if (message.action === "getSelectedText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: getSelectedText
          },
          (injectionResults) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              sendResponse({ success: false, error: chrome.runtime.lastError });
              return;
            }
            
            if (injectionResults && injectionResults[0]) {
              sendResponse({ success: true, text: injectionResults[0].result });
            } else {
              sendResponse({ success: false, error: "No text selected" });
            }
          }
        );
      } else {
        sendResponse({ success: false, error: "No active tab" });
      }
    });
    return true; // Required for async response
  }
  
  // Handle 'startSelection' message from popup to content script
  if (message.action === "startSelection") {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startSelection" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError });
            return;
          }
          
          sendResponse(response);
        });
      } else {
        sendResponse({ success: false, error: "No active tab" });
      }
    });
    return true; // Required for async response
  }
  
  // Handle 'fillText' message from popup to content script
  if (message.action === "fillText") {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: "fillText", 
          text: message.text 
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError });
            return;
          }
          
          sendResponse(response);
        });
      } else {
        sendResponse({ success: false, error: "No active tab" });
      }
    });
    return true; // Required for async response
  }
});

// Function to get selected text from the page
function getSelectedText() {
  return window.getSelection().toString();
}
