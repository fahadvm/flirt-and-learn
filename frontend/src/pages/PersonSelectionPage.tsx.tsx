import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

const PERSONAS = [
  {
    id: 'sarah',
    name: 'Sarah',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    description: 'A deeply caring and romantic soul. She will listen to your dreams and gently guide your English progress with love.',
    level: 'Sweet & Patient'
  },
  {
    id: 'james',
    name: 'James',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    description: 'A devoted gentleman who values deep connection. He challenges you to be your best self, both in life and in language.',
    level: 'Smart & Devoted'
  }
];

export const PersonaSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Find Your AI Romantic Partner</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose a partner who will care for you, talk to you about life, and gently help you perfect your English through warm conversations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {PERSONAS.map((persona) => (
          <div
            key={persona.id}
            onClick={() => navigate(`/chat?persona=${persona.id}`)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-transparent hover:border-pink-500 group"
          >
            <div className="relative h-48 bg-gray-200">
              <img
                src={persona.image}
                alt={persona.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{persona.name}</h3>
                  <p className="text-white/90 text-sm flex items-center gap-1">
                    <User size={14} /> {persona.gender}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="inline-block bg-pink-50 text-pink-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {persona.level}
                </span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {persona.description}
              </p>

              <div className="flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform">
                Start Chatting <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-12 text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
      >
        <ArrowRight size={16} className="rotate-180" /> Back to Home
      </button>
    </div>
  );
};
