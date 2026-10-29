import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight, 
  Layers, 
  Info, 
  CheckCircle2, 
  Terminal,
  Bot
} from 'lucide-react';
import { processMerchantQuery, SUGGESTED_QUESTIONS } from '../utils/assistantEngine.js';

export default function AskAssistantView({
  analytics,
  comparison,
  initialQuery = ""
}) {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Conversation thread initialized with a welcoming greeting
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answer: "Hello! I am MerchantMate, your sales analytics assistant. Ask me anything about your shop's revenue, best-selling products, order volume, or where to focus your business efforts.",
      highlights: [
        { label: "Active Mode", value: "Rule Engine (Demo)" },
        { label: "Dataset", value: "14-Day Records" },
        { label: "Tracked SKUs", value: "8 Products" }
      ],
      transparentMath: "Connected to real-time calculation engine with deterministic JavaScript handlers.",
      recommendation: "Click any of the suggested question chips below or type a custom question to get started!"
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-fill and execute query if passed via initialQuery
  useEffect(() => {
    if (initialQuery) {
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleAsk = (queryText) => {
    const q = queryText.trim();
    if (!q) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate snappy realistic processing delay (250ms) for polished feel
    setTimeout(() => {
      const response = processMerchantQuery(q, analytics, comparison);
      
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...response
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 280);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk(inputValue);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answer: "Chat cleared. What question can I calculate for your shop today?",
        highlights: [],
        transparentMath: "Ready for your next inquiry.",
        recommendation: "Try asking: 'What is my total revenue?' or 'Which product sells the least?'"
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ask MerchantMate
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              Demo Rule Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Query your sales figures and product rankings in natural conversational language.
          </p>
        </div>

        {/* Clear Chat Button */}
        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Honest Architecture Disclaimer Banner */}
      <div className="liquid-glass-subtle rounded-xl p-3.5 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Honest Demo Mode: </span>
          This version uses deterministic JavaScript rule matching and direct mathematical calculations on your local dataset—zero external API dependencies or hidden costs. The modular logic in <code className="text-indigo-300 font-mono text-[11px]">assistantEngine.js</code> is architected to allow plugging in an LLM API (like Google Gemini) at any time.
        </div>
      </div>

      {/* Suggested Questions Chips */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Try asking:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(suggestion)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="liquid-glass rounded-2xl p-4 sm:p-6 border border-white/10 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="max-w-xl bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md text-xs sm:text-sm">
                  <p>{msg.text}</p>
                  <span className="text-[10px] text-indigo-200 mt-1 block text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          // Assistant Response Card
          return (
            <div key={msg.id} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-indigo-500/20">
                <Bot className="w-4 h-4" />
              </div>

              <div className="flex-1 liquid-glass-card rounded-2xl rounded-tl-sm p-4 sm:p-5 border border-white/10 space-y-3">
                {/* Main Text Answer */}
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {msg.answer}
                </p>

                {/* Quantitative Metric Highlights */}
                {msg.highlights && msg.highlights.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    {msg.highlights.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">
                          {h.label}
                        </div>
                        <div className="text-sm font-bold text-white font-mono-numbers mt-0.5 truncate">
                          {h.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendation Box */}
                {msg.recommendation && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                    <span className="font-semibold text-white block mb-0.5">
                      Merchant Recommendation:
                    </span>
                    {msg.recommendation}
                  </div>
                )}

                {/* Transparent Math & Timing Footer */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    <span>Logic: {msg.transparentMath}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/50 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-300" />
            </div>
            <div className="liquid-glass-subtle rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>Analyzing dataset & computing metrics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question (e.g., 'What is my total revenue?' or 'Which product sells the least?')..."
          className="w-full pl-4 pr-24 py-3.5 rounded-2xl liquid-glass border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xl"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <button
            onClick={() => handleAsk(inputValue)}
            disabled={!inputValue.trim() || isProcessing}
            className={`p-2.5 rounded-xl transition-all ${
              inputValue.trim() && !isProcessing
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
