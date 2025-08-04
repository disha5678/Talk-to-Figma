/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'schema') {
    try {
      const schema = JSON.parse(msg.schema);
      await createNodeFromSchema(schema);
    } catch (e) {
      figma.notify("Invalid schema received");
      console.error("Invalid schema:", msg.schema);
    }
  }
};

async function createNodeFromSchema(schema: any) {
  let node;

  switch (schema.type) {
    case "FRAME":
      node = figma.createFrame();
      node.resize(schema.width || 200, schema.height || 200);
      if (schema.cornerRadius) node.cornerRadius = schema.cornerRadius;
      figma.currentPage.appendChild(node);
      break;

    case "RECTANGLE":
      node = figma.createRectangle();
      node.resize(schema.width || 100, schema.height || 100);
      if (schema.cornerRadius) node.cornerRadius = schema.cornerRadius;
      if (schema.color) {
        node.fills = [{ type: "SOLID", color: hexToRgb(schema.color) }];
      }
      figma.currentPage.appendChild(node);
      break;

    case "TEXT":
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      node = figma.createText();
      node.characters = schema.characters || "Text";
      if (schema.fontSize) node.fontSize = schema.fontSize;
      if (schema.color) {
        node.fills = [{ type: "SOLID", color: hexToRgb(schema.color) }];
      }
      figma.currentPage.appendChild(node);
      break;
  }

  // Recursively create children
  if (schema.children && Array.isArray(schema.children)) {
    for (const child of schema.children) {
      const childNode = await createNodeFromSchema(child);
      if ("appendChild" in node) {
        (node as FrameNode).appendChild(childNode);
      }
    }
  }

  return node;
}

function hexToRgb(hex: string) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}
// Test: Create a blue rounded button without AI
const testSchema = {
  "type": "FRAME",
  "width": 200,
  "height": 80,
  "cornerRadius": 20,
  "children": [
    {
      "type": "RECTANGLE",
      "width": 200,
      "height": 80,
      "cornerRadius": 20,
      "color": "#007BFF"
    },
    {
      "type": "TEXT",
      "characters": "Submit",
      "fontSize": 18,
      "color": "#ffffff"
    }
  ]
};

// This will run when the plugin starts
createNodeFromSchema(testSchema);


