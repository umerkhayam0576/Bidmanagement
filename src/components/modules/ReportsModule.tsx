import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Calendar,
  Layers
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const ReportsModule: React.FC = () => {
  const {
    activeBusiness,
    activeBusinessId,
    businesses,
    formatCurrency,
    filteredInvoices,
    filteredExpenses,
    filteredEmployees
  } = useBusiness();

  const [period, setPeriod] = useState('YTD 2025');

  const isConsolidated = activeBusinessId === 'CONSOLIDATED';
  const totalRev = isConsolidated
    ? businesses.reduce((sum, b) => sum + b.monthlyRevenue * 4, 0)
    : (activeBusiness?.monthlyRevenue || 0) * 4;

  const totalExp = isConsolidated
    ? filteredExpenses.reduce((sum, e) => sum + e.amount, 0) * 2
    : filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const grossProfit = totalRev - totalExp;
  const netMargin = totalRev > 0 ? ((grossProfit / totalRev) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Financial Statements & Analytics</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Executive Reports & P&L</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audited financial statements, EBITDA metrics, margin analysis, and board-level reporting packs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="Q1 2025">Q1 2025</option>
            <option value="YTD 2025">YTD 2025 (Trailing 4 Mo)</option>
            <option value="FY 2024">FY 2024 (Audited)</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* High-Level P&L Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Inflow Revenue</div>
          <div className="text-2xl font-black text-white font-mono mt-2">{formatCurrency(totalRev)}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            +18.4% YoY
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Operating Expenses (OpEx)</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-2">
            -{formatCurrency(totalExp)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Infrastructure, staff & vendors</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Net Operating Income</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(grossProfit)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Before tax & distributions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Net Profit Margin</div>
          <div className="text-2xl font-black text-white font-mono mt-2">{netMargin}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">High operating leverage</div>
        </div>
      </div>

      {/* P&L Line Item Statement Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Profit & Loss Statement ({period})
            </h2>
            <p className="text-xs text-slate-400">
              Reporting Entity: {isConsolidated ? 'Consolidated Holdings Group' : activeBusiness?.name}
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
            Standard GAAP Basis
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {/* Revenue section */}
          <div>
            <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] mb-2">
              1. REVENUE & OPERATING RECEIPTS
            </div>
            <div className="space-y-1.5 pl-3 border-l-2 border-slate-800">
              <div className="flex justify-between text-slate-300 py-1">
                <span>Enterprise Client Contract Services</span>
                <span className="font-bold text-white">{formatCurrency(totalRev * 0.72)}</span>
              </div>
              <div className="flex justify-between text-slate-300 py-1">
                <span>Recurring Software Licenses & SLA Fees</span>
                <span className="font-bold text-white">{formatCurrency(totalRev * 0.28)}</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-bold pt-2 border-t border-slate-800/80">
                <span>TOTAL GROSS REVENUE</span>
                <span>{formatCurrency(totalRev)}</span>
              </div>
            </div>
          </div>

          {/* OpEx section */}
          <div className="pt-3">
            <div className="text-rose-400 font-bold uppercase tracking-wider text-[11px] mb-2">
              2. OPERATIONAL EXPENDITURES (OPEX)
            </div>
            <div className="space-y-1.5 pl-3 border-l-2 border-slate-800">
              <div className="flex justify-between text-slate-300 py-1">
                <span>Personnel & Executive Compensation</span>
                <span className="font-bold text-rose-300">-{formatCurrency(totalExp * 0.55)}</span>
              </div>
              <div className="flex justify-between text-slate-300 py-1">
                <span>Cloud Infrastructure & High-Performance Compute</span>
                <span className="font-bold text-rose-300">-{formatCurrency(totalExp * 0.25)}</span>
              </div>
              <div className="flex justify-between text-slate-300 py-1">
                <span>Corporate Facilities, Rent & Utilities</span>
                <span className="font-bold text-rose-300">-{formatCurrency(totalExp * 0.12)}</span>
              </div>
              <div className="flex justify-between text-slate-300 py-1">
                <span>Professional Legal & Advisory Fees</span>
                <span className="font-bold text-rose-300">-{formatCurrency(totalExp * 0.08)}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-bold pt-2 border-t border-slate-800/80">
                <span>TOTAL OPERATING COSTS</span>
                <span>-{formatCurrency(totalExp)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="pt-4 border-t-2 border-slate-700">
            <div className="flex justify-between text-sm font-black text-white py-1">
              <span>NET OPERATING SURPLUS / EBITDA</span>
              <span className="text-emerald-400">{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 py-0.5">
              <span>Effective Profit Margin %:</span>
              <span className="text-emerald-300">{netMargin}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
