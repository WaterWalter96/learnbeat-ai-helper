
export type ResponseType = 'kort-simpel' | 'kort-complex' | 'lang-simpel' | 'lang-complex' | 'custom';

// The API key should not be hardcoded in production
// This is only for demonstration purposes
const API_KEY = "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";
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// Function to generate response using Hugging Face API
export const generateAIResponse = async (
  text: string, 
  responseType: ResponseType, 
  customPrompt?: string
): Promise<string> {
  try {
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
    
    // Make API request
    console.log("Sending request to Hugging Face API with prompt:", prompt);
    
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
    
    // Extract the generated text from the response
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text.trim();
    } else if (typeof data === 'object' && data.generated_text) {
      return data.generated_text.trim();
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response. Please try again.");
  }
}

// Mock function for development/testing
export const generateMockResponse = async (responseType: ResponseType): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock response based on type
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
      return 'Dit is een aangepast antwoord gebaseerd op jouw specifieke instructies. De AI heeft geprobeerd zo goed mogelijk aan je wensen te voldoen.';
    default:
      return 'Geen antwoord kunnen genereren.';
  }
};
