
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
                  console.error(chrome.runtime.lastError);
                  selectTextBtn.textContent = 'Selecteer Tekst';
                  selectTextBtn.disabled = false;
                  return;
                }
              }
            );
          }
        });
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
    
    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      // Enable button if text is selected
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "textSelected" && message.text) {
          // Update UI to show selected text
          const selectedTextContainer = document.getElementById('selectedTextContainer');
          const selectedText = document.getElementById('selectedText');
          const selectTextBtn = document.getElementById('selectTextBtn');
          
          if (selectedTextContainer && selectedText && selectTextBtn) {
            selectedText.textContent = message.text;
            selectedTextContainer.classList.remove('hidden');
            selectTextBtn.textContent = 'Selecteer Tekst';
            selectTextBtn.disabled = false;
            
            // Enable generate button
            generateBtn.disabled = false;
          }
        }
      });
      
      // Generate response
      generateBtn.addEventListener('click', function() {
        const selectedText = document.getElementById('selectedText')?.textContent;
        if (!selectedText) return;
        
        // Show loading state
        generateBtn.textContent = 'Genereren...';
        generateBtn.disabled = true;
        
        setTimeout(() => {
          // Get selected response type
          const activeTypeBtn = document.querySelector('.response-type-btn.active');
          const responseType = activeTypeBtn ? activeTypeBtn.dataset.type : 'kort-simpel';
          
          // Get custom prompt if applicable
          let customPrompt = '';
          if (responseType === 'custom') {
            customPrompt = document.getElementById('customPrompt')?.value || '';
          }
          
          // Generate response based on type (simulated)
          let response = '';
          
          switch (responseType) {
            case 'kort-simpel':
              response = 'Dit is een kort en eenvoudig antwoord op je vraag.';
              break;
            case 'kort-complex':
              response = 'De complexe interactie tussen variabelen genereert een multifactoriële uitkomst met significante implicaties.';
              break;
            case 'lang-simpel':
              response = 'Dit is een langer antwoord dat uit meerdere zinnen bestaat. Het gebruikt eenvoudige taal zodat iedereen het kan begrijpen. We voegen wat extra uitleg toe om het duidelijker te maken. Dit helpt om het onderwerp beter te begrijpen.';
              break;
            case 'lang-complex':
              response = 'De multidimensionale analyse van het vraagstuk vereist een nuancering van verschillende theoretische kaders. In de eerste plaats dient de epistemologische fundering geëvalueerd te worden vanuit zowel kwalitatief als kwantitatief perspectief. De daaruit voortvloeiende synthese leidt tot een geïntegreerd model waarbij zowel de empirische als conceptuele elementen tot hun recht komen. Concluderend kan gesteld worden dat de inherente complexiteit een holistische benadering rechtvaardigt.';
              break;
            case 'custom':
              response = 'Dit is een antwoord op basis van je aangepaste prompt. De AI heeft de inhoud geanalyseerd en een passend antwoord gegenereerd dat voldoet aan je specifieke wensen.';
              break;
          }
          
          // Show response
          const aiResponseContainer = document.getElementById('aiResponseContainer');
          const aiResponse = document.getElementById('aiResponse');
          
          if (aiResponseContainer && aiResponse) {
            aiResponse.textContent = response;
            aiResponseContainer.classList.remove('hidden');
            
            // Reset generate button
            generateBtn.textContent = 'Beantwoord Vraag';
            generateBtn.disabled = false;
          }
        }, 1500); // Simulate API delay
      });
    }
    
    // Fill text button
    const fillTextBtn = document.getElementById('fillTextBtn');
    if (fillTextBtn) {
      fillTextBtn.addEventListener('click', function() {
        const responseText = document.getElementById('aiResponse')?.textContent;
        if (!responseText) return;
        
        // Send message to content script to fill text
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab?.id) {
            chrome.tabs.sendMessage(
              activeTab.id,
              { action: "fillText", text: responseText },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                  return;
                }
              }
            );
          }
        });
      });
    }
  }
});
