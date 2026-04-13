const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "DevSpace Studio" },
  type: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], 
    default: 'Full-time' 
  },
  category: { type: String, required: true }, // e.g., Engineering, Marketing
  status: { 
    type: String, 
    enum: ['Active', 'Closed', 'Draft', 'Urgent'], 
    default: 'Active' 
  },
  location: {
    city: { type: String, required: true },
    area: { type: String },
    isRemote: { type: Boolean, default: false }
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'BDT' },
    isNegotiable: { type: Boolean, default: false }
  },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number }
  },
  deadline: { type: Date },
  description: { type: String, required: true },
  requirements: [{ type: String }], // Array of skills/requirements
  perks: [{ type: String }], // Array of benefits
  contactEmail: { type: String },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports=Job