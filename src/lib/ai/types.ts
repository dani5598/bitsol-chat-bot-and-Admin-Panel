/** A single conversational turn passed to a provider. */
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface StreamChatOptions {
  system: string;
  messages: ChatTurn[];
}

/**
 * Provider-agnostic chat interface. Every backend (Claude, OpenAI-compatible,
 * Ollama, Gemini) implements `streamChat` as an async generator of text chunks,
 * so the API route can stream tokens to the browser identically regardless of
 * which provider is configured.
 */
export interface AIProvider {
  readonly name: string;
  streamChat(options: StreamChatOptions): AsyncGenerator<string, void, unknown>;
}
