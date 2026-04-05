import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ChatbotWidget() {
  const { token } = useAuth();
  const [open, setOpen]       = useState(false);
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "👋 Hi! I'm **EduBot**, your academic assistant. Ask me anything about your studies, GPA, or how to use EduVantage AI!" }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build history for context (last 10 messages, skip welcome)
    const history = messages
      .slice(-10)
      .filter(m => m.content !== messages[0].content)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const botMsg: Message = { role: 'model', content: data.reply || data.message || 'Sorry, I had trouble responding. Please try again.' };
      setMessages(prev => [...prev, botMsg]);

      if (!openRef.current) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: '❌ Connection error. Please check if the server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Simple markdown-like bold parser
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-black">{part}</strong> : part
    );
  };

  return (
    <>
      {/* ── Floating Toggle Button ──────────────────────────────── */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[300] w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Open EduBot"
      >
        {open ? <X className="w-6 h-6" /> : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center animate-bounce">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      {/* ── Chat Window ─────────────────────────────────────────── */}
      <div className={`fixed bottom-24 right-6 z-[299] w-[370px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${
        open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden flex flex-col" style={{ maxHeight: '520px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm">EduBot</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-blue-100 text-[10px] font-medium">Academic AI Assistant</p>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" style={{ minHeight: '300px', maxHeight: '360px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
                {/* Bubble */}
                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-sm'
                }`}>
                  {renderText(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100">
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(d => (
                      <div key={d} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions (only on first view) */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 bg-slate-50">
              {['How to improve my GPA?', 'What is CGPA?', 'How to use this platform?'].map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(sendMessage, 50); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:border-blue-400 transition-colors">
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask EduBot anything…"
                disabled={loading}
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 disabled:opacity-50"
              />
              <button
                id="chatbot-send"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-8 h-8 bg-blue-600 disabled:bg-slate-300 rounded-xl flex items-center justify-center text-white transition-all hover:bg-blue-700 active:scale-90 shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-300 mt-1.5 font-medium">Powered by Google Gemini · EduVantage AI</p>
          </div>
        </div>
      </div>
    </>
  );
}
