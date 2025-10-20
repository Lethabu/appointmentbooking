export enum AgentType {
  NIA = 'NIA',
  ECHO = 'ECHO',
  BLAZE = 'BLAZE',
  AURA = 'AURA',
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
