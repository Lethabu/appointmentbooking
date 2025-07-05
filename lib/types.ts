
export enum AgentType {
  NIA = 'nia',
  BLAZE = 'blaze',
  NOVA = 'nova',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agentType?: AgentType;
  timestamp: number;
}

export interface MinimalChatMessage {
  role: 'user' | 'agent';
  content: string;
}
