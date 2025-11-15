
import { GoogleGenAI, Type } from "@google/genai";
import type { Report, Part } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        partDescription: {
            type: Type.OBJECT,
            properties: {
                title: {
                    type: Type.STRING,
                    description: "A short title describing the sheet metal part, e.g., 'L-Bracket with Mounting Holes'."
                },
                details: {
                    type: Type.ARRAY,
                    description: "A list of strings describing key semantic features identified from the drawing, such as material thickness, hole diameters, bend angles, and overall dimensions.",
                    items: { type: Type.STRING }
                }
            }
        },
        faults: {
            type: Type.ARRAY,
            description: "An array of potential design faults found in the part.",
            items: {
                type: Type.OBJECT,
                properties: {
                    faultDescription: {
                        type: Type.STRING,
                        description: "A clear and concise description of the design fault."
                    },
                    analysis: {
                        type: Type.STRING,
                        description: "A brief analysis explaining why this is considered a fault, referencing specific features from the drawing."
                    },
                    violatedRule: {
                        type: Type.STRING,
                        description: "The specific design rule that is being violated, stated as a clear rule (e.g., 'Hole diameter should be at least equal to material thickness.')."
                    }
                }
            }
        }
    }
};

export const analyzeDesign = async (
  cadPdfBase64: string,
  faultsJsonText: string,
  chromaDbFileName: string,
  pdfMimeType: string,
): Promise<Report> => {
  const model = "gemini-2.5-flash";

  const pdfPart: Part = {
    inlineData: {
      mimeType: pdfMimeType,
      data: cadPdfBase64.split(',')[1],
    },
  };
  
  const textPart = {
    text: `
      You are an expert AI agent for sheet metal manufacturing design rule checking. Your knowledge base of design rules is represented by a file named '${chromaDbFileName}', and you have been provided with a list of common real-world faults in JSON format. A PDF of a CAD drawing for a sheet metal part is also provided.

      Your tasks are:
      1.  **Analyze the CAD Drawing:** Scrutinize the provided PDF drawing. Identify key semantic features like sheet thickness, hole diameters, bend radii, distances between features, and edge-to-hole distances.
      2.  **Identify Violations:** Based on your analysis and the context from the common faults file, identify potential design violations in the CAD drawing.
      3.  **Cite Design Rules:** For each violation, cite the most likely design rule that was broken. You must act as if you are referencing the knowledge base.
      4.  **Generate a Report:** Format your entire output as a single JSON object that strictly adheres to the provided schema. Do not include any text, explanations, or markdown formatting outside of the JSON object.

      **Context from common faults JSON file:**
      \`\`\`json
      ${faultsJsonText}
      \`\`\`
    `,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [textPart, pdfPart] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as Report;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model. The model may have had trouble interpreting the documents.");
  }
};
