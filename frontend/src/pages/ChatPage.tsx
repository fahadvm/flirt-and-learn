import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

// Persona data
const PERSONAS: Record<string, { name: string; avatar: string; status: 'online' | 'offline'; description: string }> = {
  sarah: {
    name: "Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    status: 'online',
    description: "Friendly and patient English tutor who loves talking about travel and food."
  },
  james: {
    name: "James",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    status: 'online',
    description: "Professional and articulate tutor. Great for business English and formal topics."
  }
};

const API_BASE_URL = "http://localhost:5000";

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const personaId = searchParams.get('persona') || 'sarah';
  const persona = PERSONAS[personaId] || PERSONAS.sarah;

  const INITIAL_MESSAGES: Message[] = [
    {
      id: '1',
      text: personaId === 'james'
        ? "Hey there! I'm James. Great to meet you. What's been on your mind today?"
        : "Hi there! I'm Sarah. It's nice to meet you! How is your day going? 😊",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]);

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Build history for the API (exclude the initial greeting to keep context clean)
      const history = updatedMessages.map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          personaId: personaId,
          history: history.slice(0, -1) // Send history excluding the current message (it's sent separately)
        })
      });
      console.log("response:",response)
      
      const data = await response.json();
      console.log("DATa:",data)

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Add AI response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);

      // Add feedback if returned by the API
      if (data.feedback) {
        setFeedback(prev => [...prev, {
          id: Date.now().toString(),
          type: data.feedback.type || 'vocabulary',
          content: data.feedback.content,
          context: data.feedback.context || text
        }]);
        // Auto-open feedback panel on first tip
        if (feedback.length === 0) setIsFeedbackOpen(true);
      }
    } catch (error: any) {
      console.error('Chat API error:', error);

      let errorText = "Oops! I'm having trouble connecting right now. Please make sure the backend server is running and try again. 🔌";

      if (error.message?.includes('Rate limited') || error.message?.includes('429')) {
        errorText = "I'm getting a lot of messages right now! 😅 Please wait a few seconds and try again.";
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorText = "Can't reach the server! Make sure the backend is running on port 5000. 🔌";
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: error.message || errorText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full w-full max-w-5xl mx-auto shadow-2xl shadow-gray-200/50">
        <ChatHeader persona={persona} />

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <MessageList messages={messages} isTyping={isTyping} />

          {/* Floating Feedback Toggle */}
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
