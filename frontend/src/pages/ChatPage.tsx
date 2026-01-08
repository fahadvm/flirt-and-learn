import React, { useState } from 'react';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { Composer } from '../components/chat/Composer';
import { FeedbackPanel } from '../components/chat/FeedbackPanel';
import { Lightbulb } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: string;
};

// Mock Data
const MOCK_PERSONA = {
  name: "Sarah",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  status: 'online' as const,
  description: "Friendly and patient English tutor who loves talking about travel and food."
};

const INITIAL_MESSAGES : Message[]=[
  {
    id: '1',
    text: "Hi there! I'm Sarah. It's nice to meet you! How is your day going?",
    sender: 'ai' as const,
    timestamp: '10:00 AM'
  }
];

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]);

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: "That's interesting! Tell me more about that. I love hearing new stories.",
        sender: 'ai' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);

      // Add mock feedback occasionally
      if (Math.random() > 0.5) {
        setFeedback(prev => [...prev, {
          id: Date.now().toString(),
          type: 'vocabulary',
          content: 'Try using "fascinating" instead of "interesting" to sound more expressive.',
          context: text
        }]);
        // Auto-open feedback if it's the first one
        if (feedback.length === 0) setIsFeedbackOpen(true);
      }
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full w-full max-w-5xl mx-auto shadow-2xl shadow-gray-200/50">
        <ChatHeader persona={MOCK_PERSONA} />
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <MessageList messages={messages} isTyping={isTyping} />
          
          {/* Floating Feedback Toggle (Mobile/Desktop) */}
          {!isFeedbackOpen && feedback.length > 0 && (
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg border border-amber-100 text-amber-500 hover:scale-110 transition-transform z-10 animate-bounce"
            >
              <Lightbulb size={24} fill="currentColor" className="text-amber-100 stroke-amber-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          )}
        </div>

        <Composer onSend={handleSend} isTyping={isTyping} />
      </div>

      <FeedbackPanel 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        feedback={feedback} 
      />
    </div>
  );
};
