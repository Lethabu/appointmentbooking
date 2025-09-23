'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useTenantContext } from '@/contexts/tenant-context';
import { api } from '@/lib/api';
import type { ChatMessage, AIAgent } from '@/types';

const agents: AIAgent[] = [
  {
    id: 'nia',
    name: 'Nia',
    description: 'Marketing & Social Media Expert',
    avatar_url: '/placeholder.svg?height=32&width=32',
    capabilities: ['marketing', 'social_media', 'customer_engagement'],
  },
  {
    id: 'orion',
    name: 'Orion',
    description: 'Business Analytics & Insights',
    avatar_url: '/placeholder.svg?height=32&width=32',
    capabilities: ['analytics', 'reporting', 'business_intelligence'],
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Customer Service & Support',
    avatar_url: '/placeholder.svg?height=32&width=32',
    capabilities: ['customer_service', 'support', 'communication'],
  },
];

export function AIChat() {
  const { tenant } = useTenantContext();
  const [selectedAgent, setSelectedAgent] = useState('nia');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentAgent = agents.find((agent) => agent.id === selectedAgent);

  useEffect(() => {
    // Initialize with welcome message when agent changes
    const welcomeMessage: ChatMessage = {
      id: `welcome-${selectedAgent}-${Date.now()}`,
      content: `Hello! I'm ${currentAgent?.name}, your ${currentAgent?.description.toLowerCase()}. How can I help you grow your salon business today?`,
      sender: 'ai',
      agent_id: selectedAgent,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [selectedAgent, currentAgent]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !tenant || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.sendChatMessage(
        inputMessage,
        selectedAgent,
        tenant.id,
      );

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content:
          response.reply ||
          'I apologize, but I encountered an issue processing your request.',
        sender: 'ai',
        agent_id: selectedAgent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        agent_id: selectedAgent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Chat Assistant
            </CardTitle>
            <CardDescription>
              Get personalized help from our AI agents
            </CardDescription>
          </div>
          <div className="w-64">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={agent.avatar_url || '/placeholder.svg'}
                          alt={agent.name}
                        />
                        <AvatarFallback>{agent.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-500">
                          {agent.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentAgent?.avatar_url || '/placeholder.svg'}
                      alt={currentAgent?.name}
                    />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${currentAgent?.name} anything...`}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
