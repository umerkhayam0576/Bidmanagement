import React, { useMemo, useState } from 'react';
import { Building2, CheckCircle2, Clock3, FolderOpen, MessageSquare, FileText, Box, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { BimElement } from '../../types/portal';
import { BimElementExplorer } from './BimElementExplorer';

export const ClientPortalDashboard: React.FC = () => {
  const { filteredProjects, filteredMessages, filteredDocuments, activeBusiness, formatCurrency } = useBusiness();
  const [activeView, setActiveView] = useState<'overview' | 'model' | 'deliverables' | 'messages'>('overview');
  const [selectedElement, setSelectedElement] = useState<BimElement | null>(null);

  const project = filteredProjects[0];
  const daysLeft = project ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / 86400000)) : 0;

  const demoElements = useMemo<BimElement[]>(() => [
    { id: 'bim-b1', globalId: '3d8c-column-b1', mark: 'B1', type: 'COLUMN', name: 'Steel Column B1', level: 'Level 01', material: 'A992', profile: 'W12x65', status: 'NEW', modelVersionId: 'model-v1', properties: { Mark: 'B1', Profile: 'W12x65', Height: '14 ft', Material: 'A992', Finish: 'Shop Primer' } },
    { id: 'bim-b2', globalId: '3d8c-column-b2', mark: 'B2', type: 'COLUMN', name: 'Steel Column B2', level: 'Level 01', material: 'A992', profile: 'W12x65', status: 'APPROVED', modelVersionId: 'model-v1', properties: { Mark: 'B2', Profile: 'W12x65', Height: '14 ft', Material: 'A992', Finish: 'Shop Primer' } },
    { id: 'bim-b12', globalId: '3d8c-column-b12', mark: 'B12', type: 'COLUMN', name: 'Steel Column B12', level: 'Level 02', material: 'A992', profile: 'W14x90', status: 'REVIEW', modelVersionId: 'model-v1', properties: { Mark: 'B12', Profile: 'W14x90', Height: '12 ft', Material: 'A992', Finish: 'Shop Primer', Review: 'Connection detail required' } },
    { id: 'bim-g1', globalId: '3d8c-beam-g1', mark: 'G1', type: 'BEAM', name: 'Primary Beam G1', level: 'Level 02', material: 'A992', profile: 'W18x35', status: 'NEW', modelVersionId: 'model-v1', properties: { Mark: 'G1', Profile: 'W18x35', Length: '28 ft', Material: 'A992' } },
  ], []);

  const visibleMessages = filteredMessages.slice(0, 5);
  const projectDocs = filteredDocuments.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider"><Building2 className="w-4 h-4" /> Client Portal</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2">Project Workspace</h1>
            <p className="text-sm text-muted-foreground mt-1">Review your projects, drawings, BIM model, RFIs and deliverables from one place.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Secure project workspace · {activeBusiness?.name || 'BidXact'}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['overview', 'Overview'], ['model', '3D / IFC Model'], ['deliverables', 'Drawings & Deliverables'], ['messages', 'Messages']
        ].map(([id, label]) => <button key={id} onClick={() => setActiveView(id as typeof activeView)} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${activeView === id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}>{label}</button>)}
      </div>

      {activeView === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Metric icon={<FolderOpen className="w-4 h-4" />} label="Active Projects" value={String(filteredProjects.filter(p => p.status !== 'COMPLETED').length)} />
            <Metric icon={<Clock3 className="w-4 h-4" />} label="Days Remaining" value={String(daysLeft)} />
            <Metric icon={<FileText className="w-4 h-4" />} label="Documents" value={String(projectDocs.length)} />
            <Metric icon={<MessageSquare className="w-4 h-4" />} label="Recent Messages" value={String(visibleMessages.length)} />
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between"><div><h2 className="font-bold text-foreground">Your Projects</h2><p className="text-xs text-muted-foreground mt-1">Active, review and delivered work</p></div><button onClick={() => setActiveView('model')} className="text-xs font-semibold text-primary flex items-center gap-1">Open model <ArrowRight className="w-3.5 h-3.5" /></button></div>
            <div className="divide-y divide-border">
              {filteredProjects.slice(0, 6).map(p => <div key={p.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4"><div className="flex-1"><div className="font-semibold text-foreground">{p.title}</div><div className="text-xs text-muted-foreground mt-1">{p.clientName} · Due {p.endDate}</div></div><div className="w-full md:w-56"><div className="flex justify-between text-[11px] mb-1"><span className="text-muted-foreground">Progress</span><span className="font-semibold">{p.progress}%</span></div><div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} /></div></div><span className="px-2.5 py-1 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">{p.status.replace('_', ' ')}</span></div>)}
              {!filteredProjects.length && <div className="p-10 text-center text-sm text-muted-foreground">No projects are currently assigned to this workspace.</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InfoCard title="Model workflow" icon={<Box className="w-4 h-4" />}><p className="text-sm text-muted-foreground">Open the BIM model, search a mark such as <strong className="text-foreground">B12</strong>, select the actual element, inspect properties, then follow its drawing or create an RFI.</p><button onClick={() => setActiveView('model')} className="mt-4 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">Explore model</button></InfoCard>
            <InfoCard title="Project communication" icon={<MessageSquare className="w-4 h-4" />}><p className="text-sm text-muted-foreground">Keep client questions, team replies, drawing reviews and project updates together instead of losing them in email.</p><button onClick={() => setActiveView('messages')} className="mt-4 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">Open messages</button></InfoCard>
          </div>
        </>
      )}

      {activeView === 'model' && <BimElementExplorer elements={demoElements} onElementSelect={setSelectedElement} />}

      {activeView === 'deliverables' && <div className="bg-card border border-border rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><FileText className="w-4 h-4 text-primary" /><h2 className="font-bold">Drawings & Deliverables</h2></div><div className="space-y-2">{projectDocs.map(doc => <div key={doc.id} className="p-4 rounded-xl border border-border flex items-center justify-between"><div><div className="font-semibold text-sm">{doc.title}</div><div className="text-xs text-muted-foreground">{doc.category} · {doc.fileType} · Uploaded {doc.uploadDate}</div></div><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>)}{!projectDocs.length && <p className="text-sm text-muted-foreground py-8 text-center">No deliverables are available yet.</p>}</div></div>}

      {activeView === 'messages' && <div className="bg-card border border-border rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><MessageSquare className="w-4 h-4 text-primary" /><h2 className="font-bold">Project Messages</h2></div><div className="space-y-3">{visibleMessages.map(m => <div key={m.id} className="p-4 rounded-xl bg-muted/50 border border-border"><div className="flex justify-between gap-3"><span className="font-semibold text-sm">{m.senderName}</span><span className="text-[11px] text-muted-foreground">{m.timestamp}</span></div><p className="text-sm text-muted-foreground mt-2">{m.text}</p></div>)}{!visibleMessages.length && <p className="text-sm text-muted-foreground py-8 text-center">No messages yet.</p>}</div></div>}

      {selectedElement && <div className="text-xs text-muted-foreground">Selected model element: <span className="font-semibold text-foreground">{selectedElement.mark || selectedElement.name}</span></div>}
    </div>
  );
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => <div className="bg-card border border-border rounded-xl p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs uppercase tracking-wider font-medium">{label}</span><div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div></div><div className="text-2xl font-bold text-foreground mt-3">{value}</div></div>;

const InfoCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => <div className="bg-card border border-border rounded-2xl p-5"><div className="flex items-center gap-2 font-bold text-foreground">{icon}{title}</div><div className="mt-3">{children}</div></div>;
