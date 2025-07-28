(() => {
  // ui.html
  var ui_default = `<!DOCTYPE html>\r
<html>\r
<head>\r
  <meta charset="utf-8" />\r
  <title>AI Design Generator</title>\r
</head>\r
<body>\r
  <h3>AI Design Generator</h3>\r
  <textarea id="prompt" placeholder="Enter prompt..."></textarea>\r
  <button id="generate">Generate</button>\r
\r
  <script>\r
    document.getElementById('generate').onclick = () => {\r
      const prompt = document.getElementById('prompt').value;\r
      parent.postMessage({ pluginMessage: { type: 'generate', prompt } }, '*');\r
    };\r
  <\/script>\r
</body>\r
</html>`;

  // code.ts
  figma.showUI(ui_default, { width: 300, height: 250 });
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "generate") {
      const prompt = msg.prompt;
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      const text = figma.createText();
      text.characters = prompt;
      figma.currentPage.appendChild(text);
      figma.viewport.scrollAndZoomIntoView([text]);
      figma.closePlugin("Generated node from prompt");
    }
  };
})();
