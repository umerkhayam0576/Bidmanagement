import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Calendar,
  User,
  X,
  FileText,
  Sliders,
  Check,
  ChevronRight,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Deliverable, DeliverableStatus, DeliverableType } from '../../types';

const STATUS_MAP: Record<
  DeliverableStatus,
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  NOT_STARTED: { label: 'Not Started', color: 'text-neutral-600 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', icon: Clock },
  REVIEW: { label: 'Internal Review', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', icon: Clock },
  INTERNAL_REVIEW: { label: 'Internal Review', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', icon: Clock },
  SUBMITTED: { label: 'Submitted to Client', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', icon: Clock },
  APPROVED: { label: 'Approved (Code 1)', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: CheckCircle2 },
  REJECTED: { label: 'Revise & Resubmit', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', icon: AlertCircle },
  REVISE_RESUBMIT: { label: 'Revise & Resubmit', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', icon: AlertCircle }
};

const TYPE_LABELS: Record<DeliverableType, string> = {
  SHOP_DRAWING: 'Shop Drawing',
  CALCULATION_REPORT: 'Calculation Report',
  METHOD_STATEMENT: 'Method Statement',
  AS_BUILT: 'As-Built Record',
  MATERIAL_SUBMITTAL: 'Material Submittal',
  INSPECTION_TEST_PLAN: 'Inspection & Test Plan'
};

export const DeliverablesModule: React.FC = () => {
  const { deliverables, addDeliverable, updateDeliverableStatus, updateDeliverableProgress, currentUser, filteredProjects } = useBusiness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Form
  const [formCode, setFormCode] = useState(`DEL-PKG-0${deliverables.length + 15}`);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<DeliverableType>('SHOP_DRAWING');
  const [formDiscipline, setFormDiscipline] = useState('Structural');
  const [formRevision, setFormRevision] = useState('Rev A');
  const [formAssignee, setFormAssignee] = useState(currentUser.name);
  const [formDueDate, setFormDueDate] = useState('');
  const [formProjectId, setFormProjectId] = useState(filteredProjects[0]?.id || 'p1');

  const filtered = useMemo(() => {
    return deliverables.filter((d) => {
      const matchesSearch =
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
      const matchesType = selectedType === 'ALL' || d.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [deliverables, searchQuery, selectedStatus, selectedType]);

  const metrics = useMemo(() => {
    const total = deliverables.length;
    const inProgress = deliverables.filter((d) => d.status === 'IN_PROGRESS' || d.status === 'REVIEW').length;
    const submitted = deliverables.filter((d) => d.status === 'SUBMITTED').length;
    const approved = deliverables.filter((d) => d.status === 'APPROVED').length;
    const avgProgress = Math.round(
      deliverables.reduce((acc, d) => acc + d.completionPercentage, 0) / Math.max(1, total)
    );
    return { total, inProgress, submitted, approved, avgProgress };
  }, [deliverables]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    addDeliverable({
      code: formCode,
      title: formTitle,
      type: formType,
      discipline: formDiscipline,
      status: 'NOT_STARTED',
      revision: formRevision,
      dueDate: formDueDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      completionPercentage: 0,
      assignee: formAssignee,
      projectId: formProjectId
    });

    setIsNewModalOpen(false);
    setFormTitle('');
  };

  return (
    <div id="deliverables-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Engineering Deliverables & Submittals
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Shop drawings, calculation packages, material test reports, and formal submittals
          </p>
        </div>

        <button
          id="create-new-deliverable-btn"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deliverable</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Packages
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2 block">
            {metrics.total}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">
            Average progress {metrics.avgProgress}%
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Drafting & Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2 block">
            {metrics.inProgress}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Active production</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Submitted for Approval
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2 block">
            {metrics.submitted}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">With client / consultant</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Approved (Code 1)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 block">
            {metrics.approved}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Ready for fabrication/site</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="deliverable-search-input"
            type="text"
            placeholder="Search submittal code, title, engineer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {Object.keys(STATUS_MAP).map((st) => (
              <option key={st} value={st}>
                {STATUS_MAP[st as DeliverableStatus].label}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Document Types</option>
            {Object.keys(TYPE_LABELS).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t as DeliverableType]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">Package Code</th>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Rev</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Lead Engineer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((del) => {
                const statusInfo = STATUS_MAP[del.status];
                return (
                  <tr
                    key={del.id}
                    id={`deliverable-row-${del.id}`}
                    onClick={() => setSelectedDeliverable(del)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                      {del.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {del.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-neutral-600 dark:text-neutral-300">
                        {TYPE_LABELS[del.type] || del.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-700 dark:text-neutral-300">
                        {del.revision}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                        {del.discipline}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {del.completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              del.completionPercentage === 100
                                ? 'bg-emerald-500'
                                : del.completionPercentage > 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${del.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-neutral-500">{del.dueDate}</td>
                    <td className="py-3.5 px-4 text-xs text-neutral-600 dark:text-neutral-400">{del.assignee}</td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    No deliverables found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deliverable Detail & Quick Status Modal */}
      {selectedDeliverable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedDeliverable.code} • {selectedDeliverable.revision}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedDeliverable.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-neutral-400 block">Deliverable Type</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {TYPE_LABELS[selectedDeliverable.type]}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Discipline</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedDeliverable.discipline}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Lead Engineer</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedDeliverable.assignee}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Submission Deadline</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedDeliverable.dueDate}
                  </span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    Production Progress: {selectedDeliverable.completionPercentage}%
                  </span>
                  <div className="flex gap-1.5">
                    {[25, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => {
                          updateDeliverableProgress(selectedDeliverable.id, val);
                          setSelectedDeliverable({ ...selectedDeliverable, completionPercentage: val });
                        }}
                        className="text-[10px] px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 hover:bg-emerald-100 hover:text-emerald-700 rounded font-medium transition-colors"
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedDeliverable.completionPercentage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateDeliverableProgress(selectedDeliverable.id, val);
                    setSelectedDeliverable({ ...selectedDeliverable, completionPercentage: val });
                  }}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Status Update */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Update Workflow Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'SUBMITTED', 'APPROVED', 'REJECTED'] as DeliverableStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateDeliverableStatus(selectedDeliverable.id, st);
                          setSelectedDeliverable({
                            ...selectedDeliverable,
                            status: st,
                            completionPercentage: st === 'APPROVED' ? 100 : selectedDeliverable.completionPercentage
                          });
                        }}
                        className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all text-center ${
                          selectedDeliverable.status === st
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                            : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {STATUS_MAP[st].label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedDeliverable(null)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Deliverable Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Add Engineering Deliverable
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Package Code
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Initial Revision
                  </label>
                  <input
                    type="text"
                    value={formRevision}
                    onChange={(e) => setFormRevision(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Primary Foundation Shop Drawings - Pier 1 to 8"
                  required
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Document Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as DeliverableType)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.keys(TYPE_LABELS).map((t) => (
                      <option key={t} value={t}>
                        {TYPE_LABELS[t as DeliverableType]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Discipline
                  </label>
                  <select
                    value={formDiscipline}
                    onChange={(e) => setFormDiscipline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Structural">Structural</option>
                    <option value="MEP & HVAC">MEP & HVAC</option>
                    <option value="Civil & Grading">Civil & Grading</option>
                    <option value="Architectural">Architectural</option>
                    <option value="Geotechnical">Geotechnical</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Lead Engineer
                  </label>
                  <input
                    type="text"
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Target Submission Date
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                >
                  Save Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
