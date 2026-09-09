import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Building,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Expense } from '../../types';

export const FinanceModule: React.FC = () => {
  const {
    filteredExpenses,
    filteredInvoices,
    activeBusiness,
    formatCurrency,
    addExpense
  } = useBusiness();

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Form states
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Expense['category']>('SOFTWARE');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Commercial Corporate Card');

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalRevenue = filteredInvoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const netCashFlow = totalRevenue - totalExpenses;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !vendor) return;
    addExpense({
      businessId: activeBusiness?.id || 'biz_apex',
      category,
      title: description,
      amount: parseFloat(amount) || 0,
      vendor,
      date: new Date().toISOString().split('T')[0],
      paidBy: paymentMethod,
      taxDeductible: true,
      status: 'APPROVED'
    });

    setDescription('');
    setAmount('');
    setVendor('');
    setShowAddExpenseModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Wallet className="w-4 h-4" />
            <span>Treasury & Commercial Spend</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Finance & Expenses</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cash flow monitoring, vendor procurement, operational disbursements, and corporate accounts.
          </p>
        </div>

        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Liquid Treasury Balance</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(activeBusiness?.cashBalance || 0)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Available in operating accounts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Outgoing Expenses (Period)</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-2">
            -{formatCurrency(totalExpenses)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {filteredExpenses.length} vendor disbursements
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Net Operating Flow (Inflows vs Outflows)</div>
          <div
            className={`text-2xl font-black font-mono mt-2 ${
              netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {netCashFlow >= 0 ? '+' : ''}
            {formatCurrency(netCashFlow)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Net profit margin surplus</div>
        </div>
      </div>

      {/* Operating Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Operational Expenses Ledger
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredExpenses.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Description & Vendor</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-400">{exp.date}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{exp.title || (exp as any).description}</div>
                    <div className="text-[11px] text-slate-400">{exp.vendor}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[10px]">
                      {(exp.category || '').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{exp.paidBy || (exp as any).paymentMethod}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">
                    -{formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Record Expense */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Record Operational Expense
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Multi-Region GPU Cluster"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amount ({activeBusiness?.currency || 'USD'})</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CLOUD_HOSTING">Cloud & Hosting</option>
                    <option value="SOFTWARE_SUBSCRIPTION">Software Subscriptions</option>
                    <option value="OFFICE_RENT">Office Rent</option>
                    <option value="PAYROLL">Payroll Remittance</option>
                    <option value="LEGAL">Legal & Regulatory</option>
                    <option value="MARKETING">Marketing & Growth</option>
                    <option value="HARDWARE">Hardware & Equipment</option>
                    <option value="OTHER">Other Operational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
