import React, { useMemo, useState } from 'react';
import { Box, Search, Layers3, Eye, FileText, MessageSquare, ChevronRight } from 'lucide-react';
import { BimElement } from '../../types/portal';

interface Props {
  elements: BimElement[];
  onElementSelect?: (element: BimElement) => void;
}

export const BimElementExplorer: React.FC<Props> = ({ elements, onElementSelect }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => elements.filter((element) => {
    const haystack = `${element.mark || ''} ${element.name} ${element.globalId} ${element.level || ''}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (type === 'ALL' || element.type === type);
  }), [elements, query, type]);

  const selected = elements.find((element) => element.id === selectedId) || null;

  const selectElement = (element: BimElement) => {
    setSelectedId(element.id);
    onElementSelect?.(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 min-h-[520px]">
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center gap-2">
            <Layers3 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-foreground">Model Elements</h3>
            <span className="ml-auto text-xs text-muted-foreground">{filtered.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search B1, B12, Column..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm">
            <option value="ALL">All element types</option>
            <option value="COLUMN">Columns</option>
            <option value="BEAM">Beams</option>
            <option value="SLAB">Slabs</option>
            <option value="WALL">Walls</option>
            <option value="FOUNDATION">Foundations</option>
            <option value="STAIR">Stairs</option>
          </select>
        </div>
        <div className="max-h-[420px] overflow-y-auto p-2">
          {filtered.map((element) => (
            <button key={element.id} onClick={() => selectElement(element)} className={`w-full text-left p-3 rounded-xl mb-1 transition ${selectedId === element.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted"><Box className="w-4 h-4 text-primary" /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-foreground truncate">{element.mark || element.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{element.type} · {element.level || 'Level not assigned'}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
          {!filtered.length && <div className="p-8 text-center text-sm text-muted-foreground">No matching model elements.</div>}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="h-[330px] bg-slate-950 relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative text-center px-6">
            <Box className="w-12 h-12 mx-auto text-primary mb-3" />
            <div className="text-white font-semibold">IFC Model Viewer</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">The viewer adapter is ready for the production IFC renderer. Selecting an element here will drive the same element-selection state used by the viewer.</p>
            {selected && <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">Selected: {selected.mark || selected.name}</div>}
          </div>
        </div>
        <div className="p-5">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary font-bold">Selected Element</div>
                  <h3 className="text-xl font-bold text-foreground mt-1">{selected.mark || selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.name} · {selected.type}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{selected.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                {Object.entries(selected.properties).map(([key, value]) => <div key={key} className="p-3 rounded-xl bg-muted/60 border border-border"><div className="text-[10px] uppercase text-muted-foreground">{key}</div><div className="text-sm font-semibold text-foreground mt-1 break-words">{String(value ?? '—')}</div></div>)}
              </div>
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
                <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> Isolate in Model</button>
                <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Related Drawing</button>
                <button className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Create RFI</button>
              </div>
            </>
          ) : <div className="py-10 text-center text-sm text-muted-foreground">Select an element to inspect its IFC properties, drawing links and review actions.</div>}
        </div>
      </section>
    </div>
  );
};
