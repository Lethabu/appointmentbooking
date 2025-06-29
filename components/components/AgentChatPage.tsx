import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AgentType, ChatMessage, MinimalChatMessage } from '../types'; // Added MinimalChatMessage
import { Agents, getAgentSystemInstruction } from '../constants';
import AgentSelector from './AgentSelector';
import ChatMessageItem from './ChatMessageItem';
import ChatInput from './ChatInput';
import { generateAgentResponse } from '../services/geminiService';

const AgentChatPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(Agents[0].type);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadChatHistory = useCallback((agent: AgentType) => {
    const storedHistory = localStorage.getItem(`chatHistory_${agent}`);
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    } else {
      const systemInstruction = getAgentSystemInstruction(agent);
      setChatHistory([{
        id: 'system-init',
        role: 'model', 
        text: `You are now chatting with ${agent}. ${systemInstruction.substring(0, systemInstruction.indexOf('.') + 1) || systemInstruction}`,
        timestamp: Date.now(),
        agentType: agent
      }]);
    }
  }, []);

  useEffect(() => {
    loadChatHistory(selectedAgent);
  }, [selectedAgent, loadChatHistory]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSelectAgent = (agent: AgentType) => {
    setSelectedAgent(agent);
  };

  const handleSendMessage = async (userMessageText: string) => {
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMessageText,
      timestamp: Date.now(),
    };

    // Prepare history for Gemini: only user and model roles, and only role and text fields.
    const historyForGemini: MinimalChatMessage[] = chatHistory
      .filter(msg => msg.role === 'user' || msg.role === 'model') 
      .map(({ role, text }) => ({ role, text }) ); 

    setChatHistory(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const agentResponseText = await generateAgentResponse(selectedAgent, userMessageText, historyForGemini);
      const newAgentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'model',
        text: agentResponseText,
        timestamp: Date.now(),
        agentType: selectedAgent
      };
      setChatHistory(prev => {
        const updatedHistory = [...prev, newAgentMessage];
        localStorage.setItem(`chatHistory_${selectedAgent}`, JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (error) {
      console.error("Failed to get agent response:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: "Sorry, I couldn't process your request right now.",
        timestamp: Date.now(),
        agentType: selectedAgent
      };
      setChatHistory(prev => {
        const updatedHistory = [...prev, errorMessage];
        localStorage.setItem(`chatHistory_${selectedAgent}`, JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentAgentDetails = Agents.find(a => a.type === selectedAgent);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-4 border-b border-neutral-200 bg-neutral-50">
        <AgentSelector selectedAgent={selectedAgent} onSelectAgent={handleSelectAgent} />
        {currentAgentDetails && (
           <p className="text-sm text-neutral-600 mt-1">{currentAgentDetails.description}</p>
        )}
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-100">
        {chatHistory.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="h-8 w-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="animate-pulse flex space-x-1">
                <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
              </div>
            </div>
            <div className="p-3 max-w-md bg-neutral-200 text-neutral-800 self-start rounded-r-lg rounded-tl-lg shadow-md">
                <p className="text-sm italic">Agent is typing...</p>
            </div>
          </div>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default AgentChatPage;