import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  ArrowRight,
  User,
  ShieldCheck,
  X,
  FileText,
  Percent,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Bid, BidStage } from '../../types';

const BID_STAGES: { id: BidStage; label: string; color: string; bg: string }[] = [
  { id: 'LEAD', label: 'Tender Invitation', color: 'text-neutral-700', bg: 'bg-neutral-100 dark:bg-neutral-800' },
  { id: 'ESTIMATING', label: 'Cost Estimating', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  { id: 'REVIEW', label: 'Internal Review', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { id: 'SUBMITTED', label: 'Bid Submitted', color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  { id: 'AWARDED', label: 'Contract Awarded', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'LOST', label: 'Unsuccessful', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' }
];

export const BidBoardModule: React.FC = () => {
  const { bids, addBid, updateBidStage, formatCurrency, currentUser } = useBusiness();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [isNewBidModalOpen, setIsNewBidModalOpen] = useState(false);

  // New Bid Form State
  const [formCode, setFormCode] = useState(`BID-2024-0${bids.length + 12}`);
  const [formTitle, setFormTitle] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formMargin, setFormMargin] = useState('14');
  const [formWinProb, setFormWinProb] = useState('65');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDiscipline, setFormDiscipline] = useState('Civil & Structural');
  const [formEstimator, setFormEstimator] = useState(currentUser.name);
  const [formScope, setFormScope] = useState('');

  const disciplines = useMemo(() => {
    const set = new Set<string>();
    bids.forEach((b) => set.add(b.discipline));
    return ['ALL', ...Array.from(set)];
  }, [bids]);

  const filteredBids = useMemo(() => {
    return bids.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.leadEstimator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiscipline = selectedDiscipline === 'ALL' || b.discipline === selectedDiscipline;
      const matchesStage = selectedStage === 'ALL' || b.stage === selectedStage;
      return matchesSearch && matchesDiscipline && matchesStage;
    });
  }, [bids, searchQuery, selectedDiscipline, selectedStage]);

  // Metric aggregates
  const metrics = useMemo(() => {
    const totalPipeline = bids
      .filter((b) => b.stage !== 'LOST')
      .reduce((sum, b) => sum + b.estimatedValue, 0);
    const awardedValue = bids
      .filter((b) => b.stage === 'AWARDED')
      .reduce((sum, b) => sum + b.estimatedValue, 0);
    const activeTendersCount = bids.filter(
      (b) => b.stage !== 'AWARDED' && b.stage !== 'LOST'
    ).length;
    const avgWinRate = Math.round(
      (bids.filter((b) => b.stage === 'AWARDED').length /
        Math.max(1, bids.filter((b) => b.stage === 'AWARDED' || b.stage === 'LOST').length)) *
        100
    );

    return { totalPipeline, awardedValue, activeTendersCount, avgWinRate };
  }, [bids]);

  const handleCreateBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formClient || !formValue) return;

    addBid({
      code: formCode,
      title: formTitle,
      clientName: formClient,
      estimatedValue: parseFloat(formValue) || 0,
      marginPercentage: parseFloat(formMargin) || 12,
      submissionDeadline: formDeadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      stage: 'ESTIMATING',
      discipline: formDiscipline,
      leadEstimator: formEstimator,
      winProbability: parseInt(formWinProb) || 50,
      scopeSummary: formScope || 'Tender scope under detailed cost takeoff.',
      bondRequired: true
    });

    setIsNewBidModalOpen(false);
    setFormTitle('');
    setFormClient('');
    setFormValue('');
    setFormScope('');
  };

  return (
    <div id="bid-board-module" className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Bid & Tender Board
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Active engineering proposals, estimation pipeline, and tender tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium">
            <button
              id="view-kanban-btn"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Pipeline Board
            </button>
            <button
              id="view-table-btn"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            id="create-new-bid-btn"
            onClick={() => setIsNewBidModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Tender Bid</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Tender Pipeline
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(metrics.totalPipeline)}
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
            Across active proposals
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Active Tenders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {metrics.activeTendersCount}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">In Progress</span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
            Pending submission or decision
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Awarded Contracts
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(metrics.awardedValue)}
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
            Won tenders this cycle
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Award Conversion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {metrics.avgWinRate}%
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
            Win ratio on decided tenders
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="bid-search-input"
            type="text"
            placeholder="Search tender code, client, estimator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            id="bid-discipline-filter"
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Disciplines' : d}
              </option>
            ))}
          </select>

          <select
            id="bid-stage-filter"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Stages</option>
            {BID_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1280px]">
            {BID_STAGES.map((stage) => {
              const stageBids = filteredBids.filter((b) => b.stage === stage.id);
              const stageSum = stageBids.reduce((sum, b) => sum + b.estimatedValue, 0);

              return (
                <div
                  key={stage.id}
                  className="flex-1 min-w-[240px] max-w-[280px] bg-neutral-50 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${stage.bg} ${stage.color}`}>
                        {stage.label}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">{stageBids.length}</span>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 font-medium">
                    {formatCurrency(stageSum)}
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                    {stageBids.map((bid) => (
                      <div
                        key={bid.id}
                        id={`bid-card-${bid.id}`}
                        onClick={() => setSelectedBid(bid)}
                        className="bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                          <span className="font-mono font-medium text-neutral-600 dark:text-neutral-300">
                            {bid.code}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {bid.winProbability}% win
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {bid.title}
                        </h4>

                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-neutral-400" />
                          <span className="truncate">{bid.clientName}</span>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-neutral-400 text-[10px] uppercase block">Value</span>
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              {formatCurrency(bid.estimatedValue)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-neutral-400 text-[10px] uppercase block">Margin</span>
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                              {bid.marginPercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="flex items-center gap-1 text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            {bid.submissionDeadline}
                          </span>
                          <span className="truncate text-neutral-400 max-w-[90px]">{bid.leadEstimator.split(' ')[0]}</span>
                        </div>
                      </div>
                    ))}

                    {stageBids.length === 0 && (
                      <div className="text-center py-6 text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                        No bids in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Code & Project</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Tender Value</th>
                  <th className="py-3 px-4 text-right">Margin</th>
                  <th className="py-3 px-4 text-right">Probability</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Lead Estimator</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredBids.map((bid) => {
                  const stageObj = BID_STAGES.find((s) => s.id === bid.stage);
                  return (
                    <tr
                      key={bid.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedBid(bid)}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-medium text-neutral-400 block">{bid.code}</span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{bid.title}</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{bid.clientName}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                          {bid.discipline}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${stageObj?.bg || 'bg-neutral-100'} ${
                            stageObj?.color || 'text-neutral-700'
                          }`}
                        >
                          {stageObj?.label || bid.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                        {formatCurrency(bid.estimatedValue)}
                      </td>
                      <td className="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400 font-medium">
                        {bid.marginPercentage}%
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        {bid.winProbability}%
                      </td>
                      <td className="py-3 px-4 text-neutral-500 text-xs">{bid.submissionDeadline}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 text-xs">{bid.leadEstimator}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBid(bid);
                          }}
                          className="p-1 text-neutral-400 hover:text-indigo-600 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bid Detail Drawer / Modal */}
      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-xl w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {selectedBid.code}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {selectedBid.title}
                </h3>
              </div>
              <button
                id="close-bid-detail-btn"
                onClick={() => setSelectedBid(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl">
                <div>
                  <span className="text-xs text-neutral-400 block">Tender Value</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(selectedBid.estimatedValue)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Estimated Margin</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedBid.marginPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Client / Authority</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {selectedBid.clientName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Win Probability</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedBid.winProbability}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-1">
                  Scope & Estimating Summary
                </span>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  {selectedBid.scopeSummary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Discipline</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{selectedBid.discipline}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Submission Deadline</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{selectedBid.submissionDeadline}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Lead Estimator</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{selectedBid.leadEstimator}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Bid Bond / Guarantee</span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {selectedBid.bondRequired ? 'Required (5%)' : 'Not Required'}
                    </span>
                  </div>
                  {selectedBid.bondRequired && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                </div>
              </div>

              {/* Stage Progression Selector */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Update Stage
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {BID_STAGES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        updateBidStage(selectedBid.id, st.id);
                        setSelectedBid({ ...selectedBid, stage: st.id });
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                        selectedBid.stage === st.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedBid(null)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Bid Modal */}
      {isNewBidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Register New Tender Proposal
              </h3>
              <button
                onClick={() => setIsNewBidModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBid} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Tender Code
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Discipline
                  </label>
                  <select
                    value={formDiscipline}
                    onChange={(e) => setFormDiscipline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Civil & Structural">Civil & Structural</option>
                    <option value="MEP & Fire Protection">MEP & Fire Protection</option>
                    <option value="Infrastructure & Earthworks">Infrastructure & Earthworks</option>
                    <option value="Architectural & Interior Fitout">Architectural & Interior Fitout</option>
                    <option value="EPC Power Systems">EPC Power Systems</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tender Project Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Harbor Bridge Deck Rehabilitation Phase II"
                  required
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Client / Contracting Authority
                  </label>
                  <input
                    type="text"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Dept of Transportation"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Estimated Bid Value ($)
                  </label>
                  <input
                    type="number"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="e.g. 1500000"
                    required
                    min="1"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Margin %
                  </label>
                  <input
                    type="number"
                    value={formMargin}
                    onChange={(e) => setFormMargin(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Win Prob %
                  </label>
                  <input
                    type="number"
                    value={formWinProb}
                    onChange={(e) => setFormWinProb(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Scope Overview
                </label>
                <textarea
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  rows={3}
                  placeholder="Key specifications, milestones, or tender notes..."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewBidModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
