// mcp-server/modelAdapter.ts
const OpenAI = require ("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getModelResponse(messages: any[]): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // or "gpt-4" if available
    messages: [
      {
        role: "system",
        content: "You are a UI generator that outputs JSON describing Figma nodes.",
      },
      ...messages,
    ],
  });

  const rawText = completion.choices[0].message?.content || "";

  try {
    return JSON.parse(rawText); // Expecting GPT to output JSON
  } catch {
    console.error("Model did not return valid JSON. Wrapping raw output.");
    return { type: "FRAME", children: [], rawOutput: rawText };
  }
}

module.exports = { getModelResponse };