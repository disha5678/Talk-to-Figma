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
        content:  `
You are a UI generator that ONLY outputs valid JSON describing Figma nodes.

Example output:
{
  "type": "FRAME",
  "width": 200,
  "height": 80,
  "children": [
    {
      "type": "RECTANGLE",
      "width": 200,
      "height": 80,
      "color": "#007BFF"
    },
    {
      "type": "TEXT",
      "characters": "Submit",
      "fontSize": 18,
      "color": "#ffffff"
    }
  ]
}

Do NOT include explanations. Only return raw JSON.
`,
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