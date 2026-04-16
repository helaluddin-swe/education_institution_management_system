const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  
  // Bill Breakdown
  rent: { type: Number, default: 0 },
  electricity: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  gas: { type: Number, default: 0 },
  service: { type: Number, default: 0 },
  parking: { type: Number, default: 0 },
  dust: { type: Number, default: 0 },
  
  // Advanced Financial Logic
  totalAmount: { type: Number, default: 0 }, // Bill for the month
  paidAmount: { type: Number, default: 0 },  // Actual cash received for this month
  balance: { type: Number, default: 0 },     // Remaining (totalAmount - paidAmount)
  
  status: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Partial'], 
    default: 'Pending' 
  }
}, { timestamps: true });

const tenantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Basic Info
  name: { type: String, required: [true, 'Name is required'], trim: true },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true },
  email: { type: String, lowercase: true, trim: true },
  nid: { type: String, trim: true },

  // Unit & Lease Details
  unit: { type: String, required: [true, 'Unit number is required'], trim: true },
  type: {
    type: String,
    enum: ["Residential", "Commercial", "Bachelor", "Office"],
    default: "Residential"
  },
  status: {
    type: String,
    enum: ["Active", "Expired", "Pending"],
    default: "Active"
  },
  joiningDate: { type: Date, required: true, default: Date.now },
  lease: { type: Date, required: true },

  // Additional Info
  emergencyContact: { type: String, trim: true },

  // --- OVERPAYMENT & DEBT LOGIC ---
  payments: [PaymentSchema],
  
  // The 'Vault' for overpaid money
  reservedBalance: { 
    type: Number, 
    default: 0 
  },
  
  // Summary fields (good for fast dashboard loading)
  totalDebt: { 
    type: Number, 
    default: 0 
  },
  totalBilled: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

const Tennant = mongoose.model('Tenant', tenantSchema);
module.exports = { Tennant };