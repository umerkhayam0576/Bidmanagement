import React, { useState } from 'react';
import {
  Settings,
  Building,
  User,
  Shield,
  Key,
  Globe,
  Database,
  Save,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { CurrencyCode } from '../../types';

export const SettingsModule: React.FC = () => {
  const {
    activeBusiness,
    activeBusinessId,
    updateBusiness,
    currentUser,
    userProfiles,
    switchUser,
    businesses,
    formatCurrency
  } = useBusiness();

  const isConsolidated = activeBusinessId === 'CONSOLIDATED';
  const targetBiz = isConsolidated ? businesses[0] : activeBusiness;

  // Local form state for business
  const [bizName, setBizName] = useState(targetBiz?.name || '');
  const [industry, setIndustry] = useState(targetBiz?.industry || '');
  const [taxId, setTaxId] = useState(targetBiz?.taxId || '');
  const [currency, setCurrency] = useState<CurrencyCode>(targetBiz?.currency || 'USD');
  const [valuation, setValuation] = useState(targetBiz?.valuation.toString() || '0');
  const [equity, setEquity] = useState(targetBiz?.ownerEquityPercentage.toString() || '100');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBiz) return;
    updateBusiness(targetBiz.id, {
      name: bizName,
      industry,
      taxId,
      currency,
      valuation: parseFloat(valuation) || targetBiz.valuation,
      ownerEquityPercentage: parseFloat(equity) || targetBiz.ownerEquityPercentage
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const rbacMatrix = [
    { module: 'Executive Overview & Command', owner: true, exec: true, fin: true, audit: true },
    { module: 'Personal Wealth & Net Worth', owner: true, exec: false, fin: false, audit: false },
    { module: 'Partners & Cap Table Equity', owner: true, exec: true, fin: true, audit: false },
    { module: 'Sales CRM & Deals Pipeline', owner: true, exec: true, fin: false, audit: false },
    { module: 'Invoicing & Client Billing', owner: true, exec: true, fin: true, audit: true },
    { module: 'HR, Salaries & Payroll Runs', owner: true, exec: false, fin: true, audit: false },
    { module: 'P&L Statements & Financials', owner: true, exec: true, fin: true, audit: true },
    { module: 'Audit Logs & Governance', owner: true, exec: true, fin: true, audit: true },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration & Security</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">System Settings & RBAC</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage entity legal structures, operating currencies, multi-persona access roles, and security policies.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3.5 py-2 rounded-xl font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Entity Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Entity Legal Settings: {targetBiz?.name}</span>
          </div>

          <form onSubmit={handleSaveBusiness} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Company Registered Legal Name</label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Tax / EIN ID</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Operating Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (AED)</option>
                  <option value="SAR">SAR (SAR)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Enterprise Valuation</label>
                <input
                  type="number"
                  value={valuation}
                  onChange={(e) => setValuation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Owner Equity %</label>
                <input
                  type="number"
                  value={equity}
                  onChange={(e) => setEquity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Entity Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* User Identity & Persona Switching */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Active Persona & Authorization Role</span>
          </div>

          <p className="text-xs text-slate-400">
            Switch between authenticated executive profiles to experience multi-tenant permissions and governance isolation:
          </p>

          <div className="space-y-2">
            {userProfiles.map((profile) => {
              const isSelected = profile.id === currentUser.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => switchUser(profile.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{profile.name}</div>
                      <div className="text-[11px] text-slate-400">{profile.title}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {profile.globalRole}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Granular Role-Based Access Control (RBAC) Enforcement</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">SOC 2 Compliant Model</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Module / Capability</th>
                <th className="py-2.5 px-3 text-center">Super Owner</th>
                <th className="py-2.5 px-3 text-center">Executive</th>
                <th className="py-2.5 px-3 text-center">Finance Lead</th>
                <th className="py-2.5 px-3 text-center">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {rbacMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-medium text-white">{row.module}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.owner ? (
                      <span className="text-emerald-400 font-bold">FULL ACCESS</span>
                    ) : (
                      <span className="text-slate-600">LOCKED</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.exec ? (
                      <span className="text-emerald-400 font-bold">AUTHORIZED</span>
                    ) : (
                      <span className="text-slate-600">RESTRICTED</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.fin ? (
                      <span className="text-emerald-400 font-bold">AUTHORIZED</span>
                    ) : (
                      <span className="text-slate-600">RESTRICTED</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.audit ? (
                      <span className="text-indigo-400 font-bold">READ ONLY</span>
                    ) : (
                      <span className="text-slate-600">RESTRICTED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
