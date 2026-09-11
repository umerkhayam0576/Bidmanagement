import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  TrendingUp,
  Building,
  Home,
  Briefcase,
  Coins,
  ShieldCheck,
  CreditCard,
  DollarSign,
  PieChart as PieIcon,
  Calendar,
  Layers
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { PersonalAsset, PersonalLiability, PersonalIncomeDraw } from '../../types';

export const PersonalFinanceModule: React.FC = () => {
  const {
    personalAssets,
    personalLiabilities,
    personalIncomeDraws,
    businesses,
    formatCurrency,
    calculateNetWorth,
    addPersonalAsset,
    addPersonalLiability,
    addPersonalIncomeDraw
  } = useBusiness();

  const netWorthData = calculateNetWorth();

  // Modals
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddLiabilityModal, setShowAddLiabilityModal] = useState(false);
  const [showAddDrawModal, setShowAddDrawModal] = useState(false);

  // Form states
  const [assetTitle, setAssetTitle] = useState('');
  const [assetCategory, setAssetCategory] = useState<PersonalAsset['category']>('REAL_ESTATE');
  const [assetValuation, setAssetValuation] = useState('');
  const [assetInstitution, setAssetInstitution] = useState('');
  const [assetNotes, setAssetNotes] = useState('');

  const [liabTitle, setLiabTitle] = useState('');
  const [liabCategory, setLiabCategory] = useState<PersonalLiability['category']>('MORTGAGE');
  const [liabBalance, setLiabBalance] = useState('');
  const [liabMonthly, setLiabMonthly] = useState('');
  const [liabRate, setLiabRate] = useState('');
  const [liabLender, setLiabLender] = useState('');

  const [drawSource, setDrawSource] = useState('');
  const [drawAmount, setDrawAmount] = useState('');
  const [drawType, setDrawType] = useState<PersonalIncomeDraw['type']>('DIVIDEND');

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle || !assetValuation) return;
    addPersonalAsset({
      title: assetTitle,
      category: assetCategory,
      valuation: parseFloat(assetValuation) || 0,
      institution: assetInstitution,
      notes: assetNotes
    });
    setAssetTitle('');
    setAssetValuation('');
    setAssetInstitution('');
    setAssetNotes('');
    setShowAddAssetModal(false);
  };

  const handleCreateLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liabTitle || !liabBalance) return;
    addPersonalLiability({
      title: liabTitle,
      category: liabCategory,
      remainingBalance: parseFloat(liabBalance) || 0,
      monthlyPayment: parseFloat(liabMonthly) || 0,
      interestRate: parseFloat(liabRate) || 0,
      lender: liabLender
    });
    setLiabTitle('');
    setLiabBalance('');
    setLiabMonthly('');
    setLiabRate('');
    setLiabLender('');
    setShowAddLiabilityModal(false);
  };

  const handleCreateDraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawSource || !drawAmount) return;
    addPersonalIncomeDraw({
      source: drawSource,
      amount: parseFloat(drawAmount) || 0,
      type: drawType,
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED'
    });
    setDrawSource('');
    setDrawAmount('');
    setShowAddDrawModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Philosophy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Landmark className="w-4 h-4" />
            <span>Manage Everything You Own</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Personal Wealth Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            A comprehensive, consolidated balance sheet linking your personal holdings (properties, portfolios, liquidity) with real-time equity stakes across all your commercial businesses.
          </p>
        </div>

        {/* Global Net Worth Stat Box */}
        <div className="bg-slate-850 border border-slate-750 p-4 rounded-xl text-right shrink-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Consolidated Net Worth
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(netWorthData.netWorth, 'USD')}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-2">
            <span>Assets: {formatCurrency(netWorthData.totalAssets, 'USD')}</span>
            <span>•</span>
            <span className="text-rose-400">
              Liabilities: -{formatCurrency(netWorthData.totalLiabilities, 'USD')}
            </span>
          </div>
        </div>
      </div>

      {/* Asset Pillars Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Business Equity Holdings</span>
            <Building className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(netWorthData.totalBusinessEquityValue, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Calculated across Apex, Kensington & Nordic
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Direct Personal Assets</span>
            <Home className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(netWorthData.totalPersonalAssets, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Real estate, equities, cash, crypto & luxury assets
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Personal Debt & Mortgages</span>
            <CreditCard className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-2">
            -{formatCurrency(netWorthData.totalLiabilities, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {personalLiabilities.length} active mortgages & credit notes
          </div>
        </div>
      </div>

      {/* SECTION 1: Business Equity Stakes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Commercial Entity Equity Value
            </h2>
            <p className="text-xs text-slate-400">
              Your direct capital worth derived from company valuations and cap table allocations
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {businesses.length} Active Businesses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {businesses.map((biz) => {
            const equityVal = (biz.valuation * biz.ownerEquityPercentage) / 100;
            return (
              <div
                key={biz.id}
                className="bg-slate-800/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={biz.logo}
                      alt={biz.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{biz.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{biz.industry}</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Valuation:</span>
                      <span className="text-slate-200 font-mono">
                        {formatCurrency(biz.valuation, biz.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Your Equity:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {biz.ownerEquityPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Stake Value</div>
                  <div className="text-lg font-black text-white font-mono">
                    {formatCurrency(equityVal, biz.currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Personal Assets & Liabilities Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Assets List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Personal Assets Portfolio
              </h2>
              <p className="text-xs text-slate-400">Directly titled personal property & funds</p>
            </div>
            <button
              onClick={() => setShowAddAssetModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Asset</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {personalAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{asset.title}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-emerald-400">{(asset.category || '').replace('_', ' ')}</span>
                    {asset.institution && <span>• {asset.institution}</span>}
                  </div>
                  {asset.notes && <div className="text-[10px] text-slate-400 mt-1 italic">{asset.notes}</div>}
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white font-mono">
                    {formatCurrency(asset.valuation, 'USD')}
                  </div>
                  <div className="text-[9px] text-slate-400">Updated {asset.lastUpdated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Liabilities List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Personal Liabilities & Debt
              </h2>
              <p className="text-xs text-slate-400">Mortgages, private notes and payment schedules</p>
            </div>
            <button
              onClick={() => setShowAddLiabilityModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>Add Liability</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {personalLiabilities.map((liab) => (
              <div
                key={liab.id}
                className="bg-slate-800/40 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{liab.title}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-rose-400">{liab.category}</span>
                    <span>• {liab.lender}</span>
                    <span className="text-slate-300 font-mono">({liab.interestRate}% APR)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Monthly Servicing: <span className="text-slate-300 font-mono">{formatCurrency(liab.monthlyPayment, 'USD')}/mo</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-rose-400 font-mono">
                    -{formatCurrency(liab.remainingBalance, 'USD')}
                  </div>
                  <div className="text-[9px] text-slate-400">Remaining Balance</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Personal Income / Dividends Draw History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Personal Income & Dividend Draws
            </h2>
            <p className="text-xs text-slate-400">
              Distributions pulled from your companies into personal bank accounts
            </p>
          </div>
          <button
            onClick={() => setShowAddDrawModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Income Draw</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Source / Entity</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount Drawn</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {personalIncomeDraws.map((draw) => (
                <tr key={draw.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{draw.date}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{draw.source}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                      {(draw.type || '').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                    +{formatCurrency(draw.amount, 'USD')}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                      {draw.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add Personal Asset */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Add Personal Asset
            </h3>
            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Asset Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Miami Beach Condo, Vanguard S&P 500"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="STOCK_PORTFOLIO">Stock Portfolio</option>
                    <option value="CASH_BANK">Cash / Bank</option>
                    <option value="CRYPTO">Crypto Assets</option>
                    <option value="VEHICLE">Luxury Vehicle</option>
                    <option value="PRECIOUS_METALS">Precious Metals</option>
                    <option value="OTHER">Other Tangible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Valuation ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="250000"
                    value={assetValuation}
                    onChange={(e) => setAssetValuation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Custodian / Institution (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fidelity, County Deed Office, Ledger"
                  value={assetInstitution}
                  onChange={(e) => setAssetInstitution(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Personal Liability */}
      {showAddLiabilityModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Add Personal Liability
            </h3>
            <form onSubmit={handleCreateLiability} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Liability Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Residence Mortgage"
                  value={liabTitle}
                  onChange={(e) => setLiabTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={liabCategory}
                    onChange={(e) => setLiabCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="MORTGAGE">Mortgage</option>
                    <option value="AUTO_LOAN">Auto Loan</option>
                    <option value="CREDIT_LINE">Credit Line</option>
                    <option value="PRIVATE_NOTE">Private Promissory Note</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Remaining Balance ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="500000"
                    value={liabBalance}
                    onChange={(e) => setLiabBalance(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Monthly Payment ($)</label>
                  <input
                    type="number"
                    placeholder="2800"
                    value={liabMonthly}
                    onChange={(e) => setLiabMonthly(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="3.5"
                    value={liabRate}
                    onChange={(e) => setLiabRate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lender / Financial Institution</label>
                <input
                  type="text"
                  placeholder="e.g. JPMorgan Private Bank"
                  value={liabLender}
                  onChange={(e) => setLiabLender(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLiabilityModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Save Debt Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Record Income Draw */}
      {showAddDrawModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Record Personal Income / Dividend Draw
            </h3>
            <form onSubmit={handleCreateDraw} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Source / Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Cloud Q1 Dividend, Consulting Draw"
                  value={drawSource}
                  onChange={(e) => setDrawSource(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Draw Type</label>
                  <select
                    value={drawType}
                    onChange={(e) => setDrawType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DIVIDEND">Shareholder Dividend</option>
                    <option value="PROFIT_DISTRIBUTION">Profit Distribution</option>
                    <option value="SALARY">Executive Salary</option>
                    <option value="RENTAL">Rental Yield</option>
                    <option value="CAPITAL_GAIN">Capital Gain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={drawAmount}
                    onChange={(e) => setDrawAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDrawModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Record Draw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
