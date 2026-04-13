import React, { useState, useMemo } from 'react';

import AddNewProduct from '../products/AddNewProduct';
import InventoryHeader from '../products/InventoryHeader';
import { toast } from "react-hot-toast";
import ProductDetailView from '../products/ProductDetailView';
import { InventoryRow, StockAnalyticsCard } from '../products/ProductsComponents';

const Products = ({ products, setProducts }) => {
  // --- State Management ---
  const [viewMode, setViewMode] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // For Details View
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    sku: '',
    stock: 0,
    price: 0,
    reorderPoint: 10,
    supplier: '',
    warehouseLoc: 'Main Aisle'
  });

  // --- Logic: Sort & Filter ---
  const displayProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      if (viewMode === 'Low Stock') return matchesSearch && p.stock > 0 && p.stock <= p.reorderPoint;
      if (viewMode === 'Out Of Stock') return matchesSearch && p.stock <= 0;
      if (viewMode === 'In Stock') return matchesSearch && p.stock > p.reorderPoint;
      return matchesSearch;
    });

    // Sort: Out of Stock items first, then Low Stock
    return [...filtered].sort((a, b) => a.stock - b.stock);
  }, [products, searchQuery, viewMode]);

  // --- Analytics: Warehouse Financials ---
  const { totalValue, pieData } = useMemo(() => {
    const totals = {};
    let grandTotal = 0;

    products.forEach(p => {
      const val = (p.stock || 0) * (p.price || 0);
      totals[p.category] = (totals[p.category] || 0) + val;
      grandTotal += val;
    });

    const chartData = Object.entries(totals).map(([label, value], index) => ({
      label,
      value,
      color: ['#6366F1', '#F59E0B', '#10B981', '#EC4899'][index % 4],
      percentage: grandTotal > 0 ? (value / grandTotal) * 100 : 0
    }));

    return { totalValue: grandTotal, pieData: chartData };
  }, [products]);

  // --- CRUD Handlers ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    if(!formData.title || !formData.sku) {
      toast.error("Title and SKU are mandatory.");
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      toast.success("Inventory updated.");
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: formData.stock <= 0 ? 'Out of Stock' : (formData.stock <= formData.reorderPoint ? 'Low Stock' : 'In Stock')
      };
      setProducts([newProduct, ...products]);
      toast.success("Product uploaded to catalog.");
    }
    closeModal();
  };

  const deleteProduct = (id) => {
    if (window.confirm("Delete this product? This action cannot be undone.")) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product removed.");
    }
  };

  const adjustStock = (id, amount) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + amount);
        if (newStock === 0) toast.error(`${p.title} is now Out of Stock!`);
        else if (newStock <= p.reorderPoint) toast.error(`${p.title} hits Low Stock threshold.`);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ title: '', category: 'Electronics', sku: '', stock: 0, price: 0, reorderPoint: 10, supplier: '', warehouseLoc: '' });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto bg-[#FDFDFF] min-h-screen">
      
      <InventoryHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddNew={() => setIsModalOpen(true)}
        title="Inventory Manager"
      />

      {/* Main Inventory List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Item Details</th>
                <th className="px-4 py-5">Stock</th>
                <th className="px-4 py-5">Unit Price</th>
                <th className="px-4 py-5">Warehouse Loc</th>
                <th className="px-8 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayProducts.map((product) => (
                <InventoryRow
                  key={product.id}
                  product={product}
                  onAdjust={adjustStock}
                  onEdit={openEditModal}
                  onDelete={deleteProduct}
                  onView={() => setSelectedProduct(product)} // Trigger Detailed View
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between min-h-[240px]">
            <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Portfolio Valuation</p>
                <h2 className="text-5xl font-black">${totalValue.toLocaleString()}</h2>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">A</div>
                   <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">B</div>
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase">{products.length} Active SKUs</p>
            </div>
        </div>

        <StockAnalyticsCard pieData={pieData} totalValue={totalValue} />
      </div>

      {/* Modals */}
      {isModalOpen && (
        <AddNewProduct
          editingTask={editingProduct} 
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          handleSaveTask={handleSaveProduct}
        />
      )}

      {selectedProduct && (
        <ProductDetailView
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onEdit={(p) => { setSelectedProduct(null); openEditModal(p); }}
        />
      )}
    </div>
  );
};

export default Products;