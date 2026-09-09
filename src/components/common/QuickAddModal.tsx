import React, { useState } from 'react';
import {
  X,
  Plus,
  Receipt,
  Building,
  TrendingUp,
  Wallet,
  Landmark,
  CheckCircle2
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const QuickAddModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    activeBusiness,
    addExpense,
    addLead,
    addPersonalAsset,
    formatCurrency,
    setActiveTab
  } = useBusiness();

  const [activeType, setActiveType] = useState<'expense' | 'lead' | 'personal-asset'>('expense');

  // Expense State
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<any>('SOFTWARE');
  const [expVendor, setExpVendor] = useState('');

  // Lead State
  const [leadTitle, setLeadTitle] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [leadValue, setLeadValue] = useState('');

  // Personal Asset State
  const [assetTitle, setAssetTitle] = useState('');
  const [assetValuation, setAssetValuation] = useState('');
  const [assetCategory, setAssetCategory] = useState<any>('REAL_ESTATE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === 'expense') {
      if (!expTitle || !expAmount) return;
      addExpense({
        businessId: activeBusiness?.id || 'biz_apex',
        title: expTitle,
        amount: parseFloat(expAmount) || 0,
        category: expCategory,
        vendor: expVendor || 'Direct Vendor',
        date: new Date().toISOString().split('T')[0],
        status: 'APPROVED',
        paidBy: 'Corporate Treasury',
        taxDeductible: true
      });
      setActiveTab('finance');
    } else if (activeType === 'lead') {
      if (!leadTitle || !leadCompany) return;
      addLead({
        businessId: activeBusiness?.id || 'biz_apex',
        title: leadTitle,
        company: leadCompany,
        contactName: leadContact || 'Key Contact',
        email: 'contact@client.com',
        phone: '+1 555-0199',
        stage: 'LEAD_IN',
        value: parseFloat(leadValue) || 10000,
        probability: 30,
        assignedTo: 'Omar Refay',
        expectedClose: '2025-06-30',
        notes: 'Quick logged deal'
      });
      setActiveTab('crm');
    } else if (activeType === 'personal-asset') {
      if (!assetTitle || !assetValuation) return;
      addPersonalAsset({
        title: assetTitle,
        valuation: parseFloat(assetValuation) || 0,
        category: assetCategory,
        notes: 'Quick logged personal holding'
      });
      setActiveTab('personal-wealth');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Fast Corporate Action
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Type Tabs */}
        <div className="flex p-1 bg-slate-800 rounded-xl mb-4 gap-1 text-xs">
          <button
            onClick={() => setActiveType('expense')}
            className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'expense'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Record OpEx</span>
          </button>
          <button
            onClick={() => setActiveType('lead')}
            className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'lead'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
          <button
            onClick={() => setActiveType('personal-asset')}
            className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'personal-asset'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Personal Asset</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {activeType === 'expense' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">Expense Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Production Cluster Compute"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Amount ({activeBusiness?.currency || 'USD'})</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    placeholder="Amazon Web Services"
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cost Center Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="SOFTWARE">Software & Cloud Subscriptions</option>
                  <option value="PAYROLL">Payroll & Contractors</option>
                  <option value="RENT">Facilities & Rent</option>
                  <option value="MARKETING">Marketing & Advertising</option>
                  <option value="LEGAL">Legal & Regulatory</option>
                  <option value="COGS">COGS & Raw Inventory</option>
                  <option value="EQUIPMENT">Hardware & Capital Equipment</option>
                </select>
              </div>
            </>
          )}

          {activeType === 'lead' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Deal Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Global AI Platform Rollout"
                    value={leadTitle}
                    onChange={(e) => setLeadTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="Stripe Enterprise"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Primary Contact Name</label>
                  <input
                    type="text"
                    placeholder="Johnathan Davis"
                    value={leadContact}
                    onChange={(e) => setLeadContact(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Deal Size ($)</label>
                  <input
                    type="number"
                    placeholder="75000"
                    value={leadValue}
                    onChange={(e) => setLeadValue(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === 'personal-asset' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1">Asset Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterfront Villa, Palm Jumeirah"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Current Fair Market Value ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="3500000"
                    value={assetValuation}
                    onChange={(e) => setAssetValuation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Asset Class</label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="REAL_ESTATE">Prime Real Estate</option>
                    <option value="STOCK_PORTFOLIO">Equities & ETFs</option>
                    <option value="CRYPTO">Digital Assets & Crypto</option>
                    <option value="CASH_BANK">High-Yield Treasury & Cash</option>
                    <option value="VEHICLE">Luxury Vehicles & Marine</option>
                    <option value="PRECIOUS_METALS">Physical Gold & Metals</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-md shadow-emerald-500/20"
            >
              Confirm & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
