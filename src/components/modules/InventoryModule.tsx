import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle,
  Warehouse,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { InventoryItem } from '../../types';

export const InventoryModule: React.FC = () => {
  const {
    filteredInventory,
    activeBusiness,
    formatCurrency,
    addInventoryItem,
    restockItem
  } = useBusiness();

  const [search, setSearch] = useState('');
  const [showAddSkuModal, setShowAddSkuModal] = useState(false);
  const [selectedForAdjust, setSelectedForAdjust] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  // Form states
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Beans & Green Coffee');
  const [quantity, setQuantity] = useState('');
  const [reorderPoint, setReorderPoint] = useState('20');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [warehouse, setWarehouse] = useState('Central Warehouse');

  const filtered = filteredInventory.filter((item) => {
    const s = (search || '').toLowerCase();
    const itemName = (item.name || '').toLowerCase();
    const itemSku = (item.sku || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();
    return itemName.includes(s) || itemSku.includes(s) || itemCategory.includes(s);
  });

  const totalInventoryValuation = filteredInventory.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0),
    0
  );

  const lowStockCount = filteredInventory.filter(
    (item) => (item.quantity || 0) <= (item.reorderPoint || 0)
  ).length;

  const handleAddSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !quantity) return;
    addInventoryItem({
      businessId: activeBusiness?.id || 'biz_nordic',
      sku,
      name,
      category,
      quantity: parseInt(quantity) || 0,
      reorderPoint: parseInt(reorderPoint) || 10,
      unitCost: parseFloat(costPrice) || 0,
      retailPrice: parseFloat(sellingPrice) || 0,
      warehouse
    });

    setSku('');
    setName('');
    setQuantity('');
    setCostPrice('');
    setSellingPrice('');
    setShowAddSkuModal(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForAdjust || !adjustAmount) return;
    restockItem(selectedForAdjust.id, parseInt(adjustAmount) || 0);
    setSelectedForAdjust(null);
    setAdjustAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <Package className="w-4 h-4" />
            <span>Warehousing & SKU Logistics</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Inventory Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track finished goods, raw materials, reorder trigger points, and real-time inventory valuations.
          </p>
        </div>

        <button
          onClick={() => setShowAddSkuModal(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New SKU Item</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Asset Value in Stock</div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(totalInventoryValuation)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cost-basis physical inventory value</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Low Stock Reorder Alerts</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2">
            {lowStockCount} SKUs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Items at or below minimum threshold</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Unique SKUs Managed</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            {filteredInventory.length} Items
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active product catalog items</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU or Item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filtered.length} of {filteredInventory.length} inventory records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Item Name & Category</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">In Stock</th>
                <th className="py-3 px-3 text-right">Reorder Pt</th>
                <th className="py-3 px-3 text-right">Unit Cost</th>
                <th className="py-3 px-3 text-right">Retail Price</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((item) => {
                const isLow = item.quantity <= item.reorderPoint;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">{item.sku}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">{item.warehouse}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={isLow ? 'text-rose-400 flex items-center justify-end gap-1' : 'text-white'}>
                        {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {item.reorderPoint}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {formatCurrency(item.unitCost)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(item.retailPrice)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedForAdjust(item)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-semibold border border-slate-700 transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add SKU */}
      {showAddSkuModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Add Inventory SKU
            </h3>
            <form onSubmit={handleAddSku} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. COF-ETH-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethiopian Yirgacheffe Grade 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reorder Point</label>
                  <input
                    type="number"
                    required
                    value={reorderPoint}
                    onChange={(e) => setReorderPoint(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Unit Cost Price ({activeBusiness?.currency || 'USD'})</label>
                  <input
                    type="number"
                    required
                    placeholder="12.50"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Retail Selling Price</label>
                  <input
                    type="number"
                    required
                    placeholder="24.00"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Warehouse / Storage Bay</label>
                <input
                  type="text"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkuModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Adjust Stock */}
      {selectedForAdjust && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Adjust Stock Count
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Item: <span className="text-white font-semibold">{selectedForAdjust.name}</span> (Current: {selectedForAdjust.quantity})
            </p>
            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Change Quantity (+ to add, - to deduct)</label>
                <input
                  type="number"
                  required
                  placeholder="+50 or -10"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedForAdjust(null)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Apply Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
