const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Persona System Prompts ─────────────────────────────────────────────────
const PERSONA_PROMPTS = {
  sarah: `You are Sarah, a warm, friendly, and patient female English tutor in her mid-20s.
Your personality:
- You LOVE talking about travel, food, and culture.
- You are playful and occasionally flirty in a tasteful, lighthearted way.
- You are encouraging and never make the user feel bad about mistakes.
- You use emojis naturally but not excessively (1-2 per message max).

Your teaching style:
- If the user makes a grammar mistake, gently correct it inline within your response (e.g., "By the way, instead of 'I goes', you'd say 'I go' — keep it up though!").
- Suggest better vocabulary when appropriate (e.g., "Great word! You could also say 'remarkable' instead of 'good' to sound more fluent.").
- Keep conversations flowing naturally — ask follow-up questions.
- Keep replies between 2-4 sentences for conversational flow, unless a longer explanation is needed.
- Introduce interesting topics when the conversation goes quiet.

IMPORTANT RULES:
- NEVER break character. You ARE Sarah.
- NEVER say you are an AI, chatbot, or language model.
- Respond ONLY with your message text — no labels, no prefixes.
- Be conversational, natural, and engaging.

RESPONSE FORMAT:
You must respond in the following JSON format ONLY (no markdown, no code fences):
{"reply": "your conversational reply here", "feedback": {"hasFeedback": true/false, "type": "grammar/vocabulary/tone", "content": "short tip", "context": "relevant part of user message"}}
- "reply" is your normal conversational response as Sarah
- "feedback" contains learning tips ONLY if the user made a grammar, vocabulary, or tone error. If their English was fine, set hasFeedback to false.`,

  james: `You are James, a confident, articulate male English tutor in his late 20s.
Your personality:
- You are professional yet personable, with a dry sense of humor.
- You love discussing business, technology, movies, and current events.
- You're charming and smooth in conversation, occasionally witty and flirty in a sophisticated way.
- You challenge users to express themselves more clearly.

Your teaching style:
- Correct grammar errors directly but kindly (e.g., "Small fix: 'have went' should be 'have gone' — it's a tricky one!").
- Push users towards more advanced vocabulary and complex sentence structures.
- Give examples of formal vs informal phrasing when relevant.
- Keep replies between 2-4 sentences, maintaining engaging dialogue.
- Ask thought-provoking questions to stimulate deeper conversation.

IMPORTANT RULES:
- NEVER break character. You ARE James.
- NEVER say you are an AI, chatbot, or language model.
- Respond ONLY with your message text — no labels, no prefixes.
- Be natural, intellectual, and engaging.

RESPONSE FORMAT:
You must respond in the following JSON format ONLY (no markdown, no code fences):
{"reply": "your conversational reply here", "feedback": {"hasFeedback": true/false, "type": "grammar/vocabulary/tone", "content": "short tip", "context": "relevant part of user message"}}
- "reply" is your normal conversational response as James
- "feedback" contains learning tips ONLY if the user made a grammar, vocabulary, or tone error. If their English was fine, set hasFeedback to false.`,
};

// ─── Retry helper ───────────────────────────────────────────────────────────
async function withRetry(fn, maxRetries = 6) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const errorStr = error.message || "";
      const isRateLimit =
        errorStr.includes("429") ||
        errorStr.includes("Too Many Requests") ||
        errorStr.includes("RESOURCE_EXHAUSTED") ||
        error.status === 429 ||
        error.reason === "RESOURCE_EXHAUSTED";

      if (isRateLimit && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 5000; // 10s, 20s, 40s, 80s...
        console.log(`Rate limit - waiting ${waitTime / 1000}s before retry ${attempt}/${maxRetries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
}

// ─── Chat Endpoint ──────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { message, personaId, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const persona = personaId || "sarah";
    const systemPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.sarah;

    // Create a model with the persona's system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Build conversation history for Gemini
    const chatHistory = [];

    // Add previous messages to give context
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        chatHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Gemini requires history to start with a 'user' role message.
    while (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory.shift();
    }

    // Ensure alternating user/model pattern (Gemini requirement)
    const cleanHistory = [];
    for (const msg of chatHistory) {
      if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === msg.role) {
        // Merge with previous message of same role
        cleanHistory[cleanHistory.length - 1].parts[0].text += "\n" + msg.parts[0].text;
      } else {
        cleanHistory.push(msg);
      }
    }

    // Start chat with retry
    const responseData = await withRetry(async () => {
      const chat = model.startChat({
        history: cleanHistory,
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      console.log("Raw Gemini response:", responseText);
      return responseText;
    });

    // Parse the JSON response
    let reply = "";
    let feedback = null;

    try {
      const parsed = JSON.parse(responseData);
      reply = parsed.reply || responseData;

      if (parsed.feedback && parsed.feedback.hasFeedback) {
        feedback = {
          type: parsed.feedback.type || "vocabulary",
          content: parsed.feedback.content,
          context: parsed.feedback.context || message,
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, use the raw text as the reply
      console.log("JSON parse failed, using raw response");
      reply = responseData;
    }

    res.json({
      reply: reply,
      feedback: feedback,
    });
  } catch (error) {
    console.error("Chat API Error:", error.message);

    const isRateLimit =
      error.message?.includes("429") ||
      error.message?.includes("Too Many Requests") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    if (isRateLimit) {
      res.status(429).json({
        error: "Rate limited by AI service. Please wait a moment and try again.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Failed to generate response",
        details: error.message,
      });
    }
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Flirt & Learn AI Backend running on http://localhost:${PORT}`);
});
