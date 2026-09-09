import React, { useState } from 'react';
import {
  Users2,
  Plus,
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  Calendar,
  Award,
  Search
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Employee, PayrollRun } from '../../types';

export const HrPayrollModule: React.FC = () => {
  const {
    filteredEmployees,
    filteredPayrollRuns,
    activeBusiness,
    formatCurrency,
    addEmployee,
    triggerPayrollRun
  } = useBusiness();

  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'payroll'>('employees');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showRunPayrollModal, setShowRunPayrollModal] = useState(false);
  const [search, setSearch] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('ENGINEERING');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');

  // Payroll form
  const [payrollPeriod, setPayrollPeriod] = useState('April 2025');

  const filtered = filteredEmployees.filter((e) => {
    const s = (search || '').toLowerCase();
    const fullName = `${e.firstName || ''} ${e.lastName || ''}`.trim().toLowerCase();
    const empRole = (e.role || '').toLowerCase();
    const empDept = (e.department || '').toLowerCase();
    const empEmail = (e.email || '').toLowerCase();
    return fullName.includes(s) || empRole.includes(s) || empDept.includes(s) || empEmail.includes(s);
  });

  const totalMonthlyPayroll = filteredEmployees.reduce((sum, e) => sum + (e.salary || 0) / 12, 0);
  const totalAnnualPayroll = filteredEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !salary) return;
    const parts = name.trim().split(' ');
    const firstName = parts[0] || 'Staff';
    const lastName = parts.slice(1).join(' ') || '';

    addEmployee({
      businessId: activeBusiness?.id || 'biz_apex',
      firstName,
      lastName,
      role: role.trim(),
      department,
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase() || 'team'}@company.io`,
      salary: parseFloat(salary) || 0,
      payFrequency: 'MONTHLY',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      bankAccount: `US-CHECKING-****${Math.floor(1000 + Math.random() * 9000)}`
    });

    setName('');
    setRole('');
    setSalary('');
    setEmail('');
    setShowAddEmpModal(false);
  };

  const handleExecutePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    triggerPayrollRun(payrollPeriod);
    setShowRunPayrollModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Users2 className="w-4 h-4" />
            <span>Human Capital & Compensation</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">HR & Payroll Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain organizational headcount, compensation plans, monthly payroll execution, and leave entitlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRunPayrollModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Execute Payroll Run</span>
          </button>
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Headcount</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {filteredEmployees.length} Members
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all operational departments</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Monthly Compensation Run-Rate</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(totalMonthlyPayroll)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Salary obligation per monthly cycle</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Annualized Payroll Expense</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(totalAnnualPayroll)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct employment cost projection</div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSubTab('employees')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'employees'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Staff Directory ({filteredEmployees.length})
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'payroll'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Payroll Disbursement History ({filteredPayrollRuns.length})
          </button>
        </div>

        {/* Staff Table */}
        {activeSubTab === 'employees' && (
          <div className="space-y-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, role or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Employee Name</th>
                    <th className="py-3 px-3">Department & Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Hire Date</th>
                    <th className="py-3 px-3 text-right">Annual Salary</th>
                    <th className="py-3 px-3 text-right">Monthly Remittance</th>
                    <th className="py-3 px-3 text-right">Account / Disbursement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filtered.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-sm">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{emp.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-white font-medium">{emp.role}</div>
                        <div className="text-[10px] text-slate-400">{emp.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">{emp.hireDate}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(emp.salary)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(emp.salary / 12)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {emp.bankAccount || 'Direct Deposit'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payroll History Table */}
        {activeSubTab === 'payroll' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Pay Period</th>
                  <th className="py-3 px-3">Payment Date</th>
                  <th className="py-3 px-3 text-right">Headcount Paid</th>
                  <th className="py-3 px-3 text-right">Gross Amount</th>
                  <th className="py-3 px-3 text-right">Tax Withheld</th>
                  <th className="py-3 px-3 text-right">Net Disbursed</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredPayrollRuns.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{pr.period}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{pr.runDate}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {pr.employeeCount} staff
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {formatCurrency(pr.totalGross)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-400">
                      -{formatCurrency(pr.taxWithheld)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(pr.totalNet)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                        {pr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Onboard Employee */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Onboard Staff Member
            </h3>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Foster"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Employee['department'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ENGINEERING">Engineering</option>
                    <option value="EXECUTIVE">Executive</option>
                    <option value="SALES">Sales</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="OPERATIONS">Operations</option>
                    <option value="FINANCE">Finance</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Annual Compensation ({activeBusiness?.currency || 'USD'})</label>
                  <input
                    type="number"
                    required
                    placeholder="120000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="rachel@company.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Execute Payroll Run */}
      {showRunPayrollModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Execute Monthly Payroll Disbursement
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Disburse monthly compensation for {filteredEmployees.length} staff members.
            </p>
            <form onSubmit={handleExecutePayroll} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pay Cycle Period</label>
                <input
                  type="text"
                  required
                  value={payrollPeriod}
                  onChange={(e) => setPayrollPeriod(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Remittance:</span>
                  <span className="text-white font-bold">{formatCurrency(totalMonthlyPayroll)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Tax Withholdings (18%):</span>
                  <span className="text-rose-400">-{formatCurrency(totalMonthlyPayroll * 0.18)}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-700">
                  <span>Net Treasury Debit:</span>
                  <span className="text-emerald-400 font-bold">
                    {formatCurrency(totalMonthlyPayroll * 0.82)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRunPayrollModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Authorize Batch Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
