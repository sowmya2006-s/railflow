
import OpenAI from "openai";

// Initialize OpenAI client for Grok (xAI)
// Note: dangerous usage in client-side code, but matching previous Gemini pattern
const ai = new OpenAI({
    apiKey: process.env.API_KEY || '',
    baseURL: typeof window !== 'undefined' ? `${window.location.origin}/api/xai` : "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true
});

// Debug logging
console.log("Groq Service Initialized");
console.log("API Key present:", !!process.env.API_KEY);
if (process.env.API_KEY) {
    console.log("API Key length:", process.env.API_KEY.length);
    console.log("API Key start:", process.env.API_KEY.substring(0, 4) + "...");
} else {
    console.error("API Key is MISSING in process.env.API_KEY");
}

// Helper for JSON parsing
const cleanAndParseJSON = (text: string) => {
    try {
        // Attempt to find JSON array or object in the response
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error", e);
        return null;
    }
};

// 1. High-quality recommendations
export const getUXRecommendations = async (metrics: any) => {
    try {
        const response = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a UX expert. Analyze the railway booking metrics and provide recommendations." },
                {
                    role: "user",
                    content: `Based on the following railway booking funnel metrics: ${JSON.stringify(metrics)}, 
          provide 3 actionable UX recommendations to improve conversion. 
          Format as JSON with fields: recommendation, reason, impactLevel (High/Medium).
          Return valid JSON only.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const text = response.choices[0].message.content || "[]";
        const parsed = cleanAndParseJSON(text);

        // Handle potential response structures (array or object with key)
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') {
            // If wrapped in a key like "recommendations"
            const values = Object.values(parsed);
            if (values.length > 0 && Array.isArray(values[0])) return values[0];
            return [];
        }
        return [];
    } catch (error) {
        console.error("AI Insights Error:", error);
        return [];
    }
};

// 2. Station Suggestions
export const getStationSuggestions = async (query: string) => {
    if (!query || query.length < 2) return { suggestions: [], sources: [] };

    try {
        const response = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful Indian Railways assistant." },
                {
                    role: "user",
                    content: `Provide a list of 5 real Indian Railway stations starting with or matching the query: "${query}". 
          Return only the official station names and their codes in brackets, e.g., "New Delhi (NDLS)".
          Return the result as a JSON object with a key "suggestions" containing the array of strings.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const text = response.choices[0].message.content || "{}";
        const data = cleanAndParseJSON(text);

        return {
            suggestions: data?.suggestions || [],
            sources: [] // Grok API doesn't standardly return sources like Gemini
        };
    } catch (error) {
        console.error("Station Search Error:", error);
        return { suggestions: [], sources: [] };
    }
};

// 3. Real-time Train Status
export const getRealTimeTrainStatus = async (trainNumber: string, trainName: string) => {
    try {
        const response = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful Indian Railways assistant with access to real-time info." },
                {
                    role: "user",
                    content: `What is the current live running status of Train ${trainNumber} (${trainName})? Include platform info and delay if possible. Be concise.`
                }
            ],
        });

        const text = response.choices[0].message.content || "Status unavailable.";

        return {
            text,
            urls: [] // Source URLs not available in standard completion
        };
    } catch (error) {
        console.error("Live Status Error:", error);
        return { text: "Live status currently unavailable via RailFlow AI.", urls: [] };
    }
};

// 4. Low-latency Route Tips
export const getRouteTips = async (from: string, to: string) => {
    try {
        const response = await ai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `Give 2 very short, helpful travel tips for a train journey from ${from} to ${to}. Focus on food, scenic views, or timing. Max 15 words each.`
                }
            ],
            max_tokens: 100
        });
        return response.choices[0].message.content || "";
    } catch (error) {
        console.error("Route tips error", error);
        return "";
    }
};

// 5. Chat Session Wrapper
class ChatSession {
    private history: any[] = [];
    private model: string = "llama-3.3-70b-versatile";

    constructor(systemInstruction: string) {
        this.history = [{ role: "system", content: systemInstruction }];
    }

    async sendMessage(params: { message: string }) {
        this.history.push({ role: "user", content: params.message });
        try {
            const response = await ai.chat.completions.create({
                model: this.model,
                messages: this.history,
            });
            const text = response.choices[0].message.content || "";

            this.history.push({ role: "assistant", content: text });

            // Return structure matching Gemini's expected output in UI
            // to avoid breaking changes in AIChatBot.tsx
            return {
                text,
                candidates: [{
                    groundingMetadata: {
                        groundingChunks: []
                    }
                }]
            };
        } catch (e) {
            console.error("Chat Error", e);
            throw e;
        }
    }
}

export const startChatSession = () => {
    return new ChatSession(
        "You are RailFlow AI, a helpful railway booking assistant. You help users with train schedules, food options, baggage rules, and general IRCTC-related queries. Be professional, friendly, and concise."
    );
};
