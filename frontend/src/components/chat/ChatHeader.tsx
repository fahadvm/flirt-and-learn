import React from 'react';
import { MoreVertical, Phone, Video } from 'lucide-react';

interface Persona {
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  description: string;
}

interface ChatHeaderProps {
  persona: Persona;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ persona }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={persona.avatar} 
            alt={persona.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {persona.status === 'online' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">{persona.name}</h2>
          <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
            {persona.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-400">
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Phone size={20} />
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Video size={20} />
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};