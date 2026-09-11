import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  FileText,
  Building,
  User,
  MessageSquare,
  Sparkles,
  Paperclip,
  Check,
  Tag
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { RFI, RfiStatus } from '../../types';

const STATUS_CONFIG: Record<
  RfiStatus,
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  DRAFT: { label: 'Draft', color: 'text-neutral-700 dark:text-neutral-300', bg: 'bg-neutral-100 dark:bg-neutral-800', icon: Clock },
  OPEN: { label: 'Open (Awaiting)', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', icon: Clock },
  SUBMITTED: { label: 'Submitted', color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: Clock },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', icon: Clock },
  RESPONDED: { label: 'Responded', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', icon: CheckCircle2 },
  RESOLVED: { label: 'Resolved', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: CheckCircle2 },
  CLOSED: { label: 'Closed & Resolved', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: CheckCircle2 }
};

const PRIORITY_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  URGENT: { label: 'Urgent', bg: 'bg-rose-100 dark:bg-rose-950/50', text: 'text-rose-700 dark:text-rose-400' },
  HIGH: { label: 'High', bg: 'bg-amber-100 dark:bg-amber-950/50', text: 'text-amber-700 dark:text-amber-400' },
  MEDIUM: { label: 'Medium', bg: 'bg-blue-100 dark:bg-blue-950/50', text: 'text-blue-700 dark:text-blue-400' },
  LOW: { label: 'Low', bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-600 dark:text-neutral-400' }
};

export const RfisModule: React.FC = () => {
  const { rfis, addRfi, updateRfiStatus, responses, filteredProjects, currentUser } = useBusiness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedRfi, setSelectedRfi] = useState<RFI | null>(null);
  const [isNewRfiModalOpen, setIsNewRfiModalOpen] = useState(false);

  // New RFI Form
  const [formNumber, setFormNumber] = useState(`RFI-2024-0${rfis.length + 90}`);
  const [formProjectId, setFormProjectId] = useState(filteredProjects[0]?.id || 'p1');
  const [formSubject, setFormSubject] = useState('');
  const [formDiscipline, setFormDiscipline] = useState('Structural');
  const [formPriority, setFormPriority] = useState<'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [formDrawingRef, setFormDrawingRef] = useState('');
  const [formSpecSection, setFormSpecSection] = useState('');
  const [formRecipient, setFormRecipient] = useState('Structural Consultant / AECOM');
  const [formDueDate, setFormDueDate] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [formRecommendation, setFormRecommendation] = useState('');
  const [formScheduleImpact, setFormScheduleImpact] = useState(false);
  const [formCostImpact, setFormCostImpact] = useState(false);

  const disciplines = useMemo(() => {
    const set = new Set<string>();
    rfis.forEach((r) => set.add(r.discipline));
    return ['ALL', ...Array.from(set)];
  }, [rfis]);

  const filteredRfis = useMemo(() => {
    return rfis.filter((r) => {
      const matchesSearch =
        r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.drawingReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.specSection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
      const matchesDiscipline = selectedDiscipline === 'ALL' || r.discipline === selectedDiscipline;
      const matchesPriority = selectedPriority === 'ALL' || r.priority === selectedPriority;
      return matchesSearch && matchesStatus && matchesDiscipline && matchesPriority;
    });
  }, [rfis, searchQuery, selectedStatus, selectedDiscipline, selectedPriority]);

  // Metrics
  const metrics = useMemo(() => {
    const total = rfis.length;
    const openCount = rfis.filter((r) => r.status === 'OPEN' || r.status === 'UNDER_REVIEW').length;
    const urgentCount = rfis.filter((r) => r.priority === 'URGENT' && r.status !== 'CLOSED').length;
    const closedCount = rfis.filter((r) => r.status === 'CLOSED').length;
    return { total, openCount, urgentCount, closedCount };
  }, [rfis]);

  const handleSubmitRfi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject || !formQuestion) return;

    addRfi({
      number: formNumber,
      projectId: formProjectId,
      subject: formSubject,
      discipline: formDiscipline,
      status: 'OPEN',
      priority: formPriority,
      drawingReference: formDrawingRef || undefined,
      specSection: formSpecSection || undefined,
      author: currentUser.name,
      recipient: formRecipient,
      dueDate: formDueDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      question: formQuestion,
      suggestedSolution: formRecommendation || undefined,
      scheduleImpactDays: formScheduleImpact ? 3 : 0,
      costImpact: formCostImpact ? 5000 : 0
    });

    setIsNewRfiModalOpen(false);
    setFormSubject('');
    setFormQuestion('');
    setFormRecommendation('');
    setFormDrawingRef('');
    setFormSpecSection('');
  };

  return (
    <div id="rfis-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Requests for Information (RFIs)
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Technical clarifications, engineering queries, drawing conflicts, and consultant resolutions
          </p>
        </div>

        <button
          id="create-new-rfi-btn"
          onClick={() => setIsNewRfiModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Technical RFI</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total RFIs
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2 block">
            {metrics.total}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Logged in system</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Pending Clarification
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 block">
            {metrics.openCount}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Awaiting consultant response</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Urgent Critical
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2 block">
            {metrics.urgentCount}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Impacts active jobsite work</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Resolved & Closed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 block">
            {metrics.closedCount}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Completed inquiries</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="rfi-search-input"
            type="text"
            placeholder="Search RFI #, subject, drawing, spec..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            id="rfi-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            {Object.keys(STATUS_CONFIG).map((st) => (
              <option key={st} value={st}>
                {STATUS_CONFIG[st as RfiStatus].label}
              </option>
            ))}
          </select>

          <select
            id="rfi-discipline-filter"
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
            id="rfi-priority-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* RFI Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">RFI #</th>
                <th className="py-3 px-4">Subject & Drawing Reference</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Impacts</th>
                <th className="py-3 px-4 text-center">Responses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredRfis.map((rfi) => {
                const statusInfo = STATUS_CONFIG[rfi.status];
                const priorityInfo = PRIORITY_BADGES[rfi.priority] || PRIORITY_BADGES.MEDIUM;
                const hasImpact = (rfi.scheduleImpactDays || 0) > 0 || (rfi.costImpact || 0) > 0;

                return (
                  <tr
                    key={rfi.id}
                    id={`rfi-row-${rfi.id}`}
                    onClick={() => setSelectedRfi(rfi)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-xs text-blue-600 dark:text-blue-400">
                      {rfi.number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {rfi.subject}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                        {rfi.drawingReference && <span>Dwg: {rfi.drawingReference}</span>}
                        {rfi.specSection && <span>• Spec: {rfi.specSection}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                        {rfi.discipline}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityInfo.bg} ${priorityInfo.text}`}>
                        {priorityInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-600 dark:text-neutral-300 max-w-[150px] truncate">
                      {rfi.recipient}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-500 font-mono">
                      {rfi.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {hasImpact ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" />
                          {rfi.scheduleImpactDays ? `+${rfi.scheduleImpactDays}d` : '$' + rfi.costImpact}
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-neutral-500 font-medium">
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                        {rfi.responseCount || 0}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredRfis.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    No RFIs match your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFI Detail Modal */}
      {selectedRfi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {selectedRfi.number}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      STATUS_CONFIG[selectedRfi.status].bg
                    } ${STATUS_CONFIG[selectedRfi.status].color}`}
                  >
                    {STATUS_CONFIG[selectedRfi.status].label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {selectedRfi.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRfi(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Discipline</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedRfi.discipline}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Priority</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedRfi.priority}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Recipient</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block">
                    {selectedRfi.recipient}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Due Date</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedRfi.dueDate}</span>
                </div>
              </div>

              {/* References */}
              {(selectedRfi.drawingReference || selectedRfi.specSection) && (
                <div className="flex items-center gap-3 text-xs bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-300">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {selectedRfi.drawingReference && <span>Drawing Ref: <strong>{selectedRfi.drawingReference}</strong></span>}
                  {selectedRfi.specSection && <span>Specification Section: <strong>{selectedRfi.specSection}</strong></span>}
                </div>
              )}

              {/* Technical Question */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Technical Clarification / Inquired Condition
                </span>
                <div className="text-sm text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 whitespace-pre-line leading-relaxed">
                  {selectedRfi.question}
                </div>
              </div>

              {/* Suggested Solution */}
              {selectedRfi.suggestedSolution && (
                <div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    Contractor Proposed Solution
                  </span>
                  <div className="text-sm text-neutral-800 dark:text-neutral-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900 leading-relaxed">
                    {selectedRfi.suggestedSolution}
                  </div>
                </div>
              )}

              {/* Impact analysis */}
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Estimated Schedule Impact</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedRfi.scheduleImpactDays ? `+${selectedRfi.scheduleImpactDays} Calendar Days` : 'None / On Track'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">Estimated Cost Impact</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedRfi.costImpact ? `$${selectedRfi.costImpact.toLocaleString()} Direct Cost` : 'None (Included in Spec)'}
                  </span>
                </div>
              </div>

              {/* Status Updater */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Change Workflow Status
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['DRAFT', 'OPEN', 'UNDER_REVIEW', 'RESPONDED', 'CLOSED'] as RfiStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateRfiStatus(selectedRfi.id, st);
                        setSelectedRfi({ ...selectedRfi, status: st });
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                        selectedRfi.status === st
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedRfi(null)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New RFI Modal */}
      {isNewRfiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Draft Technical RFI
              </h3>
              <button
                onClick={() => setIsNewRfiModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRfi} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    RFI Number
                  </label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Discipline
                  </label>
                  <select
                    value={formDiscipline}
                    onChange={(e) => setFormDiscipline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
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

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject / Short Title
                </label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Anchor bolt clash with heavy shear rebar at Grid B-4"
                  required
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Drawing Reference
                  </label>
                  <input
                    type="text"
                    value={formDrawingRef}
                    onChange={(e) => setFormDrawingRef(e.target.value)}
                    placeholder="e.g. S-301, Detail 4"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Spec Section
                  </label>
                  <input
                    type="text"
                    value={formSpecSection}
                    onChange={(e) => setFormSpecSection(e.target.value)}
                    placeholder="e.g. 03 30 00 Cast-in-Place Concrete"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Recipient Consultant / Engineer
                  </label>
                  <input
                    type="text"
                    value={formRecipient}
                    onChange={(e) => setFormRecipient(e.target.value)}
                    placeholder="e.g. ARUP Structural Team"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="URGENT">Urgent (Immediate work stoppage)</option>
                    <option value="HIGH">High (Within 3 days)</option>
                    <option value="MEDIUM">Medium (Standard 7-day turn)</option>
                    <option value="LOW">Low (Clarification for next phase)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Technical Question / Discrepancy Description
                </label>
                <textarea
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the discrepancy, clash, or missing design detail clearly..."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Contractor's Suggested Solution (Optional)
                </label>
                <textarea
                  value={formRecommendation}
                  onChange={(e) => setFormRecommendation(e.target.value)}
                  rows={2}
                  placeholder="Proposed field remedy or engineering adjustment..."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formScheduleImpact}
                    onChange={(e) => setFormScheduleImpact(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Anticipates Schedule Delay
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formCostImpact}
                    onChange={(e) => setFormCostImpact(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Anticipates Cost Impact
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewRfiModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Submit RFI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
