import { GoogleGenerativeAI } from "@google/generative-ai";

/* ==============================
   API CONFIGURATION
============================== */
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || "";

const getAIInstance = () => {
  const key = getApiKey();
  if (!key || key.trim() === "") {
    console.error("🚨 NEXUS ERROR: VITE_GEMINI_API_KEY is empty or missing in .env.");
    return null;
  }
  return new GoogleGenerativeAI(key);
};

const MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

/* ==============================
   UNIVERSAL MODEL RUNNER
 ============================== */
const runPrompt = async (prompt, retryCount = 1) => {
  const genAI = getAIInstance();
  if (!genAI) throw new Error("API Key Missing");

  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`⚡ NEXUS AI: Attempting ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (text) {
        console.log(`✅ NEXUS AI: Connected to ${modelName}`);
        return text;
      }
    } catch (error) {
      lastError = error;
      const errorMsg = error.message || "";
      console.warn(`❌ NEXUS AI: ${modelName} unavailable (${errorMsg})`);
      
      // If error is definitely API key related, stop and report
      if (errorMsg.includes("API key not found") || errorMsg.includes("invalid") || errorMsg.includes("expired")) {
        throw new Error(`Invalid API Key: ${errorMsg}`);
      }
      
      continue; // Try next model
    }
  }

  throw lastError || new Error("All AI models are currently overwhelmed or unavailable.");
};

/* ==============================
   MOCK FALLBACK (Emergency only)
 ============================== */
const getMockResponse = (prompt) => {
  if (prompt.includes("Analyze")) {
    return JSON.stringify({ category: "General", urgency: "Medium", summary: "NEXUS: Analyzing intelligence offline..." });
  }
  return "NEXUS Core is in secure offline mode. Intelligence services are restricted. Please check your API key authorization.";
};

/* ==============================
   CORE EXPORTS
 ============================== */
export const parseCleanJSON = (rawText) => {
  try {
    return JSON.parse(rawText.trim());
  } catch {
    const cleaned = (rawText || "").replace(/```json|```/g, "").trim();
    try { return JSON.parse(cleaned); } catch {
      const match = (rawText || "").match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    }
  }
};

export const chatWithAI = async (message) => {
  try {
    return await runPrompt(`Respond to: ${message}`);
  } catch (error) {
    console.error("🚨 Critical AI Error:", error);
    
    const errorMsg = error.message || "";
    
    if (errorMsg.includes("404") || errorMsg.includes("not found")) {
      return `NEXUS AI Connection Error (404): The selected models are not found for your API key. This can happen if the 'Generative Language API' is not enabled for your project or if your region is restricted. Please check your Google AI Studio dashboard.`;
    }
    
    if (errorMsg.includes("API key") || errorMsg.includes("403") || errorMsg.includes("401")) {
      return `NEXUS AI Error: Authentication failed. ${errorMsg}. Please ensure your VITE_GEMINI_API_KEY is correct.`;
    }
    
    if (errorMsg.includes("busy") || errorMsg.includes("overloaded") || errorMsg.includes("503")) {
      return "NEXUS AI is currently experiencing high traffic. Retrying connection... (Wait a moment and try again)";
    }

    return `NEXUS AI Connection Issue: ${errorMsg}`;
  }
};

export const analyzeReport = async (text) => {
  try {
    return await runPrompt(`Analyze: ${text}`, 0);
  } catch {
    return JSON.stringify({ category: "General", urgency: "Medium", summary: "Offline analysis pending." });
  }
};

export const detectCrisis = async (reports) => {
  if (!reports?.length) return null;
  try {
    return await runPrompt(`Crisis scan: ${JSON.stringify(reports)}`, 0);
  } catch {
    return JSON.stringify({ crisis: "Unknown", area: "N/A", severity: "Low", action: "Manual check." });
  }
};