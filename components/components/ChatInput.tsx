
import React, { useState } from 'react';
import { IconSend } from '../constants';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 bg-white">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white p-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center"
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <IconSend className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
