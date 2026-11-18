import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  Database, 
  Users, 
  ShoppingBag, 
  Layers, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  BarChart3,
  LineChart,
  Package,
  HelpCircle,
  FileSpreadsheet,
  Cpu,
  Layers as LayersIcon
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "Upload or Ingest Dataset",
      desc: "Import any CSV or Excel sales dataset with multi-attribute retail fields, or instantly use the built-in 3,481-row active dataset.",
      icon: Database,
      tag: "Input Stage"
    },
    {
      num: "02",
      title: "Automated Data Cleaning",
      desc: "Execute the 7-step preprocessing pipeline: median imputation for missing values, deduplication, and IQR anomaly filtering.",
      icon: Sparkles,
      tag: "Preprocessing Stage"
    },
    {
      num: "03",
      title: "Mine Patterns & Forecast",
      desc: "Run Scikit-learn Random Forest regression for sales prediction, K-Means for RFM customer segmentation, and Apriori for basket rules.",
      icon: TrendingUp,
      tag: "Machine Learning Stage"
    }
  ];

  const coreModules = [
    {
      title: "Data Cleaning & Preprocessing",
      subtitle: "DMT Module 1",
      desc: "Handles missing records, removes duplicate rows, corrects invalid transactions, and scales numerical values.",
      highlight: "807 missing values imputed • 78 duplicates dropped",
      icon: Database,
      color: "text-primary bg-primary-light"
    },
    {
      title: "Exploratory Sales Analytics",
      subtitle: "DMT Module 2",
      desc: "Interactive monthly revenue trajectories, category revenue splits, geographic regional demands, and gateway conversions.",
      highlight: "Real-time date filtering • Granular temporal views",
      icon: BarChart3,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Predictive Sales Forecasting",
      subtitle: "Primary ML Engine",
      desc: "Supervised machine learning algorithms forecasting forward sales with solid actual vs dashed projected trajectories.",
      highlight: "Random Forest Regressor • R² 0.91 Accuracy • MAE & RMSE",
      icon: TrendingUp,
      color: "text-brand-purple bg-brand-purpleLight"
    },
    {
      title: "Product Demand Classification",
      subtitle: "DMT Module 4",
      desc: "Identifies SKU inventory health and assigns High, Medium, and Low urgency badges to prevent costly stockouts.",
      highlight: "Comparative current vs predicted grouped charts",
      icon: Layers,
      color: "text-brand-amber bg-brand-amberLight"
    },
    {
      title: "Customer RFM Segmentation",
      subtitle: "DMT Module 5",
      desc: "Unsupervised K-Means clustering grouping shoppers into 4 actionable personas based on Recency, Frequency, and Monetary value.",
      highlight: "Interactive 2D Scatter Plot • 4 Centroids • Silhouette 0.68",
      icon: Users,
      color: "text-brand-green bg-brand-greenLight"
    },
    {
      title: "Market Basket Association Mining",
      subtitle: "DMT Module 6",
      desc: "Discovers frequent item combinations using the Apriori algorithm with Support, Confidence, and Lift factors for smart bundling.",
      highlight: "Antecedent -> Consequent rules • SKU relationship network",
      icon: ShoppingBag,
      color: "text-indigo-600 bg-indigo-50"
    }
  ];

  const faqs = [
    {
      q: "What is ECOMSIGHT?",
      a: "ECOMSIGHT is a production-quality web application built for Data Mining Techniques (DMT). It solves real e-commerce challenges by transforming raw sales spreadsheets into predictive models, customer segments, and cross-selling rules."
    },
    {
      q: "Which Machine Learning algorithms are implemented?",
      a: "The system implements Random Forest Regression and Linear Regression for sales forecasting (evaluated via MAE, RMSE, and R²), K-Means Clustering for RFM customer segmentation, and the Apriori algorithm for Association Rule Mining."
    },
    {
      q: "Can I upload my own custom dataset?",
      a: "Yes! Navigate to the Dataset page and drag-and-drop any CSV or Excel (.xlsx) file. The system parses your columns, computes missing values and duplicate rows, and lets you run all models on your custom dataset."
    },
    {
      q: "Can I export results for my project viva or presentation?",
      a: "Yes. Every analytical page includes an Export button capable of generating formatted PDF reports, structured Excel spreadsheets (.xlsx), or raw CSV logs with a single click."
    }
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-[64px] bg-white border-b border-surface-border sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between shadow-header">
          <div className="flex items-center gap-3">
            <img 
              src="/LOGO.png" 
              alt="EcomSight Logo" 
              className="w-10 h-10 object-contain drop-shadow-md rounded-xl hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[19px] font-black tracking-tight leading-none bg-gradient-to-r from-blue-700 via-primary to-indigo-600 bg-clip-text text-transparent">
                  EcomSight
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5 block">
                Sales Intelligence & Prediction Platform
              </span>
            </div>
          </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-text-muted">
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#modules" className="hover:text-primary transition-colors">Core Modules</a>
          <a href="#tech-stack" className="hover:text-primary transition-colors">Tech Stack</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-1.5 text-[12.5px] font-medium text-text-main hover:text-primary transition-colors"
          >
            Reviewer Login
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[12.5px] font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary-light/60 text-primary text-[12px] font-semibold mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Data Mining Techniques (DMT) Project • Academic & Enterprise Ready</span>
        </div>

        <h1 className="text-[34px] sm:text-[48px] font-extrabold text-text-main tracking-tight leading-[1.15] max-w-4xl mx-auto">
          E-Commerce Sales Intelligence & Machine Learning Prediction
        </h1>

        <p className="text-[15px] sm:text-[17px] text-text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
          Transform raw e-commerce retail data into clear business forecasts. Clean missing records, predict future sales, group customers by purchasing habits, and discover basket product combinations.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Open Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white border border-surface-border hover:bg-slate-50 text-text-main text-[14px] font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>One-Click Reviewer Access</span>
          </button>
        </div>

        {/* Live System Preview Card */}
        <div className="mt-12 dashboard-card p-6 border-surface-border shadow-lg text-left max-w-4xl mx-auto bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border gap-2">
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Active System Status
              </span>
              <h2 className="text-[17px] font-bold text-text-main mt-0.5">
                Live EcomSight Intelligence Engine
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[12px] bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="font-semibold">3,481 Active Dataset Records Loaded</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
              <span className="text-[11px] text-text-muted font-medium block">Total Revenue</span>
              <span className="text-[20px] font-bold text-text-main mt-0.5 block">₹12,84,500</span>
              <span className="text-[10px] text-brand-green font-medium">+12.6% growth</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
              <span className="text-[11px] text-text-muted font-medium block">Total Orders</span>
              <span className="text-[20px] font-bold text-text-main mt-0.5 block">18,450</span>
              <span className="text-[10px] text-brand-green font-medium">+8.2% velocity</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
              <span className="text-[11px] text-text-muted font-medium block">Model R² Score</span>
              <span className="text-[20px] font-bold text-brand-green mt-0.5 block">0.91 (91%)</span>
              <span className="text-[10px] text-brand-green font-medium">Random Forest</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-surface-border">
              <span className="text-[11px] text-text-muted font-medium block">Customer Clusters</span>
              <span className="text-[20px] font-bold text-primary mt-0.5 block">4 Segments</span>
              <span className="text-[10px] text-brand-purple font-medium">K-Means RFM</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Simple 3-Step Section) */}
      <section id="how-it-works" className="py-14 bg-white border-y border-surface-border px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-[26px] sm:text-[30px] font-bold text-text-main mt-1">
              How ECOMSIGHT Works
            </h2>
            <p className="text-[13px] text-text-muted mt-2">
              From unorganized spreadsheet rows to reliable machine learning forecasts in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="dashboard-card p-6 flex flex-col justify-between border-slate-200">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[22px] font-extrabold text-primary/40 font-mono">
                        {s.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                      {s.tag}
                    </span>
                    <h3 className="text-[16px] font-bold text-text-main">
                      {s.title}
                    </h3>
                    <p className="text-[12.5px] text-text-muted mt-2 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core DMT Modules */}
      <section id="modules" className="py-14 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Key Capabilities
          </span>
          <h2 className="text-[26px] sm:text-[30px] font-bold text-text-main mt-1">
            6 Core Data Mining Modules
          </h2>
          <p className="text-[13px] text-text-muted mt-2">
            Engineered specifically to fulfill academic data mining criteria and real business intelligence needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreModules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div 
                key={idx} 
                className="dashboard-card p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-text-muted">
                      {m.subtitle}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-text-main">
                    {m.title}
                  </h3>
                  <p className="text-[12px] text-text-muted mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-primary block">
                    ✓ {m.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-12 bg-white border-y border-surface-border px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              System Architecture
            </span>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-text-main mt-1">
              Built on Modern Production Standards
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-bold text-primary uppercase block">API Backend</span>
              <span className="text-[15px] font-bold text-text-main mt-1 block">FastAPI</span>
              <span className="text-[11px] text-text-muted mt-0.5 block">High-speed Python REST API</span>
            </div>

            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-bold text-brand-green uppercase block">ML Engines</span>
              <span className="text-[15px] font-bold text-text-main mt-1 block">Scikit-Learn</span>
              <span className="text-[11px] text-text-muted mt-0.5 block">Regression, K-Means & Apriori</span>
            </div>

            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-bold text-brand-purple uppercase block">Frontend UI</span>
              <span className="text-[15px] font-bold text-text-main mt-1 block">React & Vite</span>
              <span className="text-[11px] text-text-muted mt-0.5 block">Tailwind CSS & Recharts</span>
            </div>

            <div className="dashboard-card p-4 text-center">
              <span className="text-[11px] font-bold text-brand-amber uppercase block">Exports</span>
              <span className="text-[15px] font-bold text-text-main mt-1 block">PDF & Excel</span>
              <span className="text-[11px] text-text-muted mt-0.5 block">Printable reports & XLSX logs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="py-14 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Questions & Answers
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-text-main mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="dashboard-card p-4 cursor-pointer transition-all"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-text-main flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <ChevronRight className={`w-4 h-4 text-text-muted transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </div>
              {activeFaq === idx && (
                <p className="text-[12.5px] text-text-muted mt-2.5 pt-2.5 border-t border-slate-100 leading-relaxed pl-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Explore Callout */}
      <section className="py-8 px-4 sm:px-8 max-w-5xl mx-auto mb-10">
        <div className="p-7 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-900 to-navy-850 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-primary/30 text-blue-200 border border-primary/40 mb-2">
              READY FOR REVIEW
            </span>
            <h3 className="text-[20px] font-bold text-white leading-tight">
              Ready to test the Live ECOMSIGHT System?
            </h3>
            <p className="text-[13px] text-slate-300 mt-1.5 max-w-lg leading-relaxed">
              Explore all 10 modules with full administrator rights and test predictive machine learning algorithms directly.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>Open Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-surface-border py-6 px-4 sm:px-8 text-center text-[12px] text-text-muted mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-main">ECOMSIGHT</span>
            <span>— E-Commerce Sales Intelligence & Prediction System</span>
          </div>
          <div className="flex items-center gap-4 text-text-muted">
            <Link to="/login" className="hover:text-primary">Sign In</Link>
            <Link to="/" className="hover:text-primary">Dashboard</Link>
            <span>DMT Project 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
