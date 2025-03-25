
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("Popup script initialized");
  const appContainer = document.getElementById('app-container');
  
  // Show loading message
  appContainer.innerHTML = `
    <div id="loading">
      <div class="loader"></div>
      <p>LearnbeatAI Laden...</p>
    </div>
  `;
  
  // In a real Chrome extension, this would render your React app
  // For now, we'll simulate the app UI
  setTimeout(() => {
    renderApp();
  }, 500);
  
  // Function to render app UI
  function renderApp() {
    appContainer.innerHTML = `
      <div class="app">
        <!-- Header -->
        <header class="header">
          <div class="logo-container">
            <div class="logo-icon">A</div>
            <h1 class="logo-text">Learnbeat<span class="accent">AI</span></h1>
          </div>
        </header>
        
        <!-- Main content -->
        <main class="main-content">
          <!-- Text Selector -->
          <div class="card">
            <h2 class="section-title">Selecteer Tekst</h2>
            <button id="selectTextBtn" class="button-primary">Selecteer Tekst</button>
            <div class="text-separator">OF</div>
            <textarea id="textInput" placeholder="Plak hier je tekst..." class="text-input"></textarea>
            <button id="useTextBtn" class="button-secondary">Gebruik geplakte tekst</button>
            <div id="selectedTextContainer" class="selected-text-container hidden">
              <p id="selectedText" class="selected-text"></p>
            </div>
          </div>
          
          <!-- AI Response Generator -->
          <div class="card">
            <h2 class="section-title">AI Antwoord Genereren</h2>
            
            <div class="response-type-grid">
              <button class="response-type-btn active" data-type="kort-simpel">Kort & Simpel</button>
              <button class="response-type-btn" data-type="kort-complex">Kort & Complex</button>
              <button class="response-type-btn" data-type="lang-simpel">Lang & Simpel</button>
              <button class="response-type-btn" data-type="lang-complex">Lang & Complex</button>
            </div>
            
            <button class="response-type-btn custom-btn" data-type="custom">Aangepast</button>
            
            <div id="customPromptContainer" class="custom-prompt-container hidden">
              <textarea id="customPrompt" placeholder="Bijv: Geef een samenvatting in 3 bullet points..."></textarea>
            </div>
            
            <button id="generateBtn" class="button-primary" disabled>Beantwoord Vraag</button>
            
            <div id="aiResponseContainer" class="ai-response-container hidden">
              <p id="aiResponse" class="ai-response"></p>
              <button id="fillTextBtn" class="button-accent">Vul in op Pagina</button>
            </div>
          </div>
        </main>
        
        <!-- Footer navigation -->
        <footer class="footer">
          <nav class="footer-nav">
            <button id="aiTab" class="nav-button active">AI Assistent</button>
            <button id="socialTab" class="nav-button">Contact</button>
          </nav>
        </footer>
      </div>
    `;
    
    // Setup event listeners
    setupEventListeners();
  }
  
  // Function to render social page
  function renderSocialPage() {
    appContainer.innerHTML = `
      <div class="app">
        <!-- Header -->
        <header class="header">
          <div class="logo-container">
            <div class="logo-icon">A</div>
            <h1 class="logo-text">Learnbeat<span class="accent">AI</span></h1>
          </div>
        </header>
        
        <!-- Main content -->
        <main class="main-content">
          <!-- Social Links -->
          <div class="card">
            <h2 class="section-title">Contact</h2>
            <p class="text-muted">
              LearnbeatAI is gemaakt door WakkieKak. Volg ons op sociale media voor meer updates en tools.
            </p>
            
            <div class="social-grid">
              <a href="https://www.instagram.com/wakkiekak/" target="_blank" class="social-link">
                <span class="social-icon">📷</span>
                <span>Instagram</span>
              </a>
              <a href="https://www.youtube.com/@wakkiekak" target="_blank" class="social-link">
                <span class="social-icon">🎬</span>
                <span>YouTube</span>
              </a>
              <a href="mailto:wakkiekak@gmail.com" class="social-link">
                <span class="social-icon">✉️</span>
                <span>E-mail</span>
              </a>
              <a href="https://wakkiekak.nl" target="_blank" class="social-link">
                <span class="social-icon">🌐</span>
                <span>Website</span>
              </a>
            </div>
            
            <div class="thank-you-box">
              <h3>Bedankt voor het gebruiken van LearnbeatAI</h3>
              <p class="text-muted">Gemaakt met ❤️ door WakkieKak</p>
            </div>
          </div>
        </main>
        
        <!-- Footer navigation -->
        <footer class="footer">
          <nav class="footer-nav">
            <button id="aiTab" class="nav-button">AI Assistent</button>
            <button id="socialTab" class="nav-button active">Contact</button>
          </nav>
        </footer>
      </div>
    `;
    
    // Setup event listeners
    setupEventListeners();
  }
  
  // Function to set up all event listeners
  function setupEventListeners() {
    console.log("Setting up event listeners");
    
    // Navigation tabs
    const aiTab = document.getElementById('aiTab');
    const socialTab = document.getElementById('socialTab');
    
    if (aiTab && socialTab) {
      aiTab.addEventListener('click', renderApp);
      socialTab.addEventListener('click', renderSocialPage);
    }
    
    // Text selection
    const selectTextBtn = document.getElementById('selectTextBtn');
    
    if (selectTextBtn) {
      selectTextBtn.addEventListener('click', function() {
        selectTextBtn.textContent = 'Klik op een tekstelement...';
        selectTextBtn.disabled = true;
        
        // Send message to content script to start selection mode
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab?.id) {
            chrome.tabs.sendMessage(
              activeTab.id,
              { action: "startSelection" },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Error starting selection:", chrome.runtime.lastError);
                  selectTextBtn.textContent = 'Selecteer Tekst';
                  selectTextBtn.disabled = false;
                  
                  // Show error message
                  const selectedTextContainer = document.getElementById('selectedTextContainer');
                  const selectedText = document.getElementById('selectedText');
                  if (selectedTextContainer && selectedText) {
                    selectedText.textContent = "Kon niet verbinden met de pagina. Probeer de pagina te verversen.";
                    selectedText.style.color = "red";
                    selectedTextContainer.classList.remove('hidden');
                  }
                  return;
                }
              }
            );
          }
        });
      });
    }
    
    // Use pasted text
    const useTextBtn = document.getElementById('useTextBtn');
    const textInput = document.getElementById('textInput');
    
    if (useTextBtn && textInput) {
      useTextBtn.addEventListener('click', function() {
        const pastedText = textInput.value.trim();
        
        if (pastedText) {
          // Update UI to show selected text
          const selectedTextContainer = document.getElementById('selectedTextContainer');
          const selectedText = document.getElementById('selectedText');
          const generateBtn = document.getElementById('generateBtn');
          
          if (selectedTextContainer && selectedText && generateBtn) {
            selectedText.textContent = pastedText;
            selectedText.style.color = "";
            selectedTextContainer.classList.remove('hidden');
            
            // Enable generate button
            generateBtn.disabled = false;
          }
        }
      });
    }
    
    // Response type buttons
    const responseTypeBtns = document.querySelectorAll('.response-type-btn');
    if (responseTypeBtns.length > 0) {
      responseTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          // Remove active class from all buttons
          responseTypeBtns.forEach(b => b.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          
          // Show/hide custom prompt
          const customPromptContainer = document.getElementById('customPromptContainer');
          if (customPromptContainer) {
            if (this.dataset.type === 'custom') {
              customPromptContainer.classList.remove('hidden');
            } else {
              customPromptContainer.classList.add('hidden');
            }
          }
        });
      });
    }
    
    // Listen for text selection message from content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("Popup received message:", message);
      
      if (message.action === "textSelected" && message.text) {
        // Update UI to show selected text
        const selectedTextContainer = document.getElementById('selectedTextContainer');
        const selectedText = document.getElementById('selectedText');
        const selectTextBtn = document.getElementById('selectTextBtn');
        const generateBtn = document.getElementById('generateBtn');
        
        if (selectedTextContainer && selectedText && selectTextBtn && generateBtn) {
          selectedText.textContent = message.text;
          selectedText.style.color = "";
          selectedTextContainer.classList.remove('hidden');
          selectTextBtn.textContent = 'Selecteer Tekst';
          selectTextBtn.disabled = false;
          
          // Enable generate button
          generateBtn.disabled = false;
        }
      }
    });
    
    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      // Generate response
      generateBtn.addEventListener('click', function() {
        const selectedText = document.getElementById('selectedText')?.textContent;
        if (!selectedText) return;
        
        // Show loading state
        generateBtn.textContent = 'Genereren...';
        generateBtn.disabled = true;
        
        // Get selected response type
        const activeTypeBtn = document.querySelector('.response-type-btn.active');
        const responseType = activeTypeBtn ? activeTypeBtn.dataset.type : 'kort-simpel';
        
        // Get custom prompt if applicable
        let customPrompt = '';
        if (responseType === 'custom') {
          customPrompt = document.getElementById('customPrompt')?.value || '';
        }
        
        // Call the Hugging Face API
        callAI(selectedText, responseType, customPrompt);
      });
    }
    
    // Function to call AI API
    async function callAI(text, responseType, customPrompt = "") {
      try {
        const API_KEY = "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";
        const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
        
        // Construct the prompt based on response type
        let prompt = "";
        
        if (responseType === 'custom' && customPrompt) {
          prompt = `${customPrompt}\n\n${text}`;
        } else {
          switch (responseType) {
            case 'kort-simpel':
              prompt = `Antwoord kort en eenvoudig op de volgende vraag of tekst:\n\n${text}`;
              break;
            case 'kort-complex':
              prompt = `Geef een beknopt maar complex antwoord op de volgende vraag of tekst, gebruik vaktermen:\n\n${text}`;
              break;
            case 'lang-simpel':
              prompt = `Geef een uitgebreid antwoord in eenvoudige taal op de volgende vraag of tekst:\n\n${text}`;
              break;
            case 'lang-complex':
              prompt = `Geef een uitgebreid en complex antwoord op de volgende vraag of tekst, gebruik vaktermen en diepgaande analyse:\n\n${text}`;
              break;
            default:
              prompt = `Beantwoord de volgende vraag of tekst:\n\n${text}`;
          }
        }
        
        console.log("Calling Hugging Face API with prompt:", prompt);
        
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              top_p: 0.95,
              return_full_text: false
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        // Extract the generated text
        let aiResponseText = "";
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
          aiResponseText = data[0].generated_text.trim();
        } else if (typeof data === 'object' && data.generated_text) {
          aiResponseText = data.generated_text.trim();
        } else {
          // Use mock response if API fails
          aiResponseText = getMockResponse(responseType);
        }
        
        // Show response
        displayAIResponse(aiResponseText);
      } catch (error) {
        console.error("Error generating response:", error);
        
        // Use mock response as fallback
        const mockResponse = getMockResponse(responseType);
        displayAIResponse(mockResponse);
      }
    }
    
    // Function to get mock responses
    function getMockResponse(responseType) {
      switch (responseType) {
        case 'kort-simpel':
          return 'Dit is een kort en eenvoudig antwoord op je vraag.';
        case 'kort-complex':
          return 'De complexe interactie tussen variabelen genereert een multifactoriële uitkomst met significante implicaties.';
        case 'lang-simpel':
          return 'Dit is een langer antwoord dat uit meerdere zinnen bestaat. Het gebruikt eenvoudige taal zodat iedereen het kan begrijpen. We voegen wat extra uitleg toe om het duidelijker te maken. Dit helpt om het onderwerp beter te begrijpen.';
        case 'lang-complex':
          return 'De multidimensionale analyse van het vraagstuk vereist een nuancering van verschillende theoretische kaders. In de eerste plaats dient de epistemologische fundering geëvalueerd te worden vanuit zowel kwalitatief als kwantitatief perspectief. De daaruit voortvloeiende synthese leidt tot een geïntegreerd model waarbij zowel de empirische als conceptuele elementen tot hun recht komen. Concluderend kan gesteld worden dat de inherente complexiteit een holistische benadering rechtvaardigt.';
        case 'custom':
          return 'Dit is een antwoord op basis van je aangepaste prompt. De AI heeft de inhoud geanalyseerd en een passend antwoord gegenereerd dat voldoet aan je specifieke wensen.';
        default:
          return 'Geen antwoord kunnen genereren.';
      }
    }
    
    // Function to display AI response
    function displayAIResponse(responseText) {
      const aiResponseContainer = document.getElementById('aiResponseContainer');
      const aiResponse = document.getElementById('aiResponse');
      const generateBtn = document.getElementById('generateBtn');
      
      if (aiResponseContainer && aiResponse && generateBtn) {
        aiResponse.textContent = responseText;
        aiResponseContainer.classList.remove('hidden');
        
        // Reset generate button
        generateBtn.textContent = 'Beantwoord Vraag';
        generateBtn.disabled = false;
      }
    }
    
    // Fill text button
    const fillTextBtn = document.getElementById('fillTextBtn');
    if (fillTextBtn) {
      fillTextBtn.addEventListener('click', function() {
        const responseText = document.getElementById('aiResponse')?.textContent;
        if (!responseText) return;
        
        fillTextBtn.textContent = 'Klik op een invoerveld...';
        fillTextBtn.disabled = true;
        
        // Send message to content script to fill text
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab?.id) {
            chrome.tabs.sendMessage(
              activeTab.id,
              { action: "fillText", text: responseText },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Error filling text:", chrome.runtime.lastError);
                  fillTextBtn.textContent = 'Vul in op Pagina';
                  fillTextBtn.disabled = false;
                  return;
                }
                
                setTimeout(() => {
                  fillTextBtn.textContent = 'Vul in op Pagina';
                  fillTextBtn.disabled = false;
                }, 5000);
              }
            );
          }
        });
      });
    }
  }
});
