import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Loader } from './Loader';

interface ChatSidebarProps {
    onInsertText: (text: string) => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chatInstance: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
});

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ onInsertText }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Hello! How can I help you improve your text today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatInstance.sendMessage({ message: input });
            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg h-full flex flex-col min-h-[500px] lg:min-h-[564px] max-h-[564px]">
            <div className="p-4 border-b border-slate-200/80">
                <h2 className="text-lg font-semibold text-slate-800">AI Assistant</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs lg:max-w-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            {msg.role === 'model' && index > 0 && (
                                <button
                                    onClick={() => onInsertText(msg.text)}
                                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                    aria-label="Insert text into editor"
                                >
                                    Insert into Editor
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-slate-200"><span className="animate-pulse">...</span></div></div>}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200/80">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Ask the AI..."
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
