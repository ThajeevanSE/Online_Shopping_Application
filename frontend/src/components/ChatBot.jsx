import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios"; // Your configured axios instance

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! 👋 I'm the FaiteMarket AI Assistant. Ask me anything!", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // New state for loading animation
  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true); 

    try {
      
      const response = await api.post("/bot/ask", { message: userMsg.text });
      
      const botResponse = response.data.response;

     
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);

    } catch (error) {
      console.error("Bot Error:", error);
      setMessages((prev) => [...prev, { text: "Sorry, I'm offline right now.", isBot: true }]);
    } finally {
      setIsTyping(false); 
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-[450px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">✨</div>
              <div>
                <span className="font-bold block text-sm">Faite AI</span>
                <span className="text-xs text-indigo-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3 custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                {msg.isBot && <div className="w-6 h-6 bg-indigo-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs">🤖</div>}
                <div className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${
                  msg.isBot 
                    ? "bg-white text-gray-800 border border-gray-200 rounded-tl-none" 
                    : "bg-indigo-600 text-white rounded-tr-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator Bubble */}
            {isTyping && (
               <div className="flex justify-start items-center">
                 <div className="w-6 h-6 bg-indigo-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs">🤖</div>
                 <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1 items-center h-10">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              className="flex-grow p-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50 pl-4"
              placeholder="Ask about products, orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
                type="submit" 
                disabled={isTyping || !input.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
              <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95"
      >
        {isOpen ? (
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
           </svg>
        )}
      </button>

    </div>
  );
}

export default ChatBot;