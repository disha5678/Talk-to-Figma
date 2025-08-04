// mcp-server/modelAdapter.ts
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getModelResponse(messages: any[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4" if available
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
