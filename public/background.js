
// Background script for LearnbeatAI Chrome Extension
// Handles communication between popup and content scripts

console.log("Background script initialized");

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  
  // Handle 'getSelectedText' message
  if (message.action === "getSelectedText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "getSelectedText" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              sendResponse({ success: false, error: chrome.runtime.lastError });
              return;
            }
            
            if (response && response.text) {
              sendResponse({ success: true, text: response.text });
            } else {
              sendResponse({ success: false, text: "" });
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

  // Relay messages from content script to popup
  if (message.action === "textSelected" || message.action === "textFilled") {
    // Just log it and let the popup handle it
    console.log("Relaying message to popup:", message);
  }
});

// Function to get selected text from the page
function getSelectedText() {
  return window.getSelection().toString();
}
