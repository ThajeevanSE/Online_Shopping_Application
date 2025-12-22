import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const bottomRef = useRef(null);
  const stompClientRef = useRef(null);

  const activeChatRef = useRef(null); 

  // Sync ref with state
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // 1. Initial Load & Socket Connection
  useEffect(() => {
    fetchUserAndInbox();

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Disable debug logs

    const token = localStorage.getItem("token");

    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        
        stompClient.subscribe("/user/queue/messages", (payload) => {
          const newMessage = JSON.parse(payload.body);
          handleIncomingMessage(newMessage);
        });
      },
      (err) => {
        console.error("Socket error", err);
      }
    );

    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
         try {
             stompClientRef.current.disconnect();
         } catch (e) {
             console.error("Disconnect error", e);
         }
      }
    };
  }, []);

  const fetchUserAndInbox = async () => {
    try {
      const userRes = await api.get("/user/me");
      setCurrentUser(userRes.data);
      const inboxRes = await api.get("/messages/inbox");
      setConversations(inboxRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInboxOnly = async () => {
      try {
        const res = await api.get("/messages/inbox");
        setConversations(res.data);
      } catch (err) { console.error(err); }
  };

  // 2. Handle Real-Time Message
  const handleIncomingMessage = (newMessage) => {
    // Use the ref to check the CURRENT active chat
    const currentActiveChat = activeChatRef.current;

    setMessages((prev) => {
      const isRelevant =
        (currentActiveChat && newMessage.sender.id === currentActiveChat.id) ||
        (currentActiveChat && newMessage.receiver.id === currentActiveChat.id);

      if (isRelevant) {
        return [...prev, newMessage];
      }
      return prev;
    });

    // Refresh inbox list (e.g., to move conversation to top)
    fetchInboxOnly();
  };

  // 3. Load History when clicking a chat
  useEffect(() => {
    if (activeChat) {
      api
        .get(`/messages/conversation/${activeChat.id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeChat]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message via WebSocket
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChat || !stompClientRef.current) return;

    const chatMessage = {
      receiverId: activeChat.id,
      content: text,
    };

    stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
    setText("");
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100 flex overflow-hidden">
      
      {/* --- LEFT SIDEBAR (Contact List) --- */}
      <div className={`w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center h-16">
          <h2 className="text-xl font-bold text-gray-700">Chats</h2>
          <div className="text-sm font-semibold text-indigo-600">
             {currentUser?.name} (Me)
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-grow overflow-y-auto">
          {conversations.length === 0 ? (
             <div className="p-10 text-center text-gray-400">No conversations yet</div>
          ) : (
            conversations.map((user) => (
              <div 
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-100 ${activeChat?.id === user.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0">
                   {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4 flex-grow overflow-hidden">
                   <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                   <p className="text-sm text-gray-500 truncate">Tap to chat</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- RIGHT MAIN AREA (Chat Window) --- */}
      <div className={`w-full md:w-2/3 flex flex-col bg-[#efeae2] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center shadow-sm h-16 z-10">
              <button onClick={() => setActiveChat(null)} className="md:hidden mr-3 text-gray-600">
                {/* Back Arrow Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold mr-3">
                 {activeChat.name.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-800">{activeChat.name}</h3>
            </div>

            {/* Chat Area - WhatsApp Background style */}
            <div className="flex-grow overflow-y-auto p-4 space-y-2 relative" 
                 style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat' }}>
                
                {messages.map((msg) => {
                    const isMe = msg.sender.id === currentUser?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                            <div className={`max-w-[75%] px-3 py-1 rounded-lg shadow-sm text-sm relative break-words ${
                                isMe 
                                ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' 
                                : 'bg-white text-gray-900 rounded-tl-none'
                            }`}>
                                <p className="mb-1 mr-4">{msg.content}</p>
                                <div className="flex justify-end items-center gap-1 absolute bottom-1 right-2">
                                    <span className="text-[10px] text-gray-500">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                {/* Spacer to prevent text overlap with time */}
                                <div className="h-3 w-10 float-right"></div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 bg-gray-100 flex items-center gap-2">
                <input 
                    className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                    placeholder="Type a message"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <button type="submit" className="p-3 bg-green-600 rounded-full text-white hover:bg-green-700 shadow-md transition">
                    <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
          </>
        ) : (
          /* Empty State */
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500 bg-[#f0f2f5] border-l border-gray-300">
             <div className="text-center">
                 <h2 className="text-3xl font-light text-gray-600 mb-4">Web Messenger</h2>
                 <p className="text-gray-500">Select a contact to start chatting.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messenger;