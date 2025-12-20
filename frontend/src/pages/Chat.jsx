import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function Chat() {
  const { userId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const currentUserId = 1;

  useEffect(() => {
    fetchMessages();
    
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/conversation/${userId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text) return;
    await api.post("/messages/send", {
        receiverId: userId,
        content: text
    });
    setText("");
    fetchMessages();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Chat History</h2>
      
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender.id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender.id === currentUserId 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border text-gray-800 rounded-bl-none'
                }`}>
                    <p>{msg.content}</p>
                    <span className="text-[10px] opacity-70 block text-right mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input 
            className="flex-grow border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-6 rounded-lg font-bold hover:bg-blue-700">
            Send
        </button>
      </form>
    </div>
  );
}

export default Chat;