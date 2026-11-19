import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Sliders,
  TrendingUp,
  Users,
  ShoppingBag,
  AlertTriangle,
  Database,
  FileText,
  Sparkles,
  Settings,
  ArrowRight,
  Command,
  Zap,
  Package,
  LineChart
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Analytics';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  action?: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items: CommandItem[] = [
    {
      id: 'dashboard',
      category: 'Navigation',
      title: 'Executive Dashboard',
      subtitle: 'Bento Grid overview, real-time KPIs and revenue trends',
      icon: LayoutDashboard,
      path: '/',
      badge: 'Overview'
    },
    {
      id: 'dataset',
      category: 'Navigation',
      title: 'Dataset Management',
      subtitle: 'Upload CSV datasets, switch active databases, inspect schema',
      icon: Database,
      path: '/dataset',
      badge: 'Data Ingestion'
    },
    {
      id: 'preprocessing',
      category: 'Actions',
      title: 'Data Preprocessing & Health',
      subtitle: 'Auto-clean missing values, prune duplicates, remove outliers',
      icon: Sparkles,
      path: '/preprocessing',
      badge: 'ETL'
    },
    {
      id: 'sales-analysis',
      category: 'Analytics',
      title: 'Sales Analysis',
      subtitle: 'Exploratory data analysis across temporal and categorical trends',
      icon: LineChart,
      path: '/sales-analysis',
      badge: 'EDA'
    },
    {
      id: 'prediction',
      category: 'Analytics',
      title: 'Sales Prediction Engine',
      subtitle: 'Machine learning forecasts with confidence intervals',
      icon: TrendingUp,
      path: '/prediction',
      badge: 'ML Model'
    },
    {
      id: 'product-analysis',
      category: 'Navigation',
      title: 'Product Analysis',
      subtitle: 'Demand forecasts, SKU velocity & reorder thresholds',
      icon: Package,
      path: '/product-analysis'
    },
    {
      id: 'inventory-alerts',
      category: 'Actions',
      title: 'Inventory Stockout Alerts',
      subtitle: 'Lead time calculations, safety stock and reorder urgency',
      icon: AlertTriangle,
      path: '/inventory-alerts',
      badge: 'Urgent'
    },
    {
      id: 'customer-segmentation',
      category: 'Analytics',
      title: 'Customer Segmentation (RFM + K-Means)',
      subtitle: 'Cluster analysis: Champions, Loyal, At-Risk & Lost',
      icon: Users,
      path: '/customer-segmentation',
      badge: 'Clustering'
    },
    {
      id: 'market-basket',
      category: 'Analytics',
      title: 'Market Basket Analysis (Apriori)',
      subtitle: 'Product cross-sell rules, support, confidence & lift scores',
      icon: ShoppingBag,
      path: '/market-basket',
      badge: 'Apriori'
    },
    {
      id: 'reports',
      category: 'Actions',
      title: 'Executive PDF & Excel Reports',
      subtitle: 'Generate presentation-ready audit decks and spreadsheets',
      icon: FileText,
      path: '/reports',
      badge: 'Export'
    },
    {
      id: 'settings',
      category: 'Navigation',
      title: 'System & Engine Settings',
      subtitle: 'Model hyperparameters, API endpoints and preferences',
      icon: Settings,
      path: '/settings'
    }
  ];

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, page name, or ML model..."
            className="w-full text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            ESC
          </kbd>
        </div>

        {/* List of items */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching pages or actions found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${isSelected
                    ? 'bg-blue-50 text-blue-900'
                    : 'hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{item.title}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${isSelected
                            ? 'bg-blue-200/60 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                            }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Zap className="w-3 h-3 text-amber-500" /> EcomSight Spotlight
          </span>
        </div>
      </div>
    </div>
  );
};
