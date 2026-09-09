import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const AiAdvisorModal: React.FC = () => {
  const {
    isAiAdvisorOpen,
    setIsAiAdvisorOpen,
    activeBusiness,
    activeBusinessId,
    businesses,
    calculateNetWorth,
    filteredInvoices,
    filteredExpenses
  } = useBusiness();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  if (!isAiAdvisorOpen) return null;

  const netWorthData = calculateNetWorth();
  const currentEntityName =
    activeBusinessId === 'CONSOLIDATED'
      ? 'Consolidated Portfolio'
      : activeBusiness?.name || 'Selected Entity';

  const handleAskAdvisor = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setAnalysis(null);

    const contextData = {
      entity: currentEntityName,
      monthlyRevenue: activeBusiness?.monthlyRevenue || 0,
      valuation: activeBusiness?.valuation || 0,
      cashBalance: activeBusiness?.cashBalance || 0,
      ownerEquityPercentage: activeBusiness?.ownerEquityPercentage || 100,
      activeInvoicesCount: filteredInvoices.length,
      unpaidInvoicesSum: filteredInvoices
        .filter((i) => i.status !== 'PAID')
        .reduce((sum, i) => sum + i.total, 0),
      recordedExpensesSum: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
      portfolioNetWorth: netWorthData.netWorth
    };

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: currentEntityName,
          query: finalQuery,
          contextData
        })
      });

      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
        setSource(data.source);
      } else {
        setAnalysis('Unable to process AI Advisory request at this time.');
      }
    } catch (err: any) {
      setAnalysis(`Connection error: ${err.message || 'Please check backend server connection.'}`);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Analyze cash runway & dividend distribution safety',
    'Review OpEx efficiency vs revenue margin ratio',
    'Evaluate receivables risk and overdue invoice recovery',
    'Strategic tax & legal governance checklist'
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                  AI Strategic Advisor
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                  Gemini Flash 2.5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Context Grounding: <span className="text-white font-semibold">{currentEntityName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiAdvisorOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Quick suggestions */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Executive Prompts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p);
                    handleAskAdvisor(p);
                  }}
                  className="text-left text-xs bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl transition-all"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Result */}
          {loading && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <div className="text-xs font-bold text-slate-300">
                Synthesizing multi-business financial telemetry...
              </div>
              <div className="text-[11px] text-slate-400 max-w-sm">
                Evaluating EBITDA ratios, cap table distributions, outstanding receivables, and personal equity allocations.
              </div>
            </div>
          )}

          {analysis && !loading && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Executive Strategic Intelligence
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Engine: {source || 'Gemini'}
                </span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                {analysis}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAdvisor();
          }}
          className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask any financial, tax, or business strategy question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate Brief</span>
          </button>
        </form>
      </div>
    </div>
  );
};
