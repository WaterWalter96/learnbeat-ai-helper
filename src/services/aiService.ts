
// Service to handle AI API calls securely

// Note: In a production environment, this key should be stored on a backend server
// For this demo/prototype, we'll store it here but in a real-world scenario,
// this should be moved to a secure backend
const API_KEY = "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";
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// Type definitions for response types
export type ResponseType = 'kort-simpel' | 'kort-complex' | 'lang-simpel' | 'lang-complex' | 'custom';

// Function to generate prompt based on response type
function generatePrompt(text: string, responseType: ResponseType, customPrompt?: string): string {
  switch (responseType) {
    case 'kort-simpel':
      return `<s>[INST]Geef een kort en simpel antwoord van één zin op de volgende vraag of tekst. Gebruik eenvoudige taal: ${text}[/INST]</s>`;
    case 'kort-complex':
      return `<s>[INST]Geef een kort maar complex antwoord van één zin op de volgende vraag of tekst. Gebruik vakjargon waar nodig: ${text}[/INST]</s>`;
    case 'lang-simpel':
      return `<s>[INST]Geef een uitgebreid maar simpel antwoord van meerdere zinnen op de volgende vraag of tekst. Gebruik eenvoudige taal: ${text}[/INST]</s>`;
    case 'lang-complex':
      return `<s>[INST]Geef een uitgebreid en complex antwoord van meerdere zinnen op de volgende vraag of tekst. Gebruik vakjargon en gedetailleerde uitleg: ${text}[/INST]</s>`;
    case 'custom':
      return `<s>[INST]${customPrompt || 'Beantwoord de volgende vraag'}: ${text}[/INST]</s>`;
    default:
      return `<s>[INST]Beantwoord de volgende vraag of tekst: ${text}[/INST]</s>`;
  }
}

// Function to generate AI response
export async function generateAIResponse(
  text: string, 
  responseType: ResponseType, 
  customPrompt?: string
): Promise<string> {
  try {
    const prompt = generatePrompt(text, responseType, customPrompt);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the actual response from Hugging Face format
    // This may need adjustment based on the exact model and response format
    let generatedText = data[0]?.generated_text || "";
    
    // Clean up the response to extract just the model's answer (removing prompt)
    generatedText = generatedText.replace(prompt, "").trim();
    
    return generatedText || "Sorry, ik kon geen antwoord genereren. Probeer het nog eens.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Er is een fout opgetreden bij het genereren van het antwoord. Probeer het later nog eens.";
  }
}

// Mock function for testing when not in extension environment
export function generateMockResponse(responseType: ResponseType): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (responseType) {
        case 'kort-simpel':
          resolve('Dit is een kort en eenvoudig antwoord op je vraag.');
          break;
        case 'kort-complex':
          resolve('De complexe interactie tussen variabelen genereert een multifactoriële uitkomst met significante implicaties.');
          break;
        case 'lang-simpel':
          resolve('Dit is een langer antwoord dat uit meerdere zinnen bestaat. Het gebruikt eenvoudige taal zodat iedereen het kan begrijpen. We voegen wat extra uitleg toe om het duidelijker te maken. Dit helpt om het onderwerp beter te begrijpen.');
          break;
        case 'lang-complex':
          resolve('De multidimensionale analyse van het vraagstuk vereist een nuancering van verschillende theoretische kaders. In de eerste plaats dient de epistemologische fundering geëvalueerd te worden vanuit zowel kwalitatief als kwantitatief perspectief. De daaruit voortvloeiende synthese leidt tot een geïntegreerd model waarbij zowel de empirische als conceptuele elementen tot hun recht komen. Concluderend kan gesteld worden dat de inherente complexiteit een holistische benadering rechtvaardigt.');
          break;
        case 'custom':
          resolve('Dit is een antwoord op basis van je aangepaste prompt. De AI heeft de inhoud geanalyseerd en een passend antwoord gegenereerd dat voldoet aan je specifieke wensen.');
          break;
        default:
          resolve('Dit is een standaard antwoord op je vraag.');
      }
    }, 1500); // Simulate API delay
  });
}
