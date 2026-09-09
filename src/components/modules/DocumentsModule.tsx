import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  ShieldCheck,
  Building,
  Calendar,
  Lock,
  FileCheck
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { VaultDocument } from '../../types';

export const DocumentsModule: React.FC = () => {
  const {
    filteredDocuments,
    activeBusiness,
    addVaultDocument
  } = useBusiness();

  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultDocument['category']>('LEGAL');
  const [fileType, setFileType] = useState('PDF');
  const [notes, setNotes] = useState('');

  const filtered = filteredDocuments.filter((doc) => {
    const s = (search || '').toLowerCase();
    const docTitle = (doc.title || '').toLowerCase();
    const docCategory = (doc.category || '').toLowerCase();
    return docTitle.includes(s) || docCategory.includes(s);
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addVaultDocument({
      businessId: activeBusiness?.id || 'biz_apex',
      isPersonal: false,
      title,
      category,
      fileType,
      size: '1.4 MB'
    });

    setTitle('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Corporate Records</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Legal & Document Vault</h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure repository for Articles of Organization, Operating Agreements, NDAs, Deeds, and Tax filings.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Records */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search legal documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} Secure Documents Vaulted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-850 border border-slate-750 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate" title={doc.title}>
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-emerald-400">{doc.category}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Vaulted {doc.uploadDate}</span>
                </div>
                <button
                  onClick={() => alert(`Downloading verified document: ${doc.title}`)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Secure Document Vault Deposit
            </h3>
            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Services Agreement v2.1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Classification</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LEGAL">Legal Corporate</option>
                    <option value="CONTRACT">Client Contract</option>
                    <option value="TAX">Tax Filing</option>
                    <option value="DEED">Property Deed</option>
                    <option value="BOARD_RESOLUTION">Board Resolution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">File Format</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word Document</option>
                    <option value="XLSX">Spreadsheet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Document File</label>
                <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center text-slate-400 hover:border-emerald-500/50 cursor-pointer">
                  <FileCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px]">Click or drag file to deposit into vault</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Deposit to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
