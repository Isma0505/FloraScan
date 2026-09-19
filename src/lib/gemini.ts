import { GoogleGenAI, Type } from "@google/genai";
import type { PlantResult } from "@/types";

/**
 * Gemini model used for plant identification.
 * The user explicitly requested gemini-2.5-flash-lite.
 */
export const GEMINI_MODEL = "gemini-2.5-flash-lite";

/**
 * Structured JSON schema describing the plant identification result.
 * Gemini will return a JSON object matching this schema.
 */
const plantSchema = {
  type: Type.OBJECT,
  properties: {
    detected: {
      type: Type.BOOLEAN,
      description:
        "Whether a plant/flower was successfully detected in the image.",
    },
    plantName: {
      type: Type.STRING,
      description: "Common display name of the plant in the user's locale.",
    },
    latinName: {
      type: Type.STRING,
      description: "Scientific / botanical latin name of the plant.",
    },
    category: {
      type: Type.STRING,
      description:
        "Category such as: Bunga (Flower), Pohon (Tree), Sukulen (Succulent), Herba (Herb), Semak (Shrub), Paku (Fern), Anggrek (Orchid), etc.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score from 0 to 100.",
    },
    habitat: {
      type: Type.STRING,
      description: "Natural habitat and native region of the plant.",
    },
    benefits: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of benefits, uses, or ecological value.",
    },
    care: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of care instructions (light, water, soil, etc).",
    },
    dangerLevel: {
      type: Type.STRING,
      description:
        "Toxicity / danger level — must be exactly one of: 'Rendah' (Low), 'Sedang' (Medium), 'Tinggi' (High).",
    },
<<<<<<< HEAD
    isToxic: {
      type: Type.BOOLEAN,
      description:
        "Whether the plant is poisonous/toxic to humans or animals. Set true only when toxicity is known or strongly suspected.",
    },
=======
>>>>>>> origin/main
    description: {
      type: Type.STRING,
      description: "A short informative paragraph about the plant.",
    },
  },
  required: [
    "detected",
    "plantName",
    "latinName",
    "category",
    "confidence",
    "habitat",
    "benefits",
    "care",
    "dangerLevel",
<<<<<<< HEAD
    "isToxic",
=======
>>>>>>> origin/main
    "description",
  ],
};

const PLANT_PROMPT = `You are an expert botanist and plant identifier. Analyze the provided image and identify the plant, flower, leaf, or tree.

Respond in the SAME language as the user's locale tag. If locale is "id" respond in Bahasa Indonesia, if "en" respond in English.

Instructions:
- If the image clearly contains a plant/flower/leaf/tree, set "detected": true and fill all fields accurately.
- If the image does NOT contain a plant (e.g. it's a car, person, text, or random object), set "detected": false, use "Tidak Dikenali"/"Unknown" for name fields, empty arrays, "Rendah" for dangerLevel, confidence near 0, and a short description explaining no plant was found.
- "latinName" must be the real scientific binomial name (Genus species). If unsure, give the closest genus.
- "category" should be a single short category word.
- "dangerLevel" MUST be exactly one of: "Rendah", "Sedang", "Tinggi".
<<<<<<< HEAD
- "isToxic" MUST be true when the plant is poisonous/toxic and false when it is non-toxic. Do not infer toxicity from danger level alone.
=======
>>>>>>> origin/main
- "confidence" is your estimated identification confidence 0-100.
- "benefits" and "care" should each contain 3-6 concise, practical bullet points.
- "description" should be 1-3 sentences.

Locale: {locale}`;

/**
 * Call Gemini 2.5 Flash Lite to identify a plant from a base64 image.
 *
 * @param base64Image - a data URL like "data:image/jpeg;base64,..."
 * @param locale - "id" | "en"
 */
export async function identifyPlant(
  base64Image: string,
  locale: "id" | "en" = "id"
): Promise<PlantResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Parse the data URL into parts Gemini expects
  const match = base64Image.match(/^data:(image\/[\w+]+);base64,(.*)$/);
  if (!match) {
    throw new Error("INVALID_IMAGE_FORMAT");
  }
  const mimeType = match[1];
  const base64Data = match[2];

  const promptText = PLANT_PROMPT.replace("{locale}", locale);

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: promptText },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: plantSchema,
      temperature: 0.4,
    },
  });

  const raw = response.text ?? "";
  if (!raw) {
    throw new Error("EMPTY_RESPONSE");
  }

  let parsed: PlantResult;
  try {
    parsed = JSON.parse(raw) as PlantResult;
  } catch {
    throw new Error("INVALID_JSON_RESPONSE");
  }

  // Defensive defaults / normalization
  const safe: PlantResult = {
    detected: !!parsed.detected,
    plantName: parsed.plantName?.trim() || "Unknown",
    latinName: parsed.latinName?.trim() || "Unknown sp.",
    category: parsed.category?.trim() || "Tumbuhan",
    confidence: Number.isFinite(parsed.confidence)
      ? Math.max(0, Math.min(100, Number(parsed.confidence)))
      : 0,
    habitat: parsed.habitat?.trim() || "-",
    benefits: Array.isArray(parsed.benefits)
      ? parsed.benefits.map((b) => String(b).trim()).filter(Boolean)
      : [],
    care: Array.isArray(parsed.care)
      ? parsed.care.map((c) => String(c).trim()).filter(Boolean)
      : [],
    dangerLevel: parsed.dangerLevel?.trim() || "Rendah",
<<<<<<< HEAD
    isToxic: parsed.isToxic === true,
=======
>>>>>>> origin/main
    description: parsed.description?.trim() || "",
  };

  return safe;
}
