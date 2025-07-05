
import React from 'react';
import { ChatMessage } from '../../lib/types';
import { Agents } from '../../lib/constants';
import { SparklesIcon } from './Icons/SparklesIcon';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const agent = Agents.find(a => a.type === message.agent);

  const avatar = (
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
      ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
      {isUser ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ) : (
        agent?.icon || <SparklesIcon className="w-5 h-5" />
      )}
    </div>
  );

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && avatar}
      <div className={`p-3 rounded-lg max-w-[70%] ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
        {!isUser && agent && <div className="font-semibold text-sm mb-1">{agent.name}</div>}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {isUser && avatar}
    </div>
  );
};

export default ChatMessageItem;
