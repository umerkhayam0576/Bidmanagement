import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  DollarSign,
  UserCheck,
  CheckCircle,
  Building,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Lead, LeadStage } from '../../types';

export const CrmModule: React.FC = () => {
  const {
    filteredLeads,
    activeBusiness,
    formatCurrency,
    addLead,
    updateLeadStage,
    convertLeadToClient
  } = useBusiness();

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [value, setValue] = useState('');
  const [probability, setProbability] = useState('50');
  const [stage, setStage] = useState<LeadStage>('LEAD_IN');
  const [expectedClose, setExpectedClose] = useState('');
  const [notes, setNotes] = useState('');

  const stages: { key: LeadStage; label: string; color: string }[] = [
    { key: 'LEAD_IN', label: 'Lead In', color: 'border-slate-700 bg-slate-800/40 text-slate-300' },
    { key: 'DISCOVERY', label: 'Discovery', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
    { key: 'PROPOSAL', label: 'Proposal Sent', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
    { key: 'NEGOTIATION', label: 'Negotiation', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
    { key: 'WON', label: 'Closed Won', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
    { key: 'LOST', label: 'Closed Lost', color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' }
  ];

  const totalPipeline = filteredLeads
    .filter((l) => l.stage !== 'WON' && l.stage !== 'LOST')
    .reduce((sum, l) => sum + l.value, 0);

  const weightedPipeline = filteredLeads
    .filter((l) => l.stage !== 'WON' && l.stage !== 'LOST')
    .reduce((sum, l) => sum + (l.value * l.probability) / 100, 0);

  const wonDealsValue = filteredLeads
    .filter((l) => l.stage === 'WON')
    .reduce((sum, l) => sum + l.value, 0);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !value) return;
    addLead({
      businessId: activeBusiness?.id || 'biz_apex',
      title,
      company,
      contactName,
      email,
      phone,
      stage,
      value: parseFloat(value) || 0,
      probability: parseInt(probability) || 50,
      assignedTo: 'Omar Refay',
      expectedClose: expectedClose || '2025-05-30',
      notes
    });
    setTitle('');
    setCompany('');
    setContactName('');
    setEmail('');
    setPhone('');
    setValue('');
    setNotes('');
    setShowAddLeadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>Revenue Pipeline & Commercial Deals</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Sales & CRM Engine</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track prospective contracts, deal probability metrics, and client conversion stages.
          </p>
        </div>

        <button
          onClick={() => setShowAddLeadModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity / Deal</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Active Pipeline Value</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(totalPipeline)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {filteredLeads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST').length} active negotiations
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Weighted Forecast (Probability Adjusted)</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(weightedPipeline)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Real-time risk-weighted projection</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Closed Won Contracts</div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-2">
            {formatCurrency(wonDealsValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Converted to active client accounts</div>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 min-h-[500px]">
        {stages.map((stg) => {
          const leadsInStage = filteredLeads.filter((l) => l.stage === stg.key);
          const stageTotal = leadsInStage.reduce((sum, l) => sum + l.value, 0);

          return (
            <div
              key={stg.key}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${stg.color}`}>
                    {stg.label}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                    {leadsInStage.length}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate-400 py-1.5">
                  Total: <span className="text-slate-200 font-bold">{formatCurrency(stageTotal)}</span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 mt-2">
                  {leadsInStage.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg p-3 space-y-2 shadow-sm transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">{lead.title}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                        <span className="text-[10px] text-slate-400">{lead.probability}% Prob</span>
                      </div>

                      {lead.notes && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-2">{lead.notes}</p>
                      )}

                      {/* Controls to shift stages */}
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1">
                        <select
                          value={lead.stage}
                          onChange={(e) => updateLeadStage(lead.id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 rounded text-[9px] text-slate-300 py-0.5 px-1 focus:outline-none"
                        >
                          {stages.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        {lead.stage !== 'WON' && (
                          <button
                            onClick={() => convertLeadToClient(lead.id)}
                            title="Convert Deal to Active Client"
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 p-1 rounded text-[9px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Convert</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {leadsInStage.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-slate-400 border border-dashed border-slate-800 rounded-lg">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Add Lead */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Add Commercial Opportunity
            </h3>
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Infrastructure Revamp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Client Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Health"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Primary Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Johnathan Davis"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Deal Value ({activeBusiness?.currency || 'USD'})</label>
                  <input
                    type="number"
                    required
                    placeholder="75000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Win Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={probability}
                    onChange={(e) => setProbability(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {stages.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Expected Close Date</label>
                  <input
                    type="date"
                    value={expectedClose}
                    onChange={(e) => setExpectedClose(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Deal Notes / Context</label>
                <textarea
                  rows={2}
                  placeholder="Key stakeholder expectations, scope notes, timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
