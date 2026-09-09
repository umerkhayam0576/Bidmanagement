import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  FileCheck,
  CheckCircle,
  Clock,
  Printer,
  X,
  Building,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Invoice, Quotation, InvoiceItem } from '../../types';

export const BillingModule: React.FC = () => {
  const {
    filteredInvoices,
    filteredQuotations,
    filteredClients,
    activeBusiness,
    formatCurrency,
    addInvoice,
    updateInvoiceStatus,
    addQuotation,
    convertQuotationToInvoice
  } = useBusiness();

  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'quotations'>('invoices');
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);

  // Form states for new Invoice
  const [invClientId, setInvClientId] = useState('');
  const [invDueDate, setInvDueDate] = useState('');
  const [invItems, setInvItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [invNotes, setInvNotes] = useState('');

  // Form states for new Quote
  const [qteClientId, setQteClientId] = useState('');
  const [qteExpiryDate, setQteExpiryDate] = useState('');
  const [qteItems, setQteItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [qteNotes, setQteNotes] = useState('');

  // Line item handlers
  const updateInvItem = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: any) => {
    const updated = [...invItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? parseFloat(value) || 0 : updated[index].quantity;
      const p = field === 'unitPrice' ? parseFloat(value) || 0 : updated[index].unitPrice;
      updated[index].amount = q * p;
    }
    setInvItems(updated);
  };

  const addInvItemRow = () => {
    setInvItems([...invItems, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = filteredClients.find((c) => c.id === invClientId);
    if (!client) return;

    const subtotal = invItems.reduce((sum, item) => sum + item.amount, 0);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addInvoice({
      invoiceNumber,
      businessId: activeBusiness?.id || 'biz_apex',
      clientId: client.id,
      clientName: client.company,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: invItems.map((item, idx) => ({ ...item, id: `ii_${Date.now()}_${idx}` })),
      subtotal,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: subtotal,
      status: 'SENT',
      notes: invNotes
    });

    setInvItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    setInvNotes('');
    setShowAddInvoiceModal(false);
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const client = filteredClients.find((c) => c.id === qteClientId);
    if (!client) return;

    const subtotal = qteItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const quoteNumber = `QTE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    addQuotation({
      quoteNumber,
      businessId: activeBusiness?.id || 'biz_apex',
      clientId: client.id,
      clientName: client.company,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: qteExpiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: qteItems.map((item, idx) => ({ ...item, amount: item.quantity * item.unitPrice, id: `qi_${Date.now()}_${idx}` })),
      subtotal,
      taxRate: 0,
      total: subtotal,
      status: 'SENT',
      notes: qteNotes
    });

    setQteItems([{ description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
    setQteNotes('');
    setShowAddQuoteModal(false);
  };

  const totalPaid = filteredInvoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);
  const totalPending = filteredInvoices.filter((i) => i.status === 'SENT').reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = filteredInvoices.filter((i) => i.status === 'OVERDUE').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Receipt className="w-4 h-4" />
            <span>Billing & Accounts Receivable</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Quotations & Invoicing</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal estimates, convert quotes to invoices, track payment terms, and preview receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddQuoteModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Quotation</span>
          </button>
          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Collected Payments</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {formatCurrency(totalPaid)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Invoices settled in full</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Outstanding (Net 30)</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(totalPending)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting client payment remittance</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Overdue Receivables</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-2">
            {formatCurrency(totalOverdue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires active credit control escalation</div>
        </div>
      </div>

      {/* Tab Switcher: Invoices vs Quotations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'invoices'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Invoices Ledger ({filteredInvoices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('quotations')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'quotations'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Proposals & Quotations ({filteredQuotations.length})
          </button>
        </div>

        {/* Invoices Table */}
        {activeSubTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Client Account</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-white">{inv.clientName}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{inv.issueDate}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{inv.dueDate}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white text-sm">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : inv.status === 'OVERDUE'
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceForPreview(inv)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] font-semibold border border-slate-700"
                        >
                          Preview
                        </button>
                        {inv.status !== 'PAID' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'PAID')}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/30"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quotations Table */}
        {activeSubTab === 'quotations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Quote #</th>
                  <th className="py-3 px-3">Client Account</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3">Valid Until</th>
                  <th className="py-3 px-3 text-right">Estimated Total</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredQuotations.map((qte) => (
                  <tr key={qte.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">{qte.quoteNumber}</td>
                    <td className="py-3 px-3 font-semibold text-white">{qte.clientName}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{qte.issueDate}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{qte.expiryDate}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(qte.total)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          qte.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : qte.status === 'CONVERTED'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {qte.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {qte.status !== 'CONVERTED' ? (
                        <button
                          onClick={() => convertQuotationToInvoice(qte.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <span>Convert to Invoice</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Invoiced</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Invoice Print / PDF Preview */}
      {selectedInvoiceForPreview && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Commercial Invoice Document Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-semibold"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPreview(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Clean Printed Paper Layout */}
            <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl space-y-6 shadow-inner">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {activeBusiness?.name || 'Apex Cloud Technologies Inc.'}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">{activeBusiness?.address}</p>
                  <p className="text-xs text-slate-600 font-mono">Tax ID: {activeBusiness?.taxId}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 font-mono">INVOICE</div>
                  <div className="text-xs font-bold text-slate-700 font-mono mt-0.5">
                    {selectedInvoiceForPreview.invoiceNumber}
                  </div>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase font-mono border border-slate-300">
                    Status: {selectedInvoiceForPreview.status}
                  </div>
                </div>
              </div>

              {/* Billed To & Dates */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Billed To:</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedInvoiceForPreview.clientName}
                  </div>
                  <div className="text-slate-600 mt-0.5">Payment Terms: Net 30 Days</div>
                </div>
                <div className="text-right space-y-1">
                  <div>
                    <span className="text-slate-500">Issue Date:</span>{' '}
                    <span className="font-mono font-semibold">{selectedInvoiceForPreview.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Due Date:</span>{' '}
                    <span className="font-mono font-semibold">{selectedInvoiceForPreview.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoiceForPreview.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {formatCurrency(item.unitPrice, activeBusiness?.currency)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(item.amount, activeBusiness?.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(selectedInvoiceForPreview.subtotal, activeBusiness?.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (0%):</span>
                    <span className="font-mono">$0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-300">
                    <span>Total Due:</span>
                    <span className="font-mono">
                      {formatCurrency(selectedInvoiceForPreview.total, activeBusiness?.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remittance Details */}
              <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700">Wire Remittance Instructions:</span> Please remit payment via wire/ACH to account on record referencing invoice number.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Invoice */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Create Commercial Invoice
            </h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Client Account</label>
                  <select
                    required
                    value={invClientId}
                    onChange={(e) => setInvClientId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a Client</option>
                    {filteredClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-semibold">
                  <span>Line Items</span>
                  <button
                    type="button"
                    onClick={addInvItemRow}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold"
                  >
                    + Add Item
                  </button>
                </div>

                {invItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      required
                      placeholder="Service or Product description"
                      value={item.description}
                      onChange={(e) => updateInvItem(idx, 'description', e.target.value)}
                      className="col-span-6 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvItem(idx, 'quantity', e.target.value)}
                      className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-center font-mono"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Rate"
                      value={item.unitPrice}
                      onChange={(e) => updateInvItem(idx, 'unitPrice', e.target.value)}
                      className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                    />
                    <div className="col-span-2 text-right font-mono font-bold text-white">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Invoice Notes / Bank Terms</label>
                <textarea
                  rows={2}
                  placeholder="Wire transfer instructions, milestone sign-off terms..."
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Quotation */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Generate Proposal Quotation
            </h3>
            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Prospect / Client</label>
                  <select
                    required
                    value={qteClientId}
                    onChange={(e) => setQteClientId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a Client</option>
                    {filteredClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quote Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={qteExpiryDate}
                    onChange={(e) => setQteExpiryDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <div className="text-slate-400 font-semibold">Scope Deliverables</div>
                {qteItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      required
                      placeholder="Scope item"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...qteItems];
                        updated[idx].description = e.target.value;
                        setQteItems(updated);
                      }}
                      className="col-span-8 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Fee"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const updated = [...qteItems];
                        updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                        setQteItems(updated);
                      }}
                      className="col-span-4 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddQuoteModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Create Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
