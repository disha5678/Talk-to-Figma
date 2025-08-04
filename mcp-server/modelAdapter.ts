import { config } from "dotenv";
config();
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getModelResponse(prompt: string) {
const systemPrompt = `
You are an AI design assistant. Given a user prompt, return a JSON schema representing UI components in Figma.

Format:
{
"type": "text" | "rectangle" | "frame",
"properties": {
...
}
}
`;

const completion = await openai.chat.completions.create({
model: "gpt-4",
messages: [
{ role: "system", content: systemPrompt },
{ role: "user", content: prompt }
],
temperature: 0.7
});

const response = completion.choices[0]?.message?.content;

if (!response) throw new Error("No response from OpenAI");

try {
const parsed = JSON.parse(response);
return parsed;
} catch (err) {
throw new Error("Invalid JSON returned by OpenAI");
}
}