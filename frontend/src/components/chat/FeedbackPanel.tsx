import React from 'react';
import { X, BookOpen, MessageSquare, Lightbulb } from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'vocabulary' | 'grammar' | 'tone';
  content: string;
  context?: string;
}

interface FeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackItem[];
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ isOpen, onClose, feedback }) => {
  return (
    <div 
      className={`
        fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
        flex flex-col border-l border-gray-100
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
        <div className="flex items-center gap-2 text-amber-600">
          <Lightbulb size={20} />
          <h3 className="font-semibold">Learning Tips</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-amber-100 rounded-full text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {feedback.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Keep chatting! Feedback will appear here as you practice.</p>
          </div>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-3 font-medium">
                {item.content}
              </p>
              
              {item.context && (
                <div className="bg-gray-50 p-2 rounded-lg text-xs text-gray-500 flex gap-2">
                  <MessageSquare size={14} className="shrink-0 mt-0.5" />
                  <span className="italic">"{item.context}"</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};