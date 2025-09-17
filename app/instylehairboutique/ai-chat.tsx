'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const INSTYLE_KB = {
  services: [
    { name: 'Middle & Side Installation', price: 'R450', duration: '60min' },
    { name: 'Maphondo & Lines Installation', price: 'R600', duration: '90min' },
    { name: 'Hair Treatment', price: 'R250', duration: '30min' },
  ],
  responses: {
    greeting:
      "Hi! I'm Nia, your InStyle Hair Boutique assistant. How can I help you today?",
    services:
      'We offer Middle & Side Installation (R450, 60min), Maphondo & Lines (R600, 90min), and Hair Treatment (R250, 30min).',
    booking:
      'You can book online at instylehairboutique.co.za or I can help you choose the perfect service!',
    location:
      "We're InStyle Hair Boutique, your premium hair destination in South Africa.",
    default:
      "I'd be happy to help! Ask me about our services, prices, or booking appointments.",
  },
};

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: INSTYLE_KB.responses.greeting },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getResponse = (question: string) => {
    const q = question.toLowerCase();

    if (q.includes('service') || q.includes('offer')) {
      return INSTYLE_KB.responses.services;
    }
    if (q.includes('book') || q.includes('appointment')) {
      return INSTYLE_KB.responses.booking;
    }
    if (q.includes('price') || q.includes('cost')) {
      return INSTYLE_KB.responses.services;
    }
    if (q.includes('location') || q.includes('where')) {
      return INSTYLE_KB.responses.location;
    }

    return INSTYLE_KB.responses.default;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getResponse(input);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4">
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.role === 'user' ? 'bg-purple-100 ml-8' : 'bg-gray-100 mr-8'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 mr-8 p-2 rounded-lg">
            <p className="text-sm">Nia is typing...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our services..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </Card>
  );
}
