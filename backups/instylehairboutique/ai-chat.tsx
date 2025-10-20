'use client';

import { useState } from 'react';

const KB_DATA = [
  {
    question: 'What is Wash & Cut?',
    answer:
      'Wash & Cut is a 60 min treatment priced at R350. Professional wash, cut and blow-dry',
  },
  {
    question: 'What is Balayage?',
    answer:
      'Balayage is a 120 min treatment priced at R650. Hand-painted highlights for natural look',
  },
  {
    question: 'What is Hair Treatment?',
    answer:
      'Hair Treatment is a 90 min treatment priced at R450. Deep conditioning and repair treatment',
  },
];

export default function AIChat() {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simple KB lookup
    const answer =
      KB_DATA.find((kb) =>
        input.toLowerCase().includes(kb.question.toLowerCase().split(' ')[2]),
      )?.answer ||
      "I'm Nia, your stylist assistant. How can I help you with our services?";

    setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    setInput('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-4">Chat with Nia</h3>
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${msg.role === 'user' ? 'bg-purple-100 ml-4' : 'bg-gray-100 mr-4'}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our services..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
