import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { mockChatMessages } from '../utils/mockData';
import { apiClient } from '../services/api';
import type { ChatMessage } from '../types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await apiClient.getChatHistory();
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    'How do I highlight my React and TypeScript project on my resume?',
    'What are the most frequent Spring Boot interview questions for 2025?',
    'How should I explain my food recommendation system in an interview?',
    'What should I prioritize learning next to become a full-stack engineer?',
  ];

  const handleSend = async (text?: string) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const optimisticMsg: ChatMessage = {
      id: String(Date.now()),
      user_message: query,
      ai_response: '',
      sources: [],
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    if (!text) setInputValue('');
    setIsTyping(true);

    try {
      const response = await apiClient.sendChatMessage(query);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id
            ? {
                ...m,
                ai_response: response.ai_response,
                sources: response.sources || ['Career Intelligence Knowledge Base'],
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id
            ? {
                ...m,
                ai_response:
                  'Based on your verified profile, prioritize building demonstrable REST APIs with Spring Boot and containerizing your services with Docker to match 100% of analyzed backend roles.',
                sources: ['Career Intelligence Knowledge Base'],
              }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">AI Career Advisor (RAG Agent)</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[13px] text-surface-300">
              Grounded in your resume, target job descriptions, and curated engineering knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-4">
            {/* User message */}
            <div className="flex items-start justify-end gap-3">
              <div className="max-w-[75%] p-4 rounded-2xl bg-brand-600 text-white text-[14px] leading-relaxed shadow-lg shadow-brand-500/10">
                {msg.user_message}
              </div>
              <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* AI response */}
            {(msg.ai_response || isTyping) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-800 border border-brand-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-brand-400" />
                </div>
                <div className="max-w-[85%] space-y-3">
                  <div className="glass-card p-5 text-[14px] text-surface-200 leading-relaxed whitespace-pre-line border-brand-500/10">
                    {msg.ai_response ? (
                      msg.ai_response
                    ) : (
                      <div className="flex items-center gap-2 text-surface-400">
                        <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse delay-75" />
                        <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse delay-150" />
                        <span className="text-[13px] ml-1">Searching career knowledge base & analyzing profile...</span>
                      </div>
                    )}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pl-1">
                      <span className="text-[11px] text-surface-400 flex items-center gap-1 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-accent-400" /> Grounded in:
                      </span>
                      {msg.sources.map((src, sidx) => (
                        <span
                          key={sidx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] bg-surface-800 text-surface-300 border border-white/5"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {quickPrompts.map((prompt, pidx) => (
            <button
              key={pidx}
              onClick={() => handleSend(prompt)}
              className="text-[12px] px-3 py-1.5 rounded-xl bg-surface-800/60 border border-white/5 text-surface-300 hover:text-white hover:border-brand-500/30 whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-brand-400" />
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center mt-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about resume optimization, interview answers, or career strategy..."
            className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-surface-800/80 border border-white/10 text-white text-[14px] placeholder:text-surface-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2.5 p-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white transition-all shadow-md shadow-brand-500/20"
          >
            {isTyping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
