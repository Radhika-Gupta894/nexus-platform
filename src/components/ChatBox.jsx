import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  User as UserIcon, 
  Clock, 
  ShieldCheck, 
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { chatService } from "../firebase/chatService";

export default function ChatBox({ user, reportId, title = "Tactical Comms" }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 🔄 Real-time Message Subscription
  useEffect(() => {
    // Ensure room exists
    chatService.getOrCreateChatRoom(reportId ? { id: reportId, type: title } : null);

    const unsubscribe = chatService.subscribeToMessages(reportId, (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [reportId, title]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = newMessage.trim();
    setNewMessage("");

    try {
      // Send User Message via Service (AI logic removed)
      await chatService.sendMessage(reportId, user, userMessage);
    } catch (err) {
      console.error("Chat Error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] border border-[var(--color-nexus-border)] shadow-xl overflow-hidden animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[var(--color-nexus-primary)] p-5 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest leading-none">{title}</h3>
            <p className="text-[9px] text-blue-100 mt-1 uppercase font-bold tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Secure Real-time Feed
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <AlertCircle size={48} className="mb-4 text-slate-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted Intelligence Feed</p>
            <p className="text-[9px] mt-2">Initializing tactical comms link...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.uid || msg.senderId === user?.email;
            const isAI = msg.isAI;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                
                {/* Bubble Container */}
                <div className={`group relative max-w-[85%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Label (Hidden for Me) */}
                  {!isMe && !isAI && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 px-1">
                      {msg.senderName} • {msg.senderRole}
                    </span>
                  )}

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
                    isAI 
                      ? 'bg-blue-50 border border-blue-100 text-blue-900 rounded-tl-none'
                      : isMe 
                        ? 'bg-[var(--color-nexus-primary)] text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Timestamp & Status */}
                  <div className={`mt-1.5 flex items-center gap-2 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCircle2 size={10} className="text-emerald-500" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        <div ref={scrollRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Transmit intelligence..."
          className="flex-1 bg-slate-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-[var(--color-nexus-primary)]/20 transition-all placeholder:text-slate-300 outline-none"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="w-12 h-12 bg-[var(--color-nexus-primary)] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}