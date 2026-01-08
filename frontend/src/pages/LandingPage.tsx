import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Globe } from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-xl">
                    <MessageCircle size={28} />
                    <span>Flirt & Learn</span>
                </div>
                <div className="space-x-4">
                    <button className="text-gray-600 hover:text-pink-500 font-medium">Log In</button>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-full font-medium hover:bg-pink-700 transition-colors">Sign Up</button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-24 items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Heart size={16} className="fill-pink-700" />
                        <span>AI-Powered Language Learning</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                        Master English through <span className="text-pink-500">Conversation</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Practice English naturally by chatting with friendly AI personas. Get instant feedback, corrections, and build confidence in a safe environment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            to="/personas"
                            className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-700 transition-transform hover:scale-105 text-center shadow-lg shadow-pink-200"
                        >
                            Start Chatting Now
                        </Link>
                        <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <Globe size={20} />
                            Learn More
                        </button>
                    </div>
                </div>

                <div className="relative flex justify-center items-center">
                    {/* background blobs */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                    {/* centered card */}
                    <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500 w-80 flex justify-center">
                        <img
                            src="flirt-learn.png"
                            alt="Flirt & Learn"
                            className="w-64 h-64 object-contain"
                        />
                    </div>
                </div>

            </main>
        </div>
    );
};
