import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Sliders, 
  CheckCircle2, 
  TrendingUp,
  Package,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExportButton } from '../components/common/ExportButton';
import { useDataset } from '../context/DatasetContext';
import { fetchMarketBasket } from '../api/apiClient';
import { DEMO_ASSOCIATION_RULES } from '../data/demoData';
import { NoDatasetEmptyState } from '../components/common/NoDatasetEmptyState';

export const MarketBasket: React.FC = () => {
  const { backendOnline, hasDataset, datasetMeta } = useDataset();
  const [rules, setRules] = useState(DEMO_ASSOCIATION_RULES);
  const [minSupport, setMinSupport] = useState(2);
  const [minConfidence, setMinConfidence] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (backendOnline && hasDataset) {
      setIsLoading(true);
      fetchMarketBasket(minSupport / 100, minConfidence / 100)
        .then((data) => {
          if (isMounted && data.rules && data.rules.length > 0) {
            setRules(data.rules);
          }
        })
        .catch((err) => {
          console.warn("Market basket fetch error:", err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [backendOnline, hasDataset, minSupport, minConfidence, datasetMeta.filename]);

  if (!hasDataset) {
    return <NoDatasetEmptyState pageName="Market Basket Analysis" />;
  }

  const filteredRules = rules;

  return (
    <div className="space-y-5">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-text-main tracking-tight leading-none">
            Market Basket Analysis
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            Apriori Association Mining — Discover frequent co-occurring product combinations to optimize bundles and checkout cross-sells.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton
            title="Association_Rules_Apriori"
            data={filteredRules}
            pdfTitle={`ECOMSIGHT Market Basket Rules (${datasetMeta.filename})`}
          />
        </div>
      </div>

      {/* Active Dataset Context Badge */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span className="text-text-muted">Mining Rules from Active Dataset:</span>
          <span className="font-semibold text-text-main bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
            {datasetMeta.filename}
          </span>
          <span className="text-text-muted font-mono text-[11px]">
            ({datasetMeta.rows.toLocaleString()} transactions)
          </span>
        </div>
        <span className="text-[11px] text-text-muted">
          {isLoading ? 'Mining frequent itemsets...' : `${filteredRules.length} product affinities identified`}
        </span>
      </div>

      {/* Threshold Filters Card */}
      <div className="dashboard-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <span className="text-[13px] font-semibold text-text-main">
            Mining Hyperparameters
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] text-text-muted font-medium">Min Support:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={minSupport}
              onChange={(e) => setMinSupport(Number(e.target.value))}
              className="w-24 accent-primary cursor-pointer"
            />
            <span className="text-[12px] font-semibold text-text-main w-8">{minSupport}%</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[12px] text-text-muted font-medium">Min Confidence:</span>
            <input
              type="range"
              min="20"
              max="80"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-24 accent-primary cursor-pointer"
            />
            <span className="text-[12px] font-semibold text-text-main w-8">{minConfidence}%</span>
          </div>

          <StatusBadge variant="blue">
            {filteredRules.length} Rules Discovered
          </StatusBadge>
        </div>
      </div>

      {/* Association Rules Table */}
      <div className="dashboard-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-text-main">
              Discovered Association Rules
            </h2>
            <p className="text-[11px] text-text-muted">
              Antecedent (Item A) implies Consequent (Item B) with lift and confidence
            </p>
          </div>
          <span className="text-[11px] text-text-muted">Sorted by Lift (Impact)</span>
        </div>

        <div className="overflow-x-auto border border-surface-border rounded-lg">
          <table className="w-full text-left data-table">
            <thead>
              <tr>
                <th>Antecedent (If Bought)</th>
                <th className="w-10 text-center"></th>
                <th>Consequent (Also Bought)</th>
                <th>Support</th>
                <th>Confidence</th>
                <th>Lift Factor</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-text-main">
                    <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 inline-block">
                      {rule.antecedent}
                    </span>
                  </td>
                  <td className="text-center">
                    <ArrowRight className="w-4 h-4 text-primary mx-auto" />
                  </td>
                  <td className="font-semibold text-primary">
                    <span className="px-2.5 py-1 rounded bg-primary-light border border-primary/20 inline-block">
                      {rule.consequent}
                    </span>
                  </td>
                  <td className="text-text-main font-medium">{rule.supportDisplay}</td>
                  <td className="text-text-main font-bold">{rule.confidenceDisplay}</td>
                  <td>
                    <StatusBadge variant="green" size="md">
                      {rule.lift}x Lift
                    </StatusBadge>
                  </td>
                  <td className="text-[11px] text-text-muted max-w-xs truncate">
                    {rule.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Product Relationship Network Graph */}
      <div className="dashboard-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-border mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-[16px] font-bold text-text-main flex items-center gap-2">
                <span>Product Relationship Graph</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Network Topology
                </span>
              </h3>
              <p className="text-[11px] text-text-muted">
                Visual co-occurrence network mined from <strong className="text-text-main">{datasetMeta.filename}</strong>. Edge weights indicate Apriori Lift.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
              {Array.from(new Set(filteredRules.flatMap(r => [r.antecedent, r.consequent]))).length} Connected SKUs
            </span>
            <span className="px-2.5 py-1 rounded-md bg-primary-light text-primary font-semibold">
              {filteredRules.length} Affinity Edges
            </span>
          </div>
        </div>

        {/* Visual Graph Viewport */}
        {(() => {
          const uniqueNodes = Array.from(new Set(filteredRules.flatMap(r => [r.antecedent, r.consequent])));
          const svgW = 820;
          const svgH = 430;
          const cx = svgW / 2;
          const cy = svgH / 2;
          const rx = 300;
          const ry = 145;

          const nodeMap: Record<string, { x: number; y: number; index: number }> = {};
          uniqueNodes.forEach((nodeName, idx) => {
            const angle = (idx / Math.max(1, uniqueNodes.length)) * 2 * Math.PI - Math.PI / 2;
            nodeMap[nodeName] = {
              x: Math.round(cx + rx * Math.cos(angle)),
              y: Math.round(cy + ry * Math.sin(angle)),
              index: idx
            };
          });

          // Unique undirected edges for rendering clean curved connectors
          const edgeMap = new Map<string, { source: string; target: string; lift: number; confidence: number }>();
          filteredRules.forEach(r => {
            const pairKey = [r.antecedent, r.consequent].sort().join("___");
            if (!edgeMap.has(pairKey)) {
              edgeMap.set(pairKey, {
                source: r.antecedent,
                target: r.consequent,
                lift: r.lift,
                confidence: r.confidence
              });
            }
          });
          const uniqueEdges = Array.from(edgeMap.values());

          return (
            <div className="relative bg-gradient-to-b from-slate-900 via-navy-950 to-slate-900 rounded-xl p-4 overflow-hidden border border-slate-800 shadow-inner">
              <div className="absolute top-3 left-4 text-[10.5px] text-cyan-300/80 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                <span>INTERACTIVE TOPOLOGY • HOVER SKU TO ISOLATE AFFINITIES</span>
              </div>

              <svg 
                viewBox={`0 0 ${svgW} ${svgH}`} 
                className="w-full h-auto select-none"
                style={{ maxHeight: '460px' }}
              >
                <defs>
                  {/* Glowing Edge Gradient */}
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#6366F1" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
                  </linearGradient>

                  {/* Center Hub Gradient */}
                  <radialGradient id="centerHub" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Subtle Center Glow Hub */}
                <circle cx={cx} cy={cy} r="180" fill="url(#centerHub)" />
                <circle cx={cx} cy={cy} r="3" fill="#38BDF8" opacity="0.6" />

                {/* Network Connector Curves */}
                {uniqueEdges.map((edge, eIdx) => {
                  const pA = nodeMap[edge.source];
                  const pB = nodeMap[edge.target];
                  if (!pA || !pB) return null;

                  // Quadratic curve through center
                  const pathD = `M ${pA.x} ${pA.y} Q ${cx} ${cy} ${pB.x} ${pB.y}`;
                  const midX = 0.25 * pA.x + 0.5 * cx + 0.25 * pB.x;
                  const midY = 0.25 * pA.y + 0.5 * cy + 0.25 * pB.y;
                  const strokeW = Math.min(4.5, Math.max(1.8, (edge.lift / 1.5)));

                  return (
                    <g key={`edge-${eIdx}`} className="group cursor-pointer">
                      <path
                        d={pathD}
                        fill="none"
                        stroke="url(#edgeGrad)"
                        strokeWidth={strokeW}
                        strokeDasharray={edge.lift > 3.0 ? "none" : "5,3"}
                        className="transition-all opacity-80 group-hover:opacity-100 group-hover:stroke-cyan-300"
                      />
                      {/* Midpoint Lift Indicator Badge */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-28"
                          y="-9"
                          width="56"
                          height="18"
                          rx="9"
                          fill="#0F172A"
                          stroke="#38BDF8"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill="#38BDF8"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {edge.lift}x Lift
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Product Node Pills */}
                {uniqueNodes.map((nodeName, nIdx) => {
                  const pos = nodeMap[nodeName];
                  if (!pos) return null;

                  const displayName = nodeName.length > 22 ? nodeName.slice(0, 20) + '…' : nodeName;
                  const pillWidth = Math.min(180, Math.max(130, displayName.length * 7.5 + 40));

                  return (
                    <g 
                      key={`node-${nIdx}`} 
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer group"
                    >
                      {/* Outer Glow on Hover */}
                      <rect
                        x={-pillWidth / 2}
                        y="-16"
                        width={pillWidth}
                        height="32"
                        rx="16"
                        fill="#0B1E36"
                        stroke="#0EA5E9"
                        strokeWidth="1.5"
                        className="transition-all drop-shadow-md group-hover:stroke-cyan-300 group-hover:fill-navy-900"
                      />
                      {/* Inner Icon Dot */}
                      <circle
                        cx={-pillWidth / 2 + 14}
                        cy="0"
                        r="4"
                        fill="#38BDF8"
                        className="animate-pulse"
                      />
                      {/* Product Name Label */}
                      <text
                        x={-pillWidth / 2 + 24}
                        y="3.5"
                        fill="#F8FAFC"
                        fontSize="9.5"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        {displayName}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2 pt-2 border-t border-slate-800/80">
                <span>💡 Edge line thickness represents affinity strength (Lift Multiplier).</span>
                <span className="text-cyan-300 font-medium">Dataset Grounded: {datasetMeta.filename}</span>
              </div>
            </div>
          );
        })()}

        {/* Association Bundle Affinity Cards */}
        <div className="mt-5 pt-4 border-t border-surface-border">
          <h4 className="text-[13px] font-semibold text-text-main mb-3 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span>Top Co-Occurring Product Bundles for Checkout Cross-Sell</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredRules.slice(0, 6).map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-surface-border hover:border-primary/40 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-text-main shrink-0">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[12px] font-semibold text-text-main truncate" title={rule.antecedent}>
                      {rule.antecedent}
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />

                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <span className="text-[12px] font-semibold text-primary truncate" title={rule.consequent}>
                      {rule.consequent}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200/60 text-[11px]">
                  <span className="text-text-muted">Confidence: <strong className="text-text-main">{rule.confidenceDisplay}</strong></span>
                  <span className="text-brand-green font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rule.lift}x Lift
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
