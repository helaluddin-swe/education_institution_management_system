import React, { useState } from 'react';
import { unitsDataBN, unitsDataEN } from "../data";
import UnitsDetails from './UnitsDetails';

import { Plus } from 'lucide-react';
import AddNewUnit from './AddNewUnit';

import EditCard from './EditCard';

const UnitsInventory = () => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [units, setUnits] = useState(unitsDataEN);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const handleEdit = (unit) => {
    setEditingUnit(unit); // ডাটা সেট করুন
    setIsModalOpen(true); // মোডাল ওপেন করুন
  };

  // নতুন ইউনিট লিস্টে যোগ করার ফাংশন
  const handleAddNewUnit = (newUnit) => {
    setUnits([newUnit, ...units]);
    setIsAddModalOpen(false);
  };

  return (
    <>
      {/* হেডার সেকশন উইথ বাটন */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">ইউনিট ইনভেন্টরি</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={16} /> নতুন ইউনিট যোগ করুন
        </button>
      </div>

      <div className="relative space-y-6 animate-in fade-in duration-500">
        {/* ইউনিটস গ্রিড */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {units.map((unit) => (
            <EditCard key={unit.id} unit={unit} onEdit={handleEdit} setSelectedUnit={setSelectedUnit} />
          ))}

          <AddNewUnit
            isOpen={isModalOpen}
            editUnit={editingUnit}
            onClose={() => {
              setIsModalOpen(false);
              setEditingUnit(null);
            }}
          />
        </div>

        {/* নতুন ইউনিট যোগ করার মডাল */}
        <AddNewUnit
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddNewUnit} 
        />

        {/* ডিটেইলস কার্ড / স্লাইড-ওভার */}
        {selectedUnit && (
          <UnitsDetails
            unit={selectedUnit}
            onClose={() => setSelectedUnit(null)}
          />
        )}
      </div>
    </>
  );
};

export default UnitsInventory;