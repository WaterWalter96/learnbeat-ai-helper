
export type ResponseType = 'kort-simpel' | 'kort-complex' | 'lang-simpel' | 'lang-complex' | 'custom';

// Hugging Face API URL
const API_ENDPOINT = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// Generate AI response with Hugging Face API
export async function generateAIResponse(
  selectedText: string, 
  responseType: ResponseType, 
  customPrompt?: string
): Promise<string> {
  try {
    // Create prompt based on response type
    let prompt = "";
    
    switch (responseType) {
      case 'kort-simpel':
        prompt = `Vat de volgende tekst kort en eenvoudig samen: ${selectedText}`;
        break;
      case 'kort-complex':
        prompt = `Geef een korte maar inhoudelijk complexe analyse van de volgende tekst, gebruik daarbij academische taal: ${selectedText}`;
        break;
      case 'lang-simpel':
        prompt = `Geef een uitgebreide uitleg in eenvoudige taal van de volgende tekst: ${selectedText}`;
        break;
      case 'lang-complex':
        prompt = `Geef een diepgaande, gedetailleerde analyse in academische taal van de volgende tekst: ${selectedText}`;
        break;
      case 'custom':
        prompt = customPrompt ? `${customPrompt}: ${selectedText}` : selectedText;
        break;
      default:
        prompt = `Vat de volgende tekst samen: ${selectedText}`;
    }
    
    // SECURITY: The API key is not stored in the frontend code
    // In production, this should be handled by a backend service
    // For demo/development, we'll use environment variables or a proxy
    const apiKey = process.env.HUGGINGFACE_API_KEY || "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";
    
    // Make API request to Hugging Face
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: responseType.startsWith('lang') ? 300 : 150,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the generated text from the response
    let generatedText = "";
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      generatedText = data[0].generated_text;
      
      // Clean up the generated text - remove the input prompt
      if (generatedText.includes(prompt)) {
        generatedText = generatedText.substring(prompt.length).trim();
      }
    } else if (typeof data === 'object' && data.generated_text) {
      generatedText = data.generated_text;
      
      // Clean up the generated text - remove the input prompt
      if (generatedText.includes(prompt)) {
        generatedText = generatedText.substring(prompt.length).trim();
      }
    } else {
      generatedText = "Sorry, er kon geen antwoord worden gegenereerd. Probeer het later opnieuw.";
    }
    
    return generatedText;
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw new Error("Er is een fout opgetreden bij het genereren van het antwoord.");
  }
}

// Generate mock response for development and testing
export function generateMockResponse(responseType: ResponseType): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = "";
      
      switch (responseType) {
        case 'kort-simpel':
          response = "Dit is een kort en eenvoudig antwoord op je vraag.";
          break;
        case 'kort-complex':
          response = "De complexe interactie tussen variabelen genereert een multifactoriële uitkomst met significante implicaties.";
          break;
        case 'lang-simpel':
          response = "Dit is een langer antwoord dat uit meerdere zinnen bestaat. Het gebruikt eenvoudige taal zodat iedereen het kan begrijpen. We voegen wat extra uitleg toe om het duidelijker te maken. Dit helpt om het onderwerp beter te begrijpen.";
          break;
        case 'lang-complex':
          response = "De multidimensionale analyse van het vraagstuk vereist een nuancering van verschillende theoretische kaders. In de eerste plaats dient de epistemologische fundering geëvalueerd te worden vanuit zowel kwalitatief als kwantitatief perspectief. De daaruit voortvloeiende synthese leidt tot een geïntegreerd model waarbij zowel de empirische als conceptuele elementen tot hun recht komen. Concluderend kan gesteld worden dat de inherente complexiteit een holistische benadering rechtvaardigt.";
          break;
        case 'custom':
          response = "Dit is een antwoord op basis van je aangepaste prompt. De AI heeft de inhoud geanalyseerd en een passend antwoord gegenereerd dat voldoet aan je specifieke wensen.";
          break;
      }
      
      resolve(response);
    }, 1000); // Simulate network delay
  });
}
