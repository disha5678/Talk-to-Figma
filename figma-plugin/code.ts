/// <reference types="@figma/plugin-typings" />
import html from './ui.html';

figma.showUI(html, { width: 300, height: 250 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate') {
    const prompt = msg.prompt;

    // Load a Figma-supported font
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const text = figma.createText();
    text.characters = prompt;
    figma.currentPage.appendChild(text);
    figma.viewport.scrollAndZoomIntoView([text]);

    figma.closePlugin("Generated node from prompt");
  }
};

