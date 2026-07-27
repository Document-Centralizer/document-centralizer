import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function ChatBot() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi! I'm your Document Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: "user", text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) throw new Error("Failed to connect to Chatbot");

            const data = await response.json();
            setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "bot", text: "Sorry, I am having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    // Only show ChatBot for regular users
    if (!user || user.role === "admin" || user.role === "superadmin") {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={20} />
                            <h3 className="font-bold">AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-lg transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.role === "user" 
                                    ? "bg-blue-600 text-white rounded-br-none" 
                                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 py-2 px-4 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                disabled={loading}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || loading}
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 hover:scale-105 transition-all animate-in fade-in duration-300"
                >
                    <MessageSquare size={24} />
                </button>
            )}
        </div>
    );
}
