import OpenAI from "openai";

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === "") {
    console.warn("OpenAI API key not found. AI features will be disabled.");
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

// Analyze sentiment from news headlines
export const analyzeSentiment = async (headlines, coinName) => {
  const client = getOpenAIClient();
  
  if (!client) {
    return {
      error: "OpenAI API key not configured",
      sentiment: 0,
      summary: "AI features disabled. Add your OpenAI API key to .env file.",
    };
  }

  try {
    const prompt = `You are a professional Quant Analyst. Analyze these market signals for ${coinName}:

${headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Return ONLY a JSON object with these exact keys:
- "score": number from -1 (very bearish) to 1 (very bullish)
- "verdict": ONE WORD only (BULLISH, BEARISH, ACCUMULATE, NEUTRAL, or VOLATILE)
- "logic": ONE concise sentence explaining the primary reason
- "risk_level": "Low", "Medium", or "High"
- "primary_driver": What's driving this? (e.g., "Whale Activity", "Social Hype", "Real Volume", "Momentum Shift", "Market Correction")
- "confidence": number from 0 to 1
- "price_target": If current sentiment holds, suggest next resistance/support level as a percentage change (e.g., "+15%" or "-8%")

Be analytical, not descriptive. Think like a trader, not a reporter.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a crypto market analyst. Provide objective sentiment analysis.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      sentiment: result.score,
      verdict: result.verdict,
      logic: result.logic,
      risk_level: result.risk_level,
      primary_driver: result.primary_driver,
      confidence: result.confidence,
      price_target: result.price_target,
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return {
        error: "OpenAI quota exceeded",
        sentiment: 0,
        summary: "AI features require OpenAI billing to be set up.",
      };
    }
    
    return {
      error: error.message,
      sentiment: 0,
      summary: "Unable to analyze sentiment at this time.",
    };
  }
};

// Natural language query handler
export const queryPortfolio = async (question, cryptoData) => {
  const client = getOpenAIClient();
  
  if (!client) {
    return "AI query feature requires an OpenAI API key.";
  }

  try {
    const dataContext = JSON.stringify(
      cryptoData.map((coin) => ({
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        change_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        rank: coin.market_cap_rank,
      }))
    );

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful crypto portfolio assistant. Answer questions about this cryptocurrency data: ${dataContext}. Be conversational and helpful. Keep answers concise (2-3 sentences max).`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Query error:", error);
    return `Sorry, I couldn't process that question: ${error.message}`;
  }
};

// AI Crypto Education Assistant
export const askCryptoAssistant = async (question, conversationHistory = []) => {
  const client = getOpenAIClient();
  
  if (!client) {
    return "AI assistant requires an OpenAI API key.";
  }

  try {
    const messages = [
      {
        role: "system",
        content: `You are a knowledgeable cryptocurrency education assistant. Explain crypto concepts clearly and simply. Keep explanations beginner-friendly but accurate.`,
      },
      ...conversationHistory,
      { role: "user", content: question },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Assistant error:", error);
    return `Sorry, I encountered an error: ${error.message}`;
  }
};

// Summarize long articles
export const summarizeArticle = async (articleText, maxLength = 3) => {
  const client = getOpenAIClient();
  
  if (!client) {
    return ["AI summarization requires an OpenAI API key."];
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Summarize the following crypto article into exactly ${maxLength} concise bullet points.`,
        },
        { role: "user", content: articleText },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const summary = response.choices[0].message.content;
    return summary.split("\n").filter((line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./));
  } catch (error) {
    console.error("Summarization error:", error);
    return ["Unable to summarize article."];
  }
};

// Check if AI features are available
export const isAIEnabled = () => {
  return !!process.env.REACT_APP_OPENAI_API_KEY && process.env.REACT_APP_OPENAI_API_KEY !== "";
};
