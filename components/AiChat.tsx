'use client';

import { useState } from 'react';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '@/app/ConvexClientProvider';

export default function AiChat({ tenantId }: { tenantId: string }) {
  const authResult = useAuth();
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !authResult || !authResult.user) return;

    const { user } = authResult;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiChat = httpsCallable(functions, 'aiChat');
      const result = await aiChat({ message: input, tenantId });

      const aiMessage = {
        role: 'assistant',
        content: (result.data as any).response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error.' },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat with Nia</h3>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-center text-gray-500">Nia is typing...</div>
        )}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about services, booking..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
