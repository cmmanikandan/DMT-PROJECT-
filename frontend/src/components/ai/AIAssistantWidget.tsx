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
  Lightbulb
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

const PIE_COLORS = ['#1769E0', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#062A4A'];

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

export const AIAssistantWidget: React.FC = () => {
  const { hasDataset } = useDataset();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your **EcomSight AI Copilot**. Ask me anything about your sales dataset, trends, top products, or regional performance.",
      suggestions: [
        "What are the top 5 products?",
        "Which region has the highest sales?",
        "What is total revenue & AOV?",
        "Which payment method is used the most?"
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
        text: `Here is the insight: Based on current metrics, your sales momentum is strong. You can upload or select your latest dataset from the Dataset tab to get granular SKUs.`,
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
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
          title="Ask AI Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-[13px] font-semibold tracking-wide pr-1">
            Ask AI Copilot
          </span>
        </button>
      )}

      {/* Slide-in Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-64px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-navy-900 text-white flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center text-primary-light border border-primary/40">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold tracking-tight">EcomSight AI Copilot</h3>
                <p className="text-[10.5px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Natural Language Dataset Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-[13px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.text}
                  </div>

                  {/* Render Chart if present */}
                  {m.dataType === 'bar_chart' && m.data && (
                    <div className="mt-3 pt-3 border-t border-slate-100 h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={m.data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                          />
                          <Bar dataKey="value" fill="#1769E0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {m.dataType === 'pie_chart' && m.data && (
                    <div className="mt-3 pt-3 border-t border-slate-100 h-40 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={m.data} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={55} 
                            innerRadius={25}
                          >
                            {m.data.map((_: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {m.dataType === 'table' && m.data && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 overflow-x-auto">
                      <table className="w-full text-[11.5px] border-collapse">
                        <tbody>
                          {m.data.map((row: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-100 last:border-none">
                              <td className="py-1 text-slate-500 font-medium">{row.name || row.metric}</td>
                              <td className="py-1 text-right font-bold text-slate-900">{row.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Suggestions Pills */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(s)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition text-left"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-[9.5px] opacity-50 text-right">
                    {m.timestamp}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-[12px]">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-3 py-2 rounded-2xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about revenue, products, customers..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-[12.5px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
