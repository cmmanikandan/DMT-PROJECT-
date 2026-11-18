import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw,
  Percent,
  Megaphone,
  ShoppingBag,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { useDataset } from '../context/DatasetContext';
import { fetchWhatIfSimulation } from '../api/apiClient';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const WhatIfSimulator: React.FC = () => {
  const { hasDataset, backendOnline } = useDataset();

  // Simulation controls
  const [discountPct, setDiscountPct] = useState<number>(10);
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [marketingMultiplier, setMarketingMultiplier] = useState<number>(1.2);
  const [festivalMode, setFestivalMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Simulation results
  const [loading, setLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      if (backendOnline) {
        const data = await fetchWhatIfSimulation({
          discount_pct: discountPct,
          price_change_pct: priceChangePct,
          marketing_multiplier: marketingMultiplier,
          festival_mode: festivalMode,
          category: selectedCategory
        });
        setSimResult(data);
      } else {
        // Fallback realistic simulation calculation in frontend
        const baseRev = 1284500;
        const baseUnits = 18450;
        const elasticity = -1.4;
        const netPrice = (priceChangePct - discountPct) / 100.0;
        const mktgFactor = Math.pow(Math.max(0.1, marketingMultiplier), 0.4) - 1.0;
        const festFactor = festivalMode ? 0.35 : 0.0;
        const qtyMultiplier = Math.max(0.2, 1.0 + (elasticity * netPrice) + mktgFactor + festFactor);
        const priceMultiplier = Math.max(0.4, (1.0 + (priceChangePct / 100.0)) * (1.0 - (discountPct / 100.0)));
        const simRev = baseRev * qtyMultiplier * priceMultiplier;
        const simUnits = Math.round(baseUnits * qtyMultiplier);
        const baseProfit = baseRev * 0.52;
        const adCost = marketingMultiplier > 1.0 ? (marketingMultiplier - 1.0) * 0.08 * baseRev : 0;
        const simProfit = Math.max(0, (simRev * 0.52) - adCost);

        setSimResult({
          status: simRev > baseRev ? (simProfit / simRev > 0.38 ? 'optimal' : 'warning') : 'critical',
          recommendation: simRev > baseRev 
            ? "Favorable Strategy: Strong expansion in volume with positive net revenue uplift." 
            : "Demand Contraction: Net price hike reduces order volume below break-even threshold.",
          baseline: {
            revenue: baseRev,
            units: baseUnits,
            gross_profit: baseProfit,
            margin_pct: 52.0,
            aov: 695
          },
          simulated: {
            revenue: Math.round(simRev),
            units: simUnits,
            gross_profit: Math.round(simProfit),
            margin_pct: Math.round((simProfit / simRev) * 1000) / 10,
            revenue_growth_pct: Math.round(((simRev - baseRev) / baseRev) * 1000) / 10,
            unit_growth_pct: Math.round(((simUnits - baseUnits) / baseUnits) * 1000) / 10
          },
          category_breakdown: [
            { category: 'Electronics', baseline_revenue: 520000, simulated_revenue: Math.round(520000 * qtyMultiplier * priceMultiplier) },
            { category: 'Fashion', baseline_revenue: 340000, simulated_revenue: Math.round(340000 * qtyMultiplier * priceMultiplier) },
            { category: 'Home & Living', baseline_revenue: 260000, simulated_revenue: Math.round(260000 * qtyMultiplier * priceMultiplier) },
            { category: 'Beauty', baseline_revenue: 164500, simulated_revenue: Math.round(164500 * qtyMultiplier * priceMultiplier) }
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [discountPct, priceChangePct, marketingMultiplier, festivalMode, selectedCategory, backendOnline]);

  const handleReset = () => {
    setDiscountPct(10);
    setPriceChangePct(0);
    setMarketingMultiplier(1.0);
    setFestivalMode(false);
    setSelectedCategory('All');
  };

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="What-If Scenario Simulator" />;
  }

  const formatCurrency = (val: number) => `₹${val.toLocaleString()}`;
  const isPositiveGrowth = simResult?.simulated?.revenue_growth_pct >= 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              What-If Revenue Simulator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
              AI Sandbox
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Simulate real-time revenue, price elasticity, and gross profit impact across pricing, promotion, and festival events.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Parameters
        </button>
      </div>

      {/* Main Grid: Controls on Left, Metrics & Projections on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Control Panel */}
        <div className="lg:col-span-5 bento-card p-6 bg-white border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Scenario Levers
            </h3>
            {loading && <span className="text-xs text-blue-600 animate-pulse font-medium">Recalculating...</span>}
          </div>

          {/* Lever 1: Discount Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-500" />
                Storewide Promotional Discount
              </label>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                {discountPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={discountPct}
              onChange={e => setDiscountPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (No Sale)</span>
              <span>20% (Standard Promo)</span>
              <span>40% (Clearance)</span>
            </div>
          </div>

          {/* Lever 2: Base Price Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Base Catalog Price Change
              </label>
              <span className={`px-2 py-0.5 rounded-md font-bold ${
                priceChangePct > 0 ? 'bg-emerald-50 text-emerald-700' : (priceChangePct < 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600')
              }`}>
                {priceChangePct > 0 ? `+${priceChangePct}%` : `${priceChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-25"
              max="25"
              step="1"
              value={priceChangePct}
              onChange={e => setPriceChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-25% Price Cut</span>
              <span>0% Baseline</span>
              <span>+25% Price Hike</span>
            </div>
          </div>

          {/* Lever 3: Marketing Ad Spend */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-indigo-500" />
                Paid Ad Budget Multiplier
              </label>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                {marketingMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={marketingMultiplier}
              onChange={e => setMarketingMultiplier(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.5x (-50% spend)</span>
              <span>1.0x (Standard)</span>
              <span>3.0x (Hyper Scale)</span>
            </div>
          </div>

          {/* Lever 4: Festive Surge Mode */}
          <div className="pt-2">
            <div 
              onClick={() => setFestivalMode(!festivalMode)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                festivalMode 
                  ? 'border-amber-400 bg-amber-50/70 shadow-xs' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${festivalMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Festival / Mega Sale Surge</p>
                  <p className="text-[11px] text-slate-500">+35% baseline shopping intent & conversion uplift</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                festivalMode ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {festivalMode && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>

          {/* Micro Model Explainer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              Engine utilizes <strong>Price Elasticity of Demand (PED = -1.4)</strong> with diminishing marginal returns on ad scale.
            </span>
          </div>
        </div>

        {/* Projections & Impact Summary */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Strategy Banner */}
          {simResult && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              simResult.status === 'optimal' 
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                : (simResult.status === 'warning' 
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
                    : 'bg-rose-50/80 border-rose-200 text-rose-900')
            }`}>
              <div className={`p-2 rounded-lg ${
                simResult.status === 'optimal' 
                  ? 'bg-emerald-600 text-white' 
                  : (simResult.status === 'warning' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white')
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">AI Scenario Evaluation</p>
                <p className="text-sm font-semibold mt-0.5">{simResult.recommendation}</p>
              </div>
            </div>
          )}

          {/* 4 Projected Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Projected Revenue */}
            <div className="bento-card p-4 bg-white border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Simulated Revenue</p>
              <p className="text-lg font-black text-slate-900 mt-1">
                {simResult ? formatCurrency(simResult.simulated.revenue) : '—'}
              </p>
              <div className="flex items-center gap-1 mt-1.5 text-xs font-bold">
                {isPositiveGrowth ? (
                  <span className="text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +{simResult?.simulated?.revenue_growth_pct}%
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center">
                    <ArrowDownRight className="w-3.5 h-3.5" /> {simResult?.simulated?.revenue_growth_pct}%
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-normal">vs base</span>
              </div>
            </div>

            {/* Metric 2: Projected Units */}
            <div className="bento-card p-4 bg-white border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Simulated Units</p>
              <p className="text-lg font-black text-slate-900 mt-1">
                {simResult ? simResult.simulated.units.toLocaleString() : '—'}
              </p>
              <div className="flex items-center gap-1 mt-1.5 text-xs font-bold text-slate-600">
                <span>{simResult?.simulated?.unit_growth_pct > 0 ? `+${simResult.simulated.unit_growth_pct}%` : `${simResult?.simulated?.unit_growth_pct}%`}</span>
                <span className="text-[10px] text-slate-400 font-normal">orders</span>
              </div>
            </div>

            {/* Metric 3: Gross Profit */}
            <div className="bento-card p-4 bg-white border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gross Profit</p>
              <p className="text-lg font-black text-slate-900 mt-1">
                {simResult ? formatCurrency(simResult.simulated.gross_profit) : '—'}
              </p>
              <div className="mt-1.5 text-xs font-semibold text-slate-500">
                Margin: <span className="text-slate-800 font-bold">{simResult?.simulated?.margin_pct}%</span>
              </div>
            </div>

            {/* Metric 4: Baseline Comparison */}
            <div className="bento-card p-4 bg-slate-50/70 border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Current Baseline</p>
              <p className="text-lg font-black text-slate-700 mt-1">
                {simResult ? formatCurrency(simResult.baseline.revenue) : '—'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Base Units: {simResult?.baseline?.units?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Side-by-Side Category Revenue Chart */}
          <div className="bento-card p-5 bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Category Impact: Baseline vs. Simulated
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Projected revenue lift across product departments</p>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Values in ₹
              </span>
            </div>

            <div className="h-[240px] w-full">
              {simResult?.category_breakdown && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simResult.category_breakdown} barGap={4} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis 
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#F8FAFC' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="baseline_revenue" name="Current Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulated_revenue" name="Simulated Scenario" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
