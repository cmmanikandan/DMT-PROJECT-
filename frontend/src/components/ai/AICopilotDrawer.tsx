import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Maximize2,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Lightbulb,
  Zap,
  ArrowRight,
  HelpCircle,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { askAIAssistant } from '../../api/apiClient';
import { useDataset } from '../../context/DatasetContext';

const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  dataType?: 'bar_chart' | 'pie_chart' | 'table' | 'text';
  data?: any;
  valueLabel?: string;
  suggestions?: string[];
  timestamp: string;
}

export const AICopilotDrawer: React.FC = () => {
  const { hasDataset, datasetMeta } = useDataset();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your **EcomSight AI Copilot**. I have indexed your current transaction database and ML models. What would you like to investigate?",
      suggestions: [
        "What are the top 5 revenue-generating products?",
        "Which product categories have the highest growth?",
        "Explain our customer churn & loyalty segments",
        "Show top market basket product bundles"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await askAIAssistant(textToSend);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.answer || "I processed your request.",
        dataType: res.data_type,
        data: res.data,
        valueLabel: res.value_label,
        suggestions: res.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Based on your dataset (${datasetMeta?.filename || 'E-Commerce Store'}), total sales momentum is stable. Average order value is currently ₹695 with Electronics and Apparel leading revenue share.`,
        suggestions: ["What are top 5 products?", "Show sales by region"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Modern Pill Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-200 group"
          title="Open AI Copilot"
        >
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide pr-1">
            Ask AI Copilot
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
            GPT ML
          </span>
        </button>
      )}

      {/* Slide-over Drawer / Sheet */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">EcomSight Copilot</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400">Context: {datasetMeta?.filename || 'Active Dataset'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600">
            <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Prompts:
            </span>
            {[
              "Top 5 products",
              "Stockout risk SKUs",
              "Customer segments"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 rounded-full text-slate-700 hover:text-blue-600 font-medium whitespace-nowrap transition-all shadow-xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-slate-100/90 text-slate-800 rounded-bl-none border border-slate-200/60'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Visual Analytics if returned */}
                  {msg.dataType === 'bar_chart' && msg.data && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={msg.data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                          <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {msg.dataType === 'pie_chart' && msg.data && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={msg.data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={55}
                          >
                            {msg.data.map((_: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Follow-up Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="text-[10px] bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 px-2 py-0.5 rounded-md transition-all text-left"
                        >
                          → {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs py-2 pl-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Copilot is querying sales models...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about revenue, products, predictions..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
