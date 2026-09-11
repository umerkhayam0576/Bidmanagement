import React, { useState, useMemo } from 'react';
import {
  Coins,
  Calculator,
  Search,
  Filter,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  Building,
  User,
  Package,
  Wrench,
  DollarSign,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  X,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { MaterialCostItem, LaborCostItem } from '../../types';

export const PricingHubModule: React.FC = () => {
  const {
    materialCosts,
    laborCosts,
    addMaterialCost,
    addLaborCost,
    formatCurrency
  } = useBusiness();

  const [activeTab, setActiveTab] = useState<'materials' | 'labor'>('materials');

  // Materials state
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategory, setMaterialCategory] = useState('ALL');
  const [isNewMaterialOpen, setIsNewMaterialOpen] = useState(false);

  // Estimator Calculator for Materials
  const [calcMaterialId, setCalcMaterialId] = useState<string>(materialCosts[0]?.id || '');
  const [calcMaterialQty, setCalcMaterialQty] = useState<number>(50);
  const [calcIncludeFreight, setCalcIncludeFreight] = useState(true);

  // Labor state
  const [laborSearch, setLaborSearch] = useState('');
  const [laborCategory, setLaborCategory] = useState('ALL');
  const [isNewLaborOpen, setIsNewLaborOpen] = useState(false);

  // Estimator Calculator for Labor
  const [calcLaborId, setCalcLaborId] = useState<string>(laborCosts[0]?.id || '');
  const [calcCrewSize, setCalcCrewSize] = useState<number>(4);
  const [calcHours, setCalcHours] = useState<number>(40);
  const [calcIncludeBurden, setCalcIncludeBurden] = useState(true);

  // New Material Form
  const [formMatCode, setFormMatCode] = useState(`MAT-0${materialCosts.length + 50}`);
  const [formMatName, setFormMatName] = useState('');
  const [formMatCategory, setFormMatCategory] = useState('Concrete & Masonry');
  const [formMatUnit, setFormMatUnit] = useState('m³');
  const [formMatPrice, setFormMatPrice] = useState('');
  const [formMatSupplier, setFormMatSupplier] = useState('');
  const [formMatLeadTime, setFormMatLeadTime] = useState('3');
  const [formMatMoq, setFormMatMoq] = useState('10');

  // New Labor Form
  const [formLabTrade, setFormLabTrade] = useState('');
  const [formLabCategory, setFormLabCategory] = useState('Civil & Structural');
  const [formLabStandard, setFormLabStandard] = useState('');
  const [formLabOvertime, setFormLabOvertime] = useState('');
  const [formLabDaily, setFormLabDaily] = useState('');
  const [formLabPerDiem, setFormLabPerDiem] = useState('45');
  const [formLabUnion, setFormLabUnion] = useState(true);

  // Material categories
  const materialCategories = useMemo(() => {
    const set = new Set<string>();
    materialCosts.forEach((m) => set.add(m.category));
    return ['ALL', ...Array.from(set)];
  }, [materialCosts]);

  // Labor categories
  const laborCategories = useMemo(() => {
    const set = new Set<string>();
    laborCosts.forEach((l) => set.add(l.category));
    return ['ALL', ...Array.from(set)];
  }, [laborCosts]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materialCosts.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.code.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.supplier.toLowerCase().includes(materialSearch.toLowerCase());
      const matchesCat = materialCategory === 'ALL' || m.category === materialCategory;
      return matchesSearch && matchesCat;
    });
  }, [materialCosts, materialSearch, materialCategory]);

  // Filtered labor
  const filteredLabor = useMemo(() => {
    return laborCosts.filter((l) => {
      const matchesSearch =
        l.trade.toLowerCase().includes(laborSearch.toLowerCase()) ||
        l.category.toLowerCase().includes(laborSearch.toLowerCase());
      const matchesCat = laborCategory === 'ALL' || l.category === laborCategory;
      return matchesSearch && matchesCat;
    });
  }, [laborCosts, laborSearch, laborCategory]);

  // Material Calculator computation
  const selectedCalcMaterial = useMemo(() => {
    return materialCosts.find((m) => m.id === calcMaterialId) || materialCosts[0];
  }, [materialCosts, calcMaterialId]);

  const materialEstimateTotal = useMemo(() => {
    if (!selectedCalcMaterial) return { base: 0, freight: 0, total: 0 };
    const base = selectedCalcMaterial.unitPrice * (calcMaterialQty || 0);
    const freight = calcIncludeFreight ? base * 0.08 : 0;
    return { base, freight, total: base + freight };
  }, [selectedCalcMaterial, calcMaterialQty, calcIncludeFreight]);

  // Labor Calculator computation
  const selectedCalcLabor = useMemo(() => {
    return laborCosts.find((l) => l.id === calcLaborId) || laborCosts[0];
  }, [laborCosts, calcLaborId]);

  const laborEstimateTotal = useMemo(() => {
    if (!selectedCalcLabor) return { base: 0, burden: 0, total: 0 };
    const base = selectedCalcLabor.standardRatePerHour * calcCrewSize * calcHours;
    const burden = calcIncludeBurden ? base * 0.28 : 0; // 28% insurance, taxes, benefits
    return { base, burden, total: base + burden };
  }, [selectedCalcLabor, calcCrewSize, calcHours, calcIncludeBurden]);

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMatName || !formMatPrice) return;

    addMaterialCost({
      code: formMatCode,
      name: formMatName,
      category: formMatCategory,
      unit: formMatUnit,
      unitPrice: parseFloat(formMatPrice) || 0,
      currency: 'USD',
      supplier: formMatSupplier || 'Local Supply Depot',
      leadTimeDays: parseInt(formMatLeadTime) || 3,
      moq: formMatMoq ? `${formMatMoq} ${formMatUnit}` : undefined,
      trend: 'STABLE'
    });

    setIsNewMaterialOpen(false);
    setFormMatName('');
    setFormMatPrice('');
  };

  const handleCreateLabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabTrade || !formLabStandard) return;

    const std = parseFloat(formLabStandard) || 0;
    addLaborCost({
      trade: formLabTrade,
      category: formLabCategory,
      standardRatePerHour: std,
      overtimeRatePerHour: parseFloat(formLabOvertime) || std * 1.5,
      dailyRate: parseFloat(formLabDaily) || std * 8,
      perDiemRate: parseFloat(formLabPerDiem) || 0,
      isUnionCertified: formLabUnion,
      currency: 'USD'
    });

    setIsNewLaborOpen(false);
    setFormLabTrade('');
    setFormLabStandard('');
  };

  return (
    <div id="pricing-hub-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5">
            <Coins className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            Pricing & Estimating Hub
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time material rates catalog and craft labor cost database for accurate job costing
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Subtab Toggle */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-semibold">
            <button
              id="pricing-tab-materials"
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'materials'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Material Costs Database</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                {materialCosts.length}
              </span>
            </button>
            <button
              id="pricing-tab-labor"
              onClick={() => setActiveTab('labor')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'labor'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Labor & Trade Database</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                {laborCosts.length}
              </span>
            </button>
          </div>

          <button
            id="add-rate-btn"
            onClick={() => (activeTab === 'materials' ? setIsNewMaterialOpen(true) : setIsNewLaborOpen(true))}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'materials' ? 'Add Material Rate' : 'Add Labor Trade'}</span>
          </button>
        </div>
      </div>

      {/* MATERIALS VIEW */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Material Quick Estimator Widget */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-5 border border-amber-200/80 dark:border-amber-900/40 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Quick Material Estimator</span>
              </div>
              <span className="text-xs text-amber-700/80 dark:text-amber-300/80 font-medium">
                Live takeoff calculator
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Select Material SKU
                </label>
                <select
                  id="calc-material-select"
                  value={calcMaterialId}
                  onChange={(e) => setCalcMaterialId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  {materialCosts.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.name} ({formatCurrency(m.unitPrice)}/{m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Quantity Required ({selectedCalcMaterial?.unit})
                </label>
                <input
                  id="calc-material-qty"
                  type="number"
                  min="1"
                  value={calcMaterialQty}
                  onChange={(e) => setCalcMaterialQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer h-9">
                  <input
                    type="checkbox"
                    checked={calcIncludeFreight}
                    onChange={(e) => setCalcIncludeFreight(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Include 8% Freight & Rigging</span>
                </label>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-amber-200 dark:border-amber-800/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Estimated Takeoff Cost
                </span>
                <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                  {formatCurrency(materialEstimateTotal.total)}
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between mt-1">
                  <span>Base: {formatCurrency(materialEstimateTotal.base)}</span>
                  <span>Freight: {formatCurrency(materialEstimateTotal.freight)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="material-search-input"
                type="text"
                placeholder="Search material SKU, spec name, supplier..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                id="material-category-filter"
                value={materialCategory}
                onChange={(e) => setMaterialCategory(e.target.value)}
                className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
              >
                {materialCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Material Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Material Costs Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Material Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Unit Rate</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-center">Market Trend</th>
                    <th className="py-3 px-4">Preferred Supplier</th>
                    <th className="py-3 px-4 text-center">Lead Time</th>
                    <th className="py-3 px-4">MOQ</th>
                    <th className="py-3 px-4">Last Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredMaterials.map((mat) => {
                    const hasTrend = mat.trend && mat.trend !== 'STABLE';
                    return (
                      <tr
                        key={mat.id}
                        id={`material-row-${mat.id}`}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-semibold text-xs text-amber-600 dark:text-amber-400">
                          {mat.code}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                          {mat.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-neutral-100">
                          {formatCurrency(mat.unitPrice)}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 text-xs font-medium">{mat.unit}</td>
                        <td className="py-3.5 px-4 text-center">
                          {mat.trend === 'UP' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                              <TrendingUp className="w-3 h-3" />
                              Rising
                            </span>
                          )}
                          {mat.trend === 'DOWN' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                              <TrendingDown className="w-3 h-3" />
                              Favorable
                            </span>
                          )}
                          {(!mat.trend || mat.trend === 'STABLE') && (
                            <span className="text-[11px] text-neutral-400 font-medium">Stable</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 text-xs">
                          {mat.supplier}
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          {mat.leadTimeDays ? `${mat.leadTimeDays} days` : 'Immediate'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-neutral-500">{mat.moq || 'No MOQ'}</td>
                        <td className="py-3.5 px-4 text-xs font-mono text-neutral-400">{mat.lastUpdated}</td>
                      </tr>
                    );
                  })}

                  {filteredMaterials.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-neutral-400">
                        No materials found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LABOR VIEW */}
      {activeTab === 'labor' && (
        <div className="space-y-6">
          {/* Crew Estimator Widget */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-5 border border-blue-200/80 dark:border-blue-900/40 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Crew & Shift Labor Estimator</span>
              </div>
              <span className="text-xs text-blue-700/80 dark:text-blue-300/80 font-medium">
                Labor rate burden calculator
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Craft Trade
                </label>
                <select
                  id="calc-labor-select"
                  value={calcLaborId}
                  onChange={(e) => setCalcLaborId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  {laborCosts.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.trade} ({formatCurrency(l.standardRatePerHour)}/hr)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Crew Headcount
                </label>
                <input
                  id="calc-crew-size"
                  type="number"
                  min="1"
                  value={calcCrewSize}
                  onChange={(e) => setCalcCrewSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Total Working Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="calc-labor-hours"
                    type="number"
                    min="1"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 whitespace-nowrap cursor-pointer">
                    <input
                      type="checkbox"
                      checked={calcIncludeBurden}
                      onChange={(e) => setCalcIncludeBurden(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>+28% Burden</span>
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-blue-200 dark:border-blue-800/80">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Total Burdened Labor Cost
                </span>
                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  {formatCurrency(laborEstimateTotal.total)}
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between mt-1">
                  <span>Base Wages: {formatCurrency(laborEstimateTotal.base)}</span>
                  <span>Fringe/Tax: {formatCurrency(laborEstimateTotal.burden)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="labor-search-input"
                type="text"
                placeholder="Search trade, discipline, operator..."
                value={laborSearch}
                onChange={(e) => setLaborSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                id="labor-category-filter"
                value={laborCategory}
                onChange={(e) => setLaborCategory(e.target.value)}
                className="text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300 focus:outline-none"
              >
                {laborCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Trade Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Labor Rates Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Trade Classification</th>
                    <th className="py-3 px-4">Discipline</th>
                    <th className="py-3 px-4 text-right">Standard Rate (/hr)</th>
                    <th className="py-3 px-4 text-right">Overtime Rate (1.5x)</th>
                    <th className="py-3 px-4 text-right">Standard Daily (8h)</th>
                    <th className="py-3 px-4 text-right">Site Per Diem</th>
                    <th className="py-3 px-4 text-center">Certified / Union</th>
                    <th className="py-3 px-4">Last Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredLabor.map((lab) => (
                    <tr
                      key={lab.id}
                      id={`labor-row-${lab.id}`}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        {lab.trade}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                          {lab.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900 dark:text-neutral-100">
                        {formatCurrency(lab.standardRatePerHour)}/hr
                      </td>
                      <td className="py-3.5 px-4 text-right text-indigo-600 dark:text-indigo-400 font-medium">
                        {formatCurrency(lab.overtimeRatePerHour)}/hr
                      </td>
                      <td className="py-3.5 px-4 text-right text-neutral-700 dark:text-neutral-300 font-medium">
                        {formatCurrency(lab.dailyRate)}/day
                      </td>
                      <td className="py-3.5 px-4 text-right text-neutral-500 text-xs">
                        {lab.perDiemRate ? `${formatCurrency(lab.perDiemRate)}/day` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {lab.isUnionCertified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Prevailing Wage
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">Open Shop</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-neutral-400">{lab.lastUpdated}</td>
                    </tr>
                  ))}

                  {filteredLabor.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-neutral-400">
                        No labor trade records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Material Modal */}
      {isNewMaterialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                Add Material Rate Item
              </h3>
              <button
                onClick={() => setIsNewMaterialOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Material Code (SKU)
                  </label>
                  <input
                    type="text"
                    value={formMatCode}
                    onChange={(e) => setFormMatCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formMatCategory}
                    onChange={(e) => setFormMatCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Concrete & Masonry">Concrete & Masonry</option>
                    <option value="Structural Steel">Structural Steel</option>
                    <option value="MEP & Piping">MEP & Piping</option>
                    <option value="Aggregate & Earthworks">Aggregate & Earthworks</option>
                    <option value="Electrical & Power">Electrical & Power</option>
                    <option value="Finishing & Coatings">Finishing & Coatings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Material Description / Specification
                </label>
                <input
                  type="text"
                  value={formMatName}
                  onChange={(e) => setFormMatName(e.target.value)}
                  placeholder="e.g. Ready-Mix Concrete C35/45 Sulfate Resistant"
                  required
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formMatPrice}
                    onChange={(e) => setFormMatPrice(e.target.value)}
                    placeholder="e.g. 145.00"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Unit of Measurement
                  </label>
                  <input
                    type="text"
                    value={formMatUnit}
                    onChange={(e) => setFormMatUnit(e.target.value)}
                    placeholder="e.g. m³, Ton, Lin Ft"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formMatSupplier}
                    onChange={(e) => setFormMatSupplier(e.target.value)}
                    placeholder="e.g. Cemex Aggregates"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    value={formMatLeadTime}
                    onChange={(e) => setFormMatLeadTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewMaterialOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
                >
                  Add Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Labor Modal */}
      {isNewLaborOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Craft Labor Trade Rate
              </h3>
              <button
                onClick={() => setIsNewLaborOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLabor} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Trade Classification
                </label>
                <input
                  type="text"
                  value={formLabTrade}
                  onChange={(e) => setFormLabTrade(e.target.value)}
                  placeholder="e.g. Certified High-Voltage Lineman"
                  required
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Trade Category
                </label>
                <select
                  value={formLabCategory}
                  onChange={(e) => setFormLabCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Civil & Structural">Civil & Structural</option>
                  <option value="MEP & Plumbing">MEP & Plumbing</option>
                  <option value="Equipment Operators">Equipment Operators</option>
                  <option value="Supervisory & Engineering">Supervisory & Engineering</option>
                  <option value="Safety & Quality Assurance">Safety & Quality Assurance</option>
                  <option value="Finishing Trades">Finishing Trades</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Standard Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formLabStandard}
                    onChange={(e) => {
                      setFormLabStandard(e.target.value);
                      const std = parseFloat(e.target.value) || 0;
                      setFormLabOvertime((std * 1.5).toFixed(2));
                      setFormLabDaily((std * 8).toFixed(2));
                    }}
                    placeholder="e.g. 58.00"
                    required
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Overtime Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formLabOvertime}
                    onChange={(e) => setFormLabOvertime(e.target.value)}
                    placeholder="e.g. 87.00"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Daily Rate ($/day)
                  </label>
                  <input
                    type="number"
                    value={formLabDaily}
                    onChange={(e) => setFormLabDaily(e.target.value)}
                    placeholder="e.g. 464.00"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Per Diem / Subsistence ($/day)
                  </label>
                  <input
                    type="number"
                    value={formLabPerDiem}
                    onChange={(e) => setFormLabPerDiem(e.target.value)}
                    placeholder="e.g. 45.00"
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formLabUnion}
                    onChange={(e) => setFormLabUnion(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Union Certified / Prevailing Wage Mandate
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewLaborOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Save Trade Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
