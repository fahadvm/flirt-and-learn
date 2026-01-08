import React, { useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        return (
          <div 
            key={msg.id} 
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[80%] rounded-2xl px-5 py-3 shadow-sm relative group
                ${isUser 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }
              `}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <span 
                className={`text-[10px] mt-1 block opacity-70 
                  ${isUser ? 'text-blue-100 text-right' : 'text-gray-400'}
                `}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        );
      })}

      {/* AI Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};