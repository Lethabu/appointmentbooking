export enum AgentType {
  BLAZE = 'BLAZE',
  AURA = 'AURA',
  ECHO = 'ECHO',
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  agentType?: AgentType;
};

export type MinimalChatMessage = {
  role: 'user' | 'model';
  text: string;
};