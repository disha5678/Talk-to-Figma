// mcp-server/contextManager.ts
export const contextMap = new Map<
  string,
  { role: "user" | "assistant"; content: string }[]
>();

export function addMessage(clientId: string, role: "user" | "assistant", content: string) {
  if (!contextMap.has(clientId)) {
    contextMap.set(clientId, []);
  }
  contextMap.get(clientId)!.push({ role, content });
}

export function getContext(clientId: string) {
  return contextMap.get(clientId) || [];
}

export function clearContext(clientId: string) {
  contextMap.delete(clientId);
}
export function getClientCount() {
  return contextMap.size;
}