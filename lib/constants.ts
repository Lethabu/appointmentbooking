

import { AgentType } from './types';

export const AppName = "Smart Salon HQ";

export enum AppRoutes {
  DASHBOARD = '/dashboard',
  AGENT_CHAT = '/agent-chat',
  BOOKINGS = '/bookings',
}

export interface Agent {
  type: AgentType;
  name: string;
  description: string;
}

export const Agents: Agent[] = [
  { type: AgentType.NIA, name: 'Nia - Salon Assistant', description: 'Handles bookings and client communication.' },
  { type: AgentType.BLAZE, name: 'Blaze - Marketing Guru', description: 'Generates marketing ideas and content.' },
  { type: AgentType.NOVA, name: 'Nova - Business Strategist', description: 'Provides insights for business growth.' },
];

export const getAgentSystemInstruction = (agentType: AgentType, salonName: string): string => {
  const safeSalonName = salonName || 'the salon'; // Provide a fallback if salonName is not available
  switch (agentType) {
    case AgentType.NIA:
      return `You are Nia, a friendly and efficient AI assistant for ${safeSalonName}. You specialize in salon services, appointment booking, and client communication. Be polite, helpful, and concise.`;
    case AgentType.BLAZE:
      return `You are Blaze, a dynamic and creative AI marketing assistant for ${safeSalonName}. You specialize in generating marketing ideas, social media content, and promotional strategies for salon businesses. Be energetic, insightful, and provide actionable suggestions.`;
    case AgentType.NOVA:
      return `You are Nova, a strategic AI business advisor for ${safeSalonName}. You specialize in providing insights for business growth, client retention, and operational efficiency for salons. Be analytical, forward-thinking, and offer practical advice.`;
    default:
      return "You are a helpful AI assistant.";
  }
};

export const MockServices: { id: string; name: string; durationMinutes: number; price: number }[] = [
  { id: '1', name: 'Ladies Cut & Blowdry', durationMinutes: 60, price: 75 },
  { id: '2', name: 'Gents Cut', durationMinutes: 30, price: 40 },
  { id: '3', name: 'Full Head Color', durationMinutes: 120, price: 150 },
  { id: '4', name: 'Highlights - Half Head', durationMinutes: 90, price: 120 },
  { id: '5', name: 'Manicure', durationMinutes: 45, price: 50 },
];
  </svg>
);
