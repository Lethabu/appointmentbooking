// components/AI/OrionChat.jsx
'use client';
import { useState, useRef } from 'react';

export default function OrionChat({ salonId }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hi! I am Orion, your AI product recommendation assistant. Ask me about products or services.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context: { agent: 'orion', salonId } })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'Sorry, I could not process your request.' }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error contacting Orion. Please try again.' }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 100);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4 flex flex-col h-[500px]">
      <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-100 text-right ml-16' : msg.role === 'assistant' ? 'bg-green-50 text-left mr-16' : 'bg-gray-50 text-center'}`}>{msg.content}</div>
        ))}
        {loading && <div className="text-gray-400">Orion is typing…</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about products or services…"
          disabled={loading}
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
