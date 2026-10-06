import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Lesson } from '../types';
import { MessageSquare, Send, Sparkles, User, BrainCircuit, AlertCircle } from 'lucide-react';

interface AITutorProps {
  currentLesson?: Lesson;
}

export default function AITutor({ currentLesson }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hi there! I'm **Turing**, your Git & GitHub Mentor. 🤖\n\nI can explain any command using fun analogies, walk you through concepts, or help you solve current challenge hints. Ask me anything about Git!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput('');
    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: messages.slice(-10), // Send last 10 messages for conversational memory
          lessonContext: currentLesson
            ? `We are currently on the lesson "${currentLesson.title}" inside module "${currentLesson.moduleId}". The lesson goal is: ${currentLesson.description}.`
            : 'We are in open Git Sandbox mode exploring commands.'
        })
      });

      const data = await response.json();
      
      const coachMsg: ChatMessage = {
        sender: 'ai',
        text: data.text || "I'm having a small connection issue, but let's keep exploring Git!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "Oops, I had a hitch talking to my server. Make sure your local Express server is running and your network is active!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#ffffff] border border-[#e2e8f0] rounded-2xl h-[460px] overflow-hidden shadow-sm" id="ai-tutor">
      {/* Header */}
      <div className="bg-[#ffffff] px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#f5f3ff] border border-[#ede9fe] rounded-xl text-[#7c3aed]">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#0f172a] flex items-center gap-1 uppercase tracking-wider">
              <span>AI Coach Turing</span>
              <Sparkles className="w-3 h-3 text-[#f59e0b] animate-pulse" />
            </div>
            <div className="text-[10px] text-[#64748b] font-medium font-mono">Active Mentor</div>
          </div>
        </div>
        {currentLesson && (
          <span className="text-[9px] font-mono px-2.5 py-0.5 bg-[#f8fafc] text-[#64748b] rounded-full border border-[#e2e8f0]">
            Lesson Assistant
          </span>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]'}`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
            </div>

            {/* Balloon */}
            <div className="flex flex-col gap-1">
              <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#7c3aed] text-white rounded-tr-none shadow-sm shadow-purple-500/20'
                  : 'bg-[#f8fafc] text-[#334155] rounded-tl-none border border-[#e2e8f0]'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-[#94a3b8] font-mono self-end px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-full bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed] flex items-center justify-center shrink-0 animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-2xl rounded-tl-none text-xs text-[#64748b] border border-[#e2e8f0] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full animate-bounce delay-200"></span>
              <span className="font-mono text-[11px]">Turing is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="bg-[#ffffff] p-3 border-t border-[#e2e8f0] flex gap-2">
        <input
          type="text"
          className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] placeholder-[#94a3b8] font-sans"
          placeholder="Ask Turing (e.g., 'Explain commit vs staging')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="p-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] border border-[#7c3aed] rounded-xl text-white transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm shadow-purple-500/20"
          disabled={loading}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
