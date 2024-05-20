// types/websocketTypes.ts

export type ConversationState = "ready" | "waiting" | "streaming" | "error";

export interface WebSocketRequest {
  type: string;
  message: string;
  question: string;
  api_key?: string;
  model_name?: string;
}

export interface WebSocketResponse {
  type: string;
  detail: string;
  output?: string;
  generated_cypher?: string;
}

export interface ChatMessageObject {
  id: number;
  type: "input" | "text";
  sender: "self" | "bot";
  message: string;
  complete: boolean;
}

