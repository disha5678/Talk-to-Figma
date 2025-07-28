figma.showUI(__html__, { width: 300, height: 250 });

figma.ui.onmessage = async (msg) => {
if (msg.type === 'generate') {
const prompt = msg.prompt;


// This is where you'd connect with MCP or your backend.
// For now, insert a text node with the prompt.
await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
const text = figma.createText();
text.characters = prompt;
figma.currentPage.appendChild(text);
figma.viewport.scrollAndZoomIntoView([text]);

figma.closePlugin("Generated node from prompt");
}
};