import React, { useEffect, useState, useRef } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { chatWithAI } from "../ai/gemini";
import { Send, MessageSquare, Sparkles, User as UserIcon, Bot } from "lucide-react";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // 📡 Real-time stream with ordering
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Auto-scroll to bottom
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setLoading(true);
    setText("");

    try {
      // 1. Save User Message
      await addDoc(collection(db, "messages"), {
        sender: user?.displayName || user?.email?.split('@')[0] || "User",
        senderEmail: user?.email || "",
        text: userMessage,
        createdAt: new Date().toISOString(),
        isAI: false
      });

      // 2. Trigger AI Response
      setAiTyping(true);
      const aiReply = await chatWithAI(userMessage);
      
      await addDoc(collection(db, "messages"), {
        sender: "NEXUS Core AI",
        senderEmail: "ai@nexus.platform",
        text: aiReply,
        createdAt: new Date().toISOString(),
        isAI: true
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setAiTyping(false);
    }
  };

  return (
    <div className="premium-card p-8 flex flex-col h-[600px] shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-nexus-border)]">
        <h2 className="text-xl font-bold text-[var(--color-nexus-text)] flex items-center gap-3">
          <span className="p-2 bg-[var(--color-nexus-light)] rounded-xl text-[var(--color-nexus-primary)]">
            <MessageSquare size={20} />
          </span>
          Intelligence Channel
        </h2>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold text-[var(--color-nexus-text-muted)] uppercase tracking-widest italic">Global Sync Active</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
             <Sparkles size={40} className="mb-4 text-[var(--color-nexus-primary)]" />
             <p className="text-[10px] font-black uppercase tracking-widest text-center text-[var(--color-nexus-text)]">Neural Link Established.<br/>Awaiting transmission.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderEmail === user?.email; 
            const isAI = msg.isAI;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
                  isAI 
                    ? 'bg-[var(--color-nexus-light)] border border-blue-200 text-blue-900 rounded-tl-none'
                    : isMe 
                      ? 'bg-[var(--color-nexus-primary)] text-white rounded-tr-none shadow-md shadow-blue-500/10' 
                      : 'bg-white border border-[var(--color-nexus-border)] text-[var(--color-nexus-text)] rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isAI ? <Bot size={14} className="text-[var(--color-nexus-primary)]" /> : !isMe && <UserIcon size={12} className="text-[var(--color-nexus-primary)]" />}
                    {!isMe && (
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isAI ? 'text-[var(--color-nexus-primary)]' : 'text-[var(--color-nexus-primary)]'}`}>
                        {msg.sender}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">{msg.text}</p>
                </div>
                <small className="text-[8px] text-[var(--color-nexus-text-muted)] mt-2 uppercase font-black tracking-widest opacity-50 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </small>
              </div>
            );
          })
        )}
        
        {aiTyping && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="bg-[var(--color-nexus-light)] p-4 rounded-2xl rounded-tl-none text-[10px] text-[var(--color-nexus-primary)] font-black uppercase tracking-widest border border-blue-200">
              NEXUS AI is processing intelligence...
            </div>
          </div>
        )}
        
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="mt-8 flex gap-3 items-center">
        <div className="flex-1 relative">
           <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Transmit command or intelligence..."
            className="nexus-input p-5 pr-12 text-sm"
            disabled={loading}
          />
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-nexus-primary)] opacity-20" size={18} />
        </div>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="nexus-btn-primary p-5 rounded-2xl disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}