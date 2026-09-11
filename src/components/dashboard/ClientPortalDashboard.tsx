import React, { useState } from 'react';
import {
  Building2,
  Receipt,
  FolderKanban,
  FileCheck,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Download,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const ClientPortalDashboard: React.FC = () => {
  const {
    currentUser,
    currentClient,
    activeBusiness,
    filteredProjects,
    filteredInvoices,
    filteredQuotations,
    updateInvoiceStatus,
    formatCurrency,
    deliverables,
    updateDeliverableStatus,
    rfis,
    submitRfi,
    setActiveTab,
    switchUser,
    userProfiles
  } = useBusiness();

  // Active client details (fallback to client data or sensible defaults)
  const clientCompany = currentClient?.company || 'Client Organization';
  const clientName = currentUser.name || currentClient?.name || 'Client Representative';
  const clientEmail = currentUser.email || currentClient?.email || 'client@example.com';

  // State
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'invoices' | 'submittals' | 'rfis'>('overview');
  const [payModalInvoiceId, setPayModalInvoiceId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [rfiModalOpen, setRfiModalOpen] = useState(false);
  const [rfiTitle, setRfiTitle] = useState('');
  const [rfiQuestion, setRfiQuestion] = useState('');
  const [rfiPriority, setRfiPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');
  const [rfiSubmittedMsg, setRfiSubmittedMsg] = useState(false);

  // Client-scoped data
  // Projects matching client id or company name
  const clientProjects = filteredProjects.filter(
    (p) =>
      p.clientId === currentClient?.id ||
      p.client.toLowerCase().includes(clientCompany.toLowerCase()) ||
      p.client.toLowerCase().includes(clientName.toLowerCase())
  );
  // Fallback to active projects if none specifically matched mock client id
  const displayProjects = clientProjects.length > 0 ? clientProjects : filteredProjects.slice(0, 2);

  // Invoices for this client
  const clientInvoices = filteredInvoices.filter(
    (inv) =>
      inv.clientId === currentClient?.id ||
      inv.clientName.toLowerCase().includes(clientCompany.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(clientName.toLowerCase())
  );
  const displayInvoices = clientInvoices.length > 0 ? clientInvoices : filteredInvoices.slice(0, 3);

  // Quotations for this client
  const clientQuotes = filteredQuotations.filter(
    (q) =>
      q.clientId === currentClient?.id ||
      q.clientName.toLowerCase().includes(clientCompany.toLowerCase())
  );

  // Deliverables related to client projects or active business
  const displayDeliverables = deliverables.slice(0, 4);

  // Outstanding calculations
  const totalBilled = displayInvoices.reduce((acc, inv) => acc + inv.total, 0);
  const outstandingAmount = displayInvoices
    .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((acc, inv) => acc + inv.total, 0);
  const paidAmount = displayInvoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + inv.total, 0);

  // Handle simulated payment
  const handleSimulatePayment = (invoiceId: string) => {
    setIsPaying(true);
    setTimeout(() => {
      updateInvoiceStatus(invoiceId, 'PAID');
      setIsPaying(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setPayModalInvoiceId(null);
      }, 1500);
    }, 800);
  };

  // Handle client submit RFI
  const handleClientSubmitRfi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfiTitle.trim() || !rfiQuestion.trim()) return;

    submitRfi({
      title: rfiTitle.trim(),
      project: displayProjects[0]?.name || 'General Contract Scope',
      category: 'ENGINEERING',
      priority: rfiPriority,
      assignedEngineer: 'Alexandre Dubois',
      daysOpen: 0,
      specRef: 'Client Request Spec',
      submittedDate: new Date().toISOString().split('T')[0],
      question: rfiQuestion.trim()
    });

    setRfiTitle('');
    setRfiQuestion('');
    setRfiSubmittedMsg(true);
    setTimeout(() => {
      setRfiSubmittedMsg(false);
      setRfiModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Portal Notice & Switcher Helper */}
      <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                CLIENT PORTAL
              </span>
              <span className="text-sm font-bold text-white">{clientCompany}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure client workspace for contracts, submittals, billing statements, and technical inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 hidden sm:inline">Signed in as:</span>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <img
              src={currentUser.avatar}
              alt={clientName}
              className="w-5 h-5 rounded-full object-cover border border-blue-400"
            />
            <span className="text-xs font-semibold text-slate-200">{clientName}</span>
          </div>
        </div>
      </div>

      {/* Hero Welcome Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              <span>Account Hub</span>
              <span>•</span>
              <span className="text-slate-400">{activeBusiness?.name || 'Service Provider'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {clientName.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Track your contracted milestones in real-time, approve engineering submittals, review itemized billing statements, and submit direct technical requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="client-raise-rfi-btn"
              onClick={() => setRfiModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Raise Technical Query (RFI)</span>
            </button>
            <button
              id="client-view-statement-btn"
              onClick={() => setActiveView('invoices')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Statements & Invoices</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'overview', label: 'Client Overview', icon: Building2 },
            { id: 'projects', label: `Projects (${displayProjects.length})`, icon: FolderKanban },
            { id: 'invoices', label: `Invoices & Billing (${displayInvoices.length})`, icon: Receipt },
            { id: 'submittals', label: `Submittals & Approvals (${displayDeliverables.length})`, icon: FileCheck },
            { id: 'rfis', label: 'Technical Queries', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {displayProjects.length}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>All contracts on schedule</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {formatCurrency(outstandingAmount)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>{formatCurrency(paidAmount)} settled to date</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Submittals for Review</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white font-mono">
              {displayDeliverables.filter((d) => d.status !== 'APPROVED').length}
            </div>
            <div className="text-[11px] text-indigo-400 flex items-center gap-1 mt-0.5">
              <span>Drawing & spec packages</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Engineering Contact</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-white truncate">Alexandre Dubois</div>
            <div className="text-[11px] text-slate-400 truncate">Principal Cloud Architect</div>
          </div>
        </div>
      </div>

      {/* Main Content Area based on activeView */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Contracted Projects Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-400" />
                <span>Contracted Scope & Projects</span>
              </h2>
              <button
                onClick={() => setActiveView('projects')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>View Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {project.code || 'PRJ'}
                        </span>
                        <h3 className="text-sm font-bold text-white">{project.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {project.description || 'Enterprise contract delivery & infrastructure implementation.'}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                        project.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Milestone Completion</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones list preview */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {project.milestones.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2 text-slate-300 bg-slate-850/60 p-2 rounded-lg"
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submittals Awaiting Review */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                  <span>Submittals Requiring Client Sign-Off</span>
                </h2>
                <button
                  onClick={() => setActiveView('submittals')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View All ({deliverables.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {displayDeliverables.slice(0, 3).map((del) => (
                  <div
                    key={del.id}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {del.code}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{del.title}</h4>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>Rev: {del.revision}</span>
                        <span>•</span>
                        <span>Due: {del.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {del.status === 'APPROVED' ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => updateDeliverableStatus(del.id, 'APPROVED')}
                          className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          Approve Package
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Billing & Account Support */}
          <div className="space-y-6">
            {/* Outstanding Statement Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Recent Billing Statement</span>
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                  USD
                </span>
              </div>

              <div className="space-y-2.5">
                {displayInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{inv.invoiceNumber}</span>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : inv.status === 'OVERDUE'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Due: {inv.dueDate}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-mono">
                        {formatCurrency(inv.total)}
                      </div>
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => setPayModalInvoiceId(inv.id)}
                          className="text-[10px] font-bold text-blue-400 hover:text-blue-300 mt-0.5 underline"
                        >
                          Pay Online
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveView('invoices')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 text-center transition-colors"
              >
                View Complete Invoice Ledger
              </button>
            </div>

            {/* Direct Engineering Support / PM Contact Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt="Account Lead"
                  className="w-12 h-12 rounded-xl object-cover border border-blue-400"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    Assigned Account Lead
                  </span>
                  <h4 className="text-sm font-bold text-white">Alexandre Dubois</h4>
                  <p className="text-xs text-slate-400">Principal Cloud Architect</p>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-850 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                "Hello {clientName.split(' ')[0]}, your project deployment is tracking on schedule for the upcoming production release. Feel free to submit an RFI if you require any drawing or API clarifications."
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRfiModalOpen(true)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                  title="Open Chat Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View: Projects Detailed */}
      {activeView === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Contracted Projects & Deliverables</h2>
            <span className="text-xs text-slate-400">{displayProjects.length} active engagements</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {displayProjects.map((p) => (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {p.code || 'PRJ'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{p.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      {p.status}
                    </span>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      Timeline: {p.startDate} — {p.endDate}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Total Completion</span>
                    <span className="font-mono font-bold text-emerald-400">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Breakdown */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Milestone Schedule
                  </h4>
                  <div className="space-y-2">
                    {p.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="font-semibold text-slate-200">{m.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 font-mono">
                          <span>Target: {m.dueDate}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.completed
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {m.completed ? 'Delivered' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Invoices Detailed */}
      {activeView === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Client Statements & Invoices</h2>
            <div className="text-xs text-slate-400">
              Total Outstanding: <span className="font-mono text-amber-400 font-bold">{formatCurrency(outstandingAmount)}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Issue Date</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {displayInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                      <td className="p-4 text-slate-400">{inv.issueDate}</td>
                      <td className="p-4 text-slate-400">{inv.dueDate}</td>
                      <td className="p-4 font-mono font-bold text-white">
                        {formatCurrency(inv.total)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : inv.status === 'OVERDUE'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {inv.status !== 'PAID' ? (
                          <button
                            onClick={() => setPayModalInvoiceId(inv.id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Pay Online
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-xs font-semibold">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View: Submittals Detailed */}
      {activeView === 'submittals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Submittals & Drawing Packages</h2>
              <p className="text-xs text-slate-400">Review and authorize technical submittals.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliverables.map((del) => (
              <div key={del.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {del.code}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{del.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Spec Section: {del.specSection || 'N/A'} • Rev: {del.revision}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      del.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {del.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                  {del.notes || 'Engineering package submitted for formal client approval.'}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  {del.status === 'APPROVED' ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approved by Client</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => updateDeliverableStatus(del.id, 'REVISE_RESUBMIT')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      >
                        Request Changes
                      </button>
                      <button
                        onClick={() => updateDeliverableStatus(del.id, 'APPROVED')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
                      >
                        Approve Submittal
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: RFIs Detailed */}
      {activeView === 'rfis' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Technical Queries & RFIs</h2>
              <p className="text-xs text-slate-400">Formal engineering clarifications and questions.</p>
            </div>
            <button
              onClick={() => setRfiModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Raise Query</span>
            </button>
          </div>

          <div className="space-y-3">
            {rfis.slice(0, 5).map((rfi) => (
              <div key={rfi.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      RFI-{rfi.id}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">{rfi.title}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">Project: {rfi.project}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      rfi.response
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {rfi.response ? 'Answered' : 'Under Review'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <div className="font-semibold text-slate-400 text-[10px] uppercase mb-1">Question</div>
                  {rfi.question}
                </div>

                {rfi.response && (
                  <div className="text-xs text-emerald-300 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
                    <div className="font-semibold text-emerald-400 text-[10px] uppercase mb-1">
                      Engineer Clarification ({rfi.assignedEngineer})
                    </div>
                    {rfi.response}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay Invoice Simulator Modal */}
      {payModalInvoiceId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span>Simulate Online Payment</span>
              </h3>
              <button
                onClick={() => setPayModalInvoiceId(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Pay invoice immediately via connected client corporate card or ACH transfer.
            </p>

            {paymentSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="font-bold text-sm">Payment Successful!</div>
                <p className="text-xs text-slate-400">The invoice status has been updated to PAID.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-400">Invoice: #{payModalInvoiceId}</div>
                  <div className="text-slate-400">Billed Entity: {clientCompany}</div>
                  <div className="text-white font-bold font-mono text-sm pt-1">
                    Total Due: {formatCurrency(displayInvoices.find((i) => i.id === payModalInvoiceId)?.total || 0)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPayModalInvoiceId(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSimulatePayment(payModalInvoiceId)}
                    disabled={isPaying}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
                  >
                    {isPaying ? 'Authorizing...' : 'Confirm & Pay'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raise RFI Modal */}
      {rfiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <span>Submit Technical Query / Clarification</span>
              </h3>
              <button
                onClick={() => setRfiModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {rfiSubmittedMsg ? (
              <div className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="font-bold text-sm">Query Submitted to Engineering Team!</div>
                <p className="text-xs text-slate-400">Assigned lead Alexandre Dubois will review and provide a formal response.</p>
              </div>
            ) : (
              <form onSubmit={handleClientSubmitRfi} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject / Query Title</label>
                  <input
                    type="text"
                    required
                    value={rfiTitle}
                    onChange={(e) => setRfiTitle(e.target.value)}
                    placeholder="e.g., Cold storage sync API rate limit & latency target"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={rfiPriority}
                    onChange={(e) => setRfiPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="NORMAL">Normal Delivery</option>
                    <option value="URGENT">Urgent (Blocks Production Release)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Detailed Technical Query</label>
                  <textarea
                    required
                    rows={4}
                    value={rfiQuestion}
                    onChange={(e) => setRfiQuestion(e.target.value)}
                    placeholder="Provide specific drawing reference, spec query, or technical question..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRfiModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                  >
                    Submit Query
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
