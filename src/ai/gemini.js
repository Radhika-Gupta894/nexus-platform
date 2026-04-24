import { GoogleGenerativeAI } from "@google/generative-ai";

/* API KEY */
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
};

/* AI INSTANCE */
const getAIInstance = () => {
  const key = getApiKey();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};

/* STABLE MODELS */
const MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash"
];

/* TRY MODELS */
const runPrompt = async (prompt) => {
  const genAI = getAIInstance();
  if (!genAI) throw new Error("Missing API Key");

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName
      });

      const result = await model.generateContent(prompt);
      return (await result.response).text();

    } catch (err) {
      console.log("Model failed:", modelName);
    }
  }

  throw new Error("All models busy");
};

export const parseCleanJSON = (rawText) => {
  if (!rawText) return null;

  try {
    return JSON.parse(rawText.trim());
  } catch (e) {
    try {
      const cleaned = rawText
        .replace(/```json|```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (e2) {
      const match = rawText.match(/\{[\s\S]*\}/);

      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {}
      }

      return null;
    }
  }
};

/* CHAT */
export const chatWithAI = async (message) => {
  try {
    return await runPrompt(`
You are NEXUS Core AI.

You help with:
- civic complaints
- volunteers
- city issues
- emergency coordination

Reply professionally, briefly, clearly.

User Message:
${message}
`);
  } catch (err) {
    return "NEXUS AI temporarily busy. Please retry.";
  }
};

/* REPORT ANALYSIS */
export const analyzeReport = async (text) => {
  try {
    return await runPrompt(`
Return ONLY JSON:
{
 "category":"",
 "urgency":"High|Medium|Low",
 "summary":""
}

Analyze:
${text}
`);
  } catch (err) {
    return JSON.stringify({
      category: "General",
      urgency: "Medium",
      summary: "Auto fallback analysis"
    });
  }
};

/* CRISIS DETECTION */
export const detectCrisis = async (reports) => {
  const data = reports
    .map((r) => `${r.type} @ ${r.location}`)
    .join(", ");

  try {
    return await runPrompt(`
Return ONLY JSON:
{
 "crisis":"",
 "area":"",
 "severity":"High|Medium|Low",
 "action":""
}

Data:
${data}
`);
  } catch (err) {
    return JSON.stringify({
      crisis: "Unknown",
      area: "Unknown",
      severity: "Medium",
      action: "Manual review required"
    });
  }
};