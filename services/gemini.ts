
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// 1. High-quality recommendations (Flash for reasoning + search)
export const getUXRecommendations = async (metrics: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following railway booking funnel metrics: ${JSON.stringify(metrics)}, 
      provide 3 actionable UX recommendations to improve conversion. 
      Format as JSON with fields: recommendation, reason, impactLevel (High/Medium).`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [];
  }
};

// 2. Search Grounded Station Suggestions
export const getStationSuggestions = async (query: string) => {
  if (!query || query.length < 2) return { suggestions: [], sources: [] };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a list of 5 real Indian Railway stations starting with or matching the query: "${query}". 
      Return only the official station names and their codes in brackets, e.g., "New Delhi (NDLS)".`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      },
    });

    const data = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      suggestions: data.suggestions || [],
      sources: sources.map((chunk: any) => chunk.web?.uri).filter(Boolean)
    };
  } catch (error) {
    console.error("Station Search Error:", error);
    return { suggestions: [], sources: [] };
  }
};

// 3. Real-time Train Status (Search Grounding)
export const getRealTimeTrainStatus = async (trainNumber: string, trainName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `What is the current live running status of Train ${trainNumber} (${trainName})? Include platform info and delay if possible. Be concise.`,
      config: {
        tools: [{ googleSearch: {} }]
      },
    });
    
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = sources.map((chunk: any) => chunk.web?.uri).filter(Boolean);

    return { text, urls };
  } catch (error) {
    console.error("Live Status Error:", error);
    return { text: "Live status currently unavailable. Please check official IRCTC site.", urls: [] };
  }
};

// 4. Low-latency Route Tips (Gemini 2.5 Flash Lite)
export const getRouteTips = async (from: string, to: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Give 2 very short, helpful travel tips for a train journey from ${from} to ${to}. Focus on food, scenic views, or timing. Max 15 words each.`,
    });
    return response.text;
  } catch (error) {
    return "";
  }
};

// 5. High-powered AI Chatbot (Gemini 3 Pro) with Google Search Grounding
export const startChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are RailFlow AI, a helpful railway booking assistant. You help users with train schedules, food options, baggage rules, and general IRCTC-related queries. Use Google Search to provide accurate, up-to-date information about delays, platform numbers, and recent policy changes. Be professional, friendly, and concise.",
      tools: [{ googleSearch: {} }]
    },
  });
};
