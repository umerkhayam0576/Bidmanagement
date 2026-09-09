import React, { useState } from 'react';
import { UserPlus, Building, Briefcase, Mail, DollarSign, CreditCard, X, CheckCircle2 } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Department, PayFrequency } from '../../types';

interface RegisterEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBusinessId?: string;
}

export const RegisterEmployeeModal: React.FC<RegisterEmployeeModalProps> = ({
  isOpen,
  onClose,
  defaultBusinessId
}) => {
  const { businesses, activeBusinessId, registerEmployee } = useBusiness();

  const initialBizId =
    defaultBusinessId ||
    (activeBusinessId !== 'CONSOLIDATED' ? activeBusinessId : businesses[0]?.id || 'biz_apex');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Department>('ENGINEERING');
  const [businessId, setBusinessId] = useState(initialBizId);
  const [salary, setSalary] = useState('120000');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('MONTHLY');
  const [bankAccount, setBankAccount] = useState('US-CHASE-847291');
  const [switchImmediately, setSwitchImmediately] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !role) return;

    registerEmployee(
      {
        businessId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
        department,
        salary: Number(salary) || 90000,
        payFrequency,
        hireDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        bankAccount: bankAccount.trim() || 'US-DEFAULT-000000'
      },
      switchImmediately
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('');
    }, 1200);
  };

  const departments: Department[] = [
    'ENGINEERING',
    'PRODUCT',
    'DESIGN',
    'SALES',
    'MARKETING',
    'OPERATIONS',
    'FINANCE',
    'LEGAL',
    'CUSTOMER_SUCCESS',
    'HR'
  ];

  return (
    <div
      id="register-employee-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="register-employee-modal-card"
        className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl p-6 my-8 text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-register-employee-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">Employee Successfully Registered!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {switchImmediately
                ? 'Switching interface to the new Employee Portal view...'
                : 'Employee profile created and added to the company workforce directory.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Register Employee</h3>
                <p className="text-xs text-muted-foreground">
                  Enroll a team member. When switched to an employee, the interface seamlessly reconfigures as an Employee Portal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">First Name *</label>
                <input
                  id="reg-emp-first-name"
                  type="text"
                  required
                  placeholder="e.g. Liam"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Last Name *</label>
                <input
                  id="reg-emp-last-name"
                  type="text"
                  required
                  placeholder="e.g. Andersson"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Work Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    id="reg-emp-email"
                    type="email"
                    required
                    placeholder="liam@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Job Title / Role *</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    id="reg-emp-role"
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Company / Entity *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <select
                    id="reg-emp-business"
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  >
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Department</label>
                <select
                  id="reg-emp-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Annual Compensation</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    id="reg-emp-salary"
                    type="number"
                    min="10000"
                    step="5000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Pay Frequency</label>
                <select
                  id="reg-emp-pay-freq"
                  value={payFrequency}
                  onChange={(e) => setPayFrequency(e.target.value as PayFrequency)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="BI_WEEKLY">Bi-Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Direct Deposit Account</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    id="reg-emp-bank-account"
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 cursor-pointer">
                <input
                  id="reg-emp-switch-immediately"
                  type="checkbox"
                  checked={switchImmediately}
                  onChange={(e) => setSwitchImmediately(e.target.checked)}
                  className="mt-0.5 rounded text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <span className="font-medium text-foreground block">
                    Switch to Employee Interface immediately
                  </span>
                  <span className="text-muted-foreground">
                    Instantly load the Refay Employee Portal with this person's dashboard, assigned tasks, compensation slips, and PTO requests.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="submit-register-employee-btn"
                type="submit"
                className="px-5 py-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Register & Configure Interface
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
