import React, { useState } from 'react';
import { Search, Mail, Phone, BookOpen, User } from 'lucide-react';

const FacultyDirectory = () => {
  // Mock data - In a real app, this would come from an API
  const [staffData] = useState([
    { id: 1, name: "Dr. Sarah Jenkins", role: "Department Head", dept: "Science", email: "s.jenkins@school.edu", phone: "ext. 402" },
    { id: 2, name: "Marcus Thompson", role: "Senior Lecturer", dept: "Mathematics", email: "m.thompson@school.edu", phone: "ext. 105" },
    { id: 3, name: "Elena Rodriguez", role: "Assistant Professor", dept: "Arts", email: "e.rodriguez@school.edu", phone: "ext. 221" },
    { id: 4, name: "James Wilson", role: "Lab Coordinator", dept: "Science", email: "j.wilson@school.edu", phone: "ext. 405" },
    { id: 5, name: "Linda Chen", role: "Administrator", dept: "Registrar", email: "l.chen@school.edu", phone: "ext. 001" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  const filteredStaff = staffData.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "All" || person.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  const departments = ["All", ...new Set(staffData.map(item => item.dept))];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Faculty & Staff Directory</h1>
        <p className="text-gray-600">Manage and view all educational and administrative personnel.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400 size-5" />
          <input 
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 outline-none"
          onChange={(e) => setFilterDept(e.target.value)}
        >
          {departments.map(dept => <option key={dept} value={dept}>{dept} Department</option>)}
        </select>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Staff
        </button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{staff.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{staff.role}</p>
                </div>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <BookOpen size={16} />
                  <span>{staff.dept} Department</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <Mail size={16} />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-3">
                  <Phone size={16} />
                  <span>{staff.phone}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 flex justify-around border-t">
              <button className="text-sm text-blue-600 font-semibold hover:underline">Edit Profile</button>
              <button className="text-sm text-gray-400 font-semibold hover:text-red-500">Archive</button>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No staff members found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default FacultyDirectory;