import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { Send, Mic, Paperclip } from 'lucide-react';

interface ComposerProps {
  onSend: (text: string) => void;
  isTyping: boolean;
}

export const Composer: React.FC<ComposerProps> = ({ onSend, isTyping }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isTyping) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-full transition-colors">
          <Paperclip size={20} />
        </button>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isTyping}
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 px-2"
        />

        {inputValue.trim() ? (
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        ) : (
          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-full transition-colors">
            <Mic size={20} />
          </button>
        )}
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-gray-400">Press Enter to send</p>
      </div>
    </div>
  );
};