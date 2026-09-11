import React, { useState, useMemo } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  FileCheck,
  User,
  Calendar,
  X,
  FileText,
  Building,
  Check,
  ChevronRight,
  Reply,
  ArrowRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { ResponseRecord } from '../../types';

const DISPOSITION_CONFIG: Record<
  string,
  { label: string; code: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  APPROVED: { label: 'Approved as Submitted', code: 'Code 1', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: CheckCircle2 },
  APPROVED_AS_NOTED: { label: 'Approved as Noted', code: 'Code 2', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', icon: CheckCircle2 },
  REVISE_RESUBMIT: { label: 'Revise & Resubmit', code: 'Code 3', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', icon: AlertTriangle },
  REJECTED: { label: 'Rejected', code: 'Code 4', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', icon: AlertCircle },
  INFORMATION_ONLY: { label: 'Information Only', code: 'Info', color: 'text-neutral-700 dark:text-neutral-300', bg: 'bg-neutral-100 dark:bg-neutral-800', icon: Clock }
};

export const ResponsesModule: React.FC = () => {
  const { responses, addResponse, updateResponseActionStatus, rfis, currentUser } = useBusiness();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState<string>('ALL');
  const [selectedActionStatus, setSelectedActionStatus] = useState<string>('ALL');
  const [selectedResponse, setSelectedResponse] = useState<ResponseRecord | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Response Form
  const [formRefCode, setFormRefCode] = useState('RFI-2024-089');
  const [formResponder, setFormResponder] = useState('');
  const [formResponderRole, setFormResponderRole] = useState('Structural Engineer of Record');
  const [formDisposition, setFormDisposition] = useState<any>('APPROVED_AS_NOTED');
  const [formComments, setFormComments] = useState('');
  const [formActionRequired, setFormActionRequired] = useState('');
  const [formRequiresAction, setFormRequiresAction] = useState(true);

  const filtered = useMemo(() => {
    return responses.filter((r) => {
      const matchesSearch =
        r.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.responderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comments.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.actionRequired && r.actionRequired.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDisp = selectedDisposition === 'ALL' || r.disposition === selectedDisposition;
      const matchesAction = selectedActionStatus === 'ALL' || r.actionStatus === selectedActionStatus;
      return matchesSearch && matchesDisp && matchesAction;
    });
  }, [responses, searchQuery, selectedDisposition, selectedActionStatus]);

  const metrics = useMemo(() => {
    const total = responses.length;
    const pendingAction = responses.filter((r) => r.actionStatus === 'PENDING_ACTION').length;
    const approvedCount = responses.filter(
      (r) => r.disposition === 'APPROVED' || r.disposition === 'APPROVED_AS_NOTED'
    ).length;
    const revisionCount = responses.filter((r) => r.disposition === 'REVISE_RESUBMIT').length;
    return { total, pendingAction, approvedCount, revisionCount };
  }, [responses]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRefCode || !formResponder || !formComments) return;

    addResponse({
      referenceCode: formRefCode,
      dateReceived: new Date().toISOString().split('T')[0],
      responderName: formResponder,
      responderRole: formResponderRole,
      disposition: formDisposition,
      comments: formComments,
      actionRequired: formRequiresAction ? formActionRequired || 'Incorporate comments into field drawings' : undefined,
      actionStatus: formRequiresAction ? 'PENDING_ACTION' : 'RESOLVED'
    });

    setIsNewModalOpen(false);
    setFormResponder('');
    setFormComments('');
    setFormActionRequired('');
  };

  return (
    <div id="responses-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
            <Reply className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            Consultant & Client Responses
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Formal reviews, approval dispositions, architect comments, and engineering action items
          </p>
        </div>

        <button
          id="create-new-response-btn"
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Incoming Response</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Responses
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2 block">
            {metrics.total}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Registered in log</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Pending Actions
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 block">
            {metrics.pendingAction}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Requires action on drawings/site</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Approved Submittals
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 block">
            {metrics.approvedCount}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Code 1 & Code 2</span>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Revisions Required
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2 block">
            {metrics.revisionCount}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">Code 3 resubmissions</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="response-search-input"
            type="text"
            placeholder="Search reference code, engineer, action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedDisposition}
            onChange={(e) => setSelectedDisposition(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Dispositions</option>
            {Object.keys(DISPOSITION_CONFIG).map((d) => (
              <option key={d} value={d}>
                {DISPOSITION_CONFIG[d].code} - {DISPOSITION_CONFIG[d].label}
              </option>
            ))}
          </select>

          <select
            value={selectedActionStatus}
            onChange={(e) => setSelectedActionStatus(e.target.value)}
            className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Action States</option>
            <option value="PENDING_ACTION">Pending Action</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved / Closed</option>
          </select>
        </div>
      </div>

      {/* Responses List */}
      <div className="space-y-3">
        {filtered.map((resp) => {
          const disp = DISPOSITION_CONFIG[resp.disposition] || DISPOSITION_CONFIG.INFORMATION_ONLY;
          const DispIcon = disp.icon;

          return (
            <div
              key={resp.id}
              id={`response-item-${resp.id}`}
              onClick={() => setSelectedResponse(resp)}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${disp.bg} ${disp.color} shrink-0 mt-0.5`}>
                    <DispIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {resp.referenceCode}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${disp.bg} ${disp.color}`}>
                        {disp.code}: {disp.label}
                      </span>
                      {resp.actionStatus && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            resp.actionStatus === 'PENDING_ACTION'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : resp.actionStatus === 'IN_PROGRESS'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          {resp.actionStatus === 'PENDING_ACTION'
                            ? 'Action Required'
                            : resp.actionStatus === 'IN_PROGRESS'
                            ? 'Action In Progress'
                            : 'Resolved'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-3">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {resp.responderName}
                      </span>
                      <span>• {resp.responderRole}</span>
                      <span>• Received: {resp.dateReceived}</span>
                    </div>

                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2.5 line-clamp-2 bg-neutral-50 dark:bg-neutral-800/40 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      {resp.comments}
                    </p>

                    {resp.actionRequired && (
                      <div className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Action: {resp.actionRequired}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400">
            No responses match your search criteria.
          </div>
        )}
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {selectedResponse.referenceCode}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  Consultant Formal Review
                </h3>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-neutral-400 block">Reviewer</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedResponse.responderName}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Design Role</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedResponse.responderRole}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Disposition</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {DISPOSITION_CONFIG[selectedResponse.disposition]?.code} - {DISPOSITION_CONFIG[selectedResponse.disposition]?.label}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Date Received</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedResponse.dateReceived}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Official Consultant Comments
                </span>
                <div className="text-sm text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 whitespace-pre-line leading-relaxed">
                  {selectedResponse.comments}
                </div>
              </div>

              {selectedResponse.actionRequired && (
                <div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                    Required Action Item
                  </span>
                  <div className="text-sm text-neutral-800 dark:text-neutral-200 bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 leading-relaxed">
                    {selectedResponse.actionRequired}
                  </div>
                </div>
              )}

              {/* Action Item Status Buttons */}
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
                  Action Item Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['PENDING_ACTION', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateResponseActionStatus(selectedResponse.id, st);
                        setSelectedResponse({ ...selectedResponse, actionStatus: st });
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-center ${
                        selectedResponse.actionStatus === st
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {st === 'PENDING_ACTION' ? 'Pending' : st === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-xs font-medium text-neutral-800 dark:text-neutral-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Response Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Log Consultant Response
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
                    Referenced Item (RFI / Submittal)
                  </label>
                  <input
                    type="text"
                    value={formRefCode}
                    onChange={(e) => setFormRefCode(e.target.value)}
                    placeholder="e.g. RFI-2024-089"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Disposition
                  </label>
                  <select
                    value={formDisposition}
                    onChange={(e) => setFormDisposition(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.keys(DISPOSITION_CONFIG).map((d) => (
                      <option key={d} value={d}>
                        {DISPOSITION_CONFIG[d].code}: {DISPOSITION_CONFIG[d].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Reviewer Name
                  </label>
                  <input
                    type="text"
                    value={formResponder}
                    onChange={(e) => setFormResponder(e.target.value)}
                    placeholder="e.g. Dr. Robert Vance, PE"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Reviewer Role / Firm
                  </label>
                  <input
                    type="text"
                    value={formResponderRole}
                    onChange={(e) => setFormResponderRole(e.target.value)}
                    placeholder="e.g. Structural Consultant"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Official Review Comments
                </label>
                <textarea
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                  rows={3}
                  required
                  placeholder="Reviewer remarks, stipulations, or approval conditions..."
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={formRequiresAction}
                    onChange={(e) => setFormRequiresAction(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  Requires Follow-up Action / Field Revision
                </label>
                {formRequiresAction && (
                  <input
                    type="text"
                    value={formActionRequired}
                    onChange={(e) => setFormActionRequired(e.target.value)}
                    placeholder="Describe specific required action item..."
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                )}
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
                  className="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm"
                >
                  Record Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
