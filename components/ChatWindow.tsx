'use client';

import { useState } from 'react';

interface ChatWindowProps {
  tenantId: string;
}

export default function ChatWindow({ tenantId }: ChatWindowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, tenantId })
      });
      
      if (response.ok) {
        setMessage('');
      }
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div id="chat-root" className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="p-4 bg-purple-600 text-white rounded-t-lg">
            <h3 className="font-semibold">Nia AI Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-gray-600">How can I help you today?</p>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
        >
          💬
        </button>
      )}
    </div>
  );
}