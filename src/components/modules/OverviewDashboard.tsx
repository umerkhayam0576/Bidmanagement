import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  Landmark,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { RecentActivity } from '../dashboard/RecentActivity';

export const OverviewDashboard: React.FC = () => {
  const {
    activeBusiness,
    activeBusinessId,
    businesses,
    formatCurrency,
    calculateNetWorth,
    filteredInvoices,
    filteredLeads,
    filteredExpenses,
    filteredProjects,
    filteredInventory,
    notifications,
    setActiveTab,
    setIsAiAdvisorOpen
  } = useBusiness();

  const netWorthData = calculateNetWorth();

  // Metrics
  const isConsolidated = activeBusinessId === 'CONSOLIDATED';
  const totalRevenue = isConsolidated
    ? businesses.reduce((sum, b) => sum + b.monthlyRevenue, 0)
    : activeBusiness?.monthlyRevenue || 0;

  const totalCash = isConsolidated
    ? businesses.reduce((sum, b) => sum + b.cashBalance, 0)
    : activeBusiness?.cashBalance || 0;

  const totalValuation = isConsolidated
    ? businesses.reduce((sum, b) => sum + b.valuation, 0)
    : activeBusiness?.valuation || 0;

  const outstandingInvoices = filteredInvoices.filter((i) => i.status === 'SENT' || i.status === 'OVERDUE');
  const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + i.total, 0);

  const pipelineValue = filteredLeads
    .filter((l) => l.stage !== 'WON' && l.stage !== 'LOST')
    .reduce((sum, l) => sum + l.value, 0);

  const lowStockCount = filteredInventory.filter((item) => item.quantity <= item.reorderPoint).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            {isConsolidated ? <Layers className="w-6 h-6" /> : <Building className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">
                {isConsolidated ? 'Consolidated Portfolio Holdings' : activeBusiness?.name}
              </h1>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                {isConsolidated ? 'Multi-Entity' : activeBusiness?.industry}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isConsolidated
                ? 'Consolidated operational overview across 3 holding entities and personal equity assets.'
                : activeBusiness?.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('personal-wealth')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Personal Net Worth</span>
          </button>
          <button
            onClick={() => setIsAiAdvisorOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Strategic Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Run-Rate Revenue</span>
            <span className="text-emerald-400 flex items-center font-mono text-[11px] font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +14.2% MoM
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isConsolidated ? 'Aggregate of all 3 entities' : `Monthly pacing for ${activeBusiness?.currency}`}
          </div>
        </div>

        {/* Metric 2: Liquid Treasury Cash */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Liquid Cash & Treasury</span>
            <span className="text-slate-400 font-mono text-[11px]">Runway: 18+ Mo</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(totalCash)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across commercial checking & money markets
          </div>
        </div>

        {/* Metric 3: Entity / Portfolio Valuation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isConsolidated ? 'Total Portfolio Valuation' : 'Company Valuation'}</span>
            <span className="text-emerald-400 font-mono text-[11px]">
              {isConsolidated ? '3 Entities' : `${activeBusiness?.ownerEquityPercentage}% Owner`}
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(totalValuation)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isConsolidated
              ? `Your Net Worth: ${formatCurrency(netWorthData.netWorth, 'USD')}`
              : `Your equity share: ${formatCurrency(
                  ((activeBusiness?.valuation || 0) * (activeBusiness?.ownerEquityPercentage || 0)) / 100
                )}`}
          </div>
        </div>

        {/* Metric 4: Receivables & Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Outstanding Invoices</span>
            <span className="text-amber-400 font-mono text-[11px] font-semibold">
              {outstandingInvoices.length} Pending
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(outstandingAmount)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>CRM Pipeline:</span>
            <span className="font-semibold text-slate-300 font-mono">{formatCurrency(pipelineValue)}</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: Multi-business breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Entities & Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Holdings Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Portfolio Companies & Equity Stakes
                </h2>
                <p className="text-xs text-slate-400">
                  Direct ownership percentages, monthly revenue and cash reserves
                </p>
              </div>
              <button
                onClick={() => setActiveTab('partners')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Cap Tables</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {businesses.map((biz) => {
                const ownerShare = (biz.valuation * biz.ownerEquityPercentage) / 100;
                return (
                  <div
                    key={biz.id}
                    className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={biz.logo}
                          alt={biz.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{biz.name}</span>
                            <span className="text-[10px] bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded font-mono">
                              {biz.currency}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{biz.industry}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              {biz.ownerEquityPercentage}% Stake ({formatCurrency(ownerShare, biz.currency)})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Valuation</div>
                          <div className="text-sm font-bold text-white font-mono">
                            {formatCurrency(biz.valuation, biz.currency)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Monthly Rev</div>
                          <div className="text-sm font-bold text-emerald-400 font-mono">
                            {formatCurrency(biz.monthlyRevenue, biz.currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Projects Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active Project Deliverables
                </h2>
                <p className="text-xs text-slate-400">Budget pacing and milestone delivery tracking</p>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>All Projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredProjects.map((prj) => (
                <div
                  key={prj.id}
                  className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{prj.title}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({prj.clientName})</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {prj.progress}% Done
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      Budget: <span className="text-slate-300 font-mono">{formatCurrency(prj.budget)}</span>
                    </span>
                    <span>
                      Spent: <span className="text-slate-300 font-mono">{formatCurrency(prj.spent)}</span>
                    </span>
                    <span className="text-slate-400">Lead: {prj.leaderName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Recent Activity from Audit Logs */}
          <RecentActivity limit={5} />
        </div>

        {/* Right 1 Col: Actionable Alerts & Fast Shortcuts */}
        <div className="space-y-6">
          {/* Urgent Notices & Operations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Operational Attention</span>
            </h2>

            <div className="space-y-2.5">
              {outstandingInvoices.some((i) => i.status === 'OVERDUE') && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <div className="font-bold">Overdue Invoices Detected</div>
                  <p className="text-[11px] text-rose-200/80 mt-0.5">
                    1 or more invoices have crossed payment terms. Follow up to maintain cash runway.
                  </p>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="mt-2 text-[11px] font-bold underline hover:text-rose-100"
                  >
                    View Billing Ledger →
                  </button>
                </div>
              )}

              {lowStockCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <div className="font-bold">{lowStockCount} Inventory SKUs Below Reorder Point</div>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    Nordic Roasters warehouse needs restock action to prevent stockout.
                  </p>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="mt-2 text-[11px] font-bold underline hover:text-amber-100"
                  >
                    Open Inventory Manager →
                  </button>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-slate-300 text-xs">
                <div className="font-bold text-slate-200">Quarterly Dividend Distributions</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Q1 earnings review window starts in 14 days. Calculate partner distribution pools.
                </p>
                <button
                  onClick={() => setActiveTab('partners')}
                  className="mt-2 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Manage Cap Table →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Module Shortcuts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Quick Portals
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('billing')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Create Invoice</div>
                <div className="text-[10px] text-slate-400">Issue to Client</div>
              </button>
              <button
                onClick={() => setActiveTab('crm')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Add Sales Lead</div>
                <div className="text-[10px] text-slate-400">Update Pipeline</div>
              </button>
              <button
                onClick={() => setActiveTab('hr-payroll')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Run Payroll</div>
                <div className="text-[10px] text-slate-400">Monthly Remittance</div>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Legal Vault</div>
                <div className="text-[10px] text-slate-400">Deeds & Contracts</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
