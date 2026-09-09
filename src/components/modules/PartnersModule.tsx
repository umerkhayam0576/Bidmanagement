import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  Users2,
  DollarSign,
  ShieldCheck,
  Plus,
  ArrowDownRight,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Partner } from '../../types';

export const PartnersModule: React.FC = () => {
  const {
    filteredPartners,
    activeBusiness,
    formatCurrency,
    addPartner,
    recordPartnerPayout
  } = useBusiness();

  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [selectedPartnerForPayout, setSelectedPartnerForPayout] = useState<Partner | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [equity, setEquity] = useState('');
  const [capital, setCapital] = useState('');
  const [shares, setShares] = useState('');
  const [voting, setVoting] = useState(true);

  // Payout states
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');

  const totalEquity = filteredPartners.reduce((sum, p) => sum + p.equityPercentage, 0);
  const totalCapital = filteredPartners.reduce((sum, p) => sum + p.capitalContributed, 0);
  const totalPendingDistributions = filteredPartners.reduce((sum, p) => sum + p.distributionDue, 0);

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !equity) return;
    addPartner({
      businessId: activeBusiness?.id || 'biz_apex',
      name,
      email,
      role: role || 'Shareholder',
      equityPercentage: parseFloat(equity) || 0,
      sharesCount: parseInt(shares) || 100000,
      capitalContributed: parseFloat(capital) || 0,
      profitSharePercentage: parseFloat(equity) || 0,
      votingRights: voting,
      distributionDue: 0,
      status: 'ACTIVE'
    });
    setName('');
    setEmail('');
    setRole('');
    setEquity('');
    setCapital('');
    setShares('');
    setShowAddPartnerModal(false);
  };

  const handleRecordPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerForPayout || !payoutAmount) return;
    recordPartnerPayout(selectedPartnerForPayout.id, parseFloat(payoutAmount) || 0, payoutNote || 'Quarterly Dividend Distribution');
    setSelectedPartnerForPayout(null);
    setPayoutAmount('');
    setPayoutNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <PieIcon className="w-4 h-4" />
            <span>Cap Table & Shareholder Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">
            Partners & Ownership Structure
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Equity breakdown, capital contributions, voting rights, and profit share distribution pools.
          </p>
        </div>

        <button
          onClick={() => setShowAddPartnerModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner / Shareholder</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Allocated Equity</div>
          <div className="text-2xl font-black text-white font-mono mt-2">{totalEquity}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {100 - totalEquity > 0 ? `${100 - totalEquity}% Unallocated / Treasury` : '100% Fully Distributed'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Paid-In Capital Contributions</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(totalCapital)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total invested shareholder capital</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Accrued Distributions Due</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2">
            {formatCurrency(totalPendingDistributions)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pending quarterly dividend payouts</div>
        </div>
      </div>

      {/* Cap Table Visual Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
          <span>Equity Distribution Bar</span>
          <span className="font-mono text-slate-400">{filteredPartners.length} Stakeholders</span>
        </div>
        <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-800 p-0.5 gap-0.5">
          {filteredPartners.map((p, idx) => {
            const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-amber-500'];
            const colorClass = colors[idx % colors.length];
            return (
              <div
                key={p.id}
                className={`${colorClass} h-full rounded transition-all group relative`}
                style={{ width: `${p.equityPercentage}%` }}
                title={`${p.name}: ${p.equityPercentage}%`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 pt-1 text-xs">
          {filteredPartners.map((p, idx) => {
            const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-amber-500'];
            const colorClass = colors[idx % colors.length];
            return (
              <div key={p.id} className="flex items-center gap-1.5 text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                <span className="font-semibold">{p.name}</span>
                <span className="text-slate-400 font-mono">({p.equityPercentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stakeholders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Shareholders & Ownership Details
          </h2>
          <span className="text-xs text-slate-400">Target Business: {activeBusiness?.name || 'All Holdings'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Partner / Entity</th>
                <th className="py-3 px-3">Role & Title</th>
                <th className="py-3 px-3 text-right">Equity %</th>
                <th className="py-3 px-3 text-right">Shares</th>
                <th className="py-3 px-3 text-right">Capital Invested</th>
                <th className="py-3 px-3 text-right">Voting Rights</th>
                <th className="py-3 px-3 text-right">Distribution Pool</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{partner.name}</div>
                    <div className="text-[10px] text-slate-400">{partner.email}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{partner.role}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                    {partner.equityPercentage}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {partner.sharesCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-200">
                    {formatCurrency(partner.capitalContributed)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {partner.votingRights ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                        Voting
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        Non-Voting
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-400 font-bold">
                    {formatCurrency(partner.distributionDue)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedPartnerForPayout(partner)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-700 transition-colors"
                    >
                      Pay Dividend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add Partner */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Add Stakeholder / Partner
            </h3>
            <form onSubmit={handleAddPartner} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Partner Full Name / Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova, Apex Syndicate LLC"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Corporate Title / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Co-Founder, Angel Investor"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Equity %</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="15"
                    value={equity}
                    onChange={(e) => setEquity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Shares Count</label>
                  <input
                    type="number"
                    placeholder="150000"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Capital Invested</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="votingCheck"
                  checked={voting}
                  onChange={(e) => setVoting(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="votingCheck" className="text-slate-300 text-xs">
                  Grant Voting Rights on Board Decisions
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Save to Cap Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Pay Dividend */}
      {selectedPartnerForPayout && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Record Partner Dividend Payout
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Issuing distribution remittance to <span className="text-emerald-400 font-bold">{selectedPartnerForPayout.name}</span> ({selectedPartnerForPayout.equityPercentage}% equity).
            </p>
            <form onSubmit={handleRecordPayout} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Dividend Amount ({activeBusiness?.currency || 'USD'})</label>
                <input
                  type="number"
                  required
                  placeholder={selectedPartnerForPayout.distributionDue.toString()}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Memo / Reference Note</label>
                <input
                  type="text"
                  placeholder="e.g. Q1 2025 Retained Earnings Payout"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedPartnerForPayout(null)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Confirm Remittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
