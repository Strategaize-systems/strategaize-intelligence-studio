// Bedrock-Adapter-Types (DEC-002, eu-central-1).

export interface BedrockInvokeRequest {
  modelId?: string;
  systemPrompt?: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export interface BedrockInvokeResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  modelId: string;
  rawResponse?: unknown;
}
