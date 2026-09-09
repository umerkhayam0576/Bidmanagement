import React, { useState } from 'react';
import {
  Building,
  Plus,
  Search,
  Mail,
  Phone,
  DollarSign,
  FolderKanban,
  FileText
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const ClientsModule: React.FC = () => {
  const {
    filteredClients,
    activeBusiness,
    formatCurrency,
    addClient,
    setActiveTab
  } = useBusiness();

  const [search, setSearch] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filtered = filteredClients.filter((c) => {
    const s = (search || '').toLowerCase();
    const clientName = (c.name || '').toLowerCase();
    const clientCompany = (c.company || '').toLowerCase();
    const clientEmail = (c.email || '').toLowerCase();
    return clientName.includes(s) || clientCompany.includes(s) || clientEmail.includes(s);
  });

  const totalBilledAll = filteredClients.reduce((sum, c) => sum + c.totalBilled, 0);
  const totalReceivables = filteredClients.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;
    addClient({
      businessId: activeBusiness?.id || 'biz_apex',
      name,
      company,
      email,
      phone,
      address,
      status: 'ACTIVE'
    });
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setAddress('');
    setShowAddClientModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Building className="w-4 h-4" />
            <span>Corporate Account Directory</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Clients & Key Accounts</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain client records, lifetime gross billing volumes, outstanding receivables, and active projects.
          </p>
        </div>

        <button
          onClick={() => setShowAddClientModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Account</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Active Clients</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {filteredClients.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Accounts with contract history</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Lifetime Gross Billed</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(totalBilledAll)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total revenue collected & invoiced</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Outstanding Receivables</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2">
            {formatCurrency(totalReceivables)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pending payments due from clients</div>
        </div>
      </div>

      {/* Client List & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company or contact name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filtered.length} of {filteredClients.length} clients
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Company & Contact</th>
                <th className="py-3 px-3">Email & Phone</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Lifetime Billed</th>
                <th className="py-3 px-3 text-right">Outstanding Due</th>
                <th className="py-3 px-3 text-right">Projects</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white text-sm">{client.company}</div>
                    <div className="text-[11px] text-slate-400">{client.name}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        client.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {formatCurrency(client.totalBilled)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    {client.outstandingBalance > 0 ? (
                      <span className="text-rose-400">{formatCurrency(client.outstandingBalance)}</span>
                    ) : (
                      <span className="text-slate-400">Clear</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {client.projectsCount}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setActiveTab('billing')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-700 transition-colors"
                    >
                      Bill Client
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add Client */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Register New Client Account
            </h3>
            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Logistics Global"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Primary Representative Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Montgomery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Billing Email</label>
                  <input
                    type="email"
                    required
                    placeholder="accounts@nexuslog.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Physical / Corporate Billing Address</label>
                <input
                  type="text"
                  placeholder="100 Wall St, 22nd Fl, New York, NY"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
