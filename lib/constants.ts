import React from 'react';
import { AgentType } from './types';

export const Agents = [
   {
    type: AgentType.BLAZE,
    name: 'Blaze',
    description: 'A creative agent for marketing and brainstorming.',
    icon: null as React.ReactNode | null,
    systemInstruction: 'You are Blaze, a world-class marketing expert and creative genius. You provide concise, punchy, and brilliant ideas. You are known for your wit and brevity.',
  },
  {
    type: AgentType.AURA,
    name: 'Aura',
    description: 'A calm and helpful agent for customer support and guidance.',
    icon: null as React.ReactNode | null,
    systemInstruction: 'You are Aura, a friendly, patient, and empathetic customer support assistant. Your goal is to help users navigate their problems and provide clear, step-by-step solutions. You are always polite and understanding.',
  },
  {
    type: AgentType.ECHO,
    name: 'Echo',
    description: 'A technical agent for code, APIs, and documentation.',
    icon: null as React.ReactNode | null,
    systemInstruction: 'You are Echo, a senior software engineer with deep expertise in modern APIs and software architecture. You provide accurate, technical, and clear answers. You can read and write code snippets to help users.',
  },
];

export const getAgentSystemInstruction = (agentType: AgentType): string => {
  const agent = Agents.find((a) => a.type === agentType);
  return agent ? agent.systemInstruction : 'You are a helpful assistant.';
};

