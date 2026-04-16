import React from "react";
import { AlertCircle, CheckCircle2, Wallet, GraduationCap, ArrowUpCircle } from "lucide-react";
import ActionDropdown from "./ActionDrop";

const StudentFeeList = ({ students, setSelectedStudent, handleEdit, handleDelete }) => {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Student Name</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Academic Info</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Payment Status</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">Financials</th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {students.map((student, i) => {
              const paymentHistory = student.finance?.paymentHistory || [];
              const pendingInvoices = paymentHistory.filter(p => p.status !== 'Paid');
              
              const totalDue = student.finance?.totalOutstandingDebt || 0;
              const reservedBalance = Number(student.finance?.reservedBalance) || 0;
              const hasReserve = reservedBalance > 0;
              const hasDue = totalDue > 0;

              return (
                <tr 
                  key={student._id || i} 
                  onClick={() => setSelectedStudent(student)}
                  className="group hover:bg-slate-800/50 transition-all cursor-pointer animate-in fade-in duration-500"
                >
                  {/* Name & Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-black text-xs group-hover:bg-indigo-600/20 transition-all">
                        {student.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                          {student.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          ID: {student.studentId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Class & Roll */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={12} className="text-indigo-500" />
                        <span className="text-sm font-semibold text-slate-300">
                          Class {student.currentClass}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                        Section {student.section} • Roll #{student.rollNo || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    {hasDue ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500">
                        <AlertCircle size={10} />
                        <span className="text-[10px] font-black uppercase">
                          {pendingInvoices.length} {pendingInvoices.length === 1 ? 'Month' : 'Months'} Due
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <CheckCircle2 size={10} />
                        <span className="text-[10px] font-black uppercase">Cleared</span>
                      </div>
                    )}
                  </td>

                  {/* Financials (Debt vs Vault) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] text-slate-500 font-bold">৳</span>
                        <span className={`text-sm font-black ${hasDue ? 'text-white' : 'text-slate-500'}`}>
                           {totalDue.toLocaleString()}
                        </span>
                      </div>
                      
                      {hasReserve ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-500 flex items-center gap-1">
                            <Wallet size={8} />
                            <span className="text-[8px] font-black tracking-tighter uppercase">
                               ৳{reservedBalance.toLocaleString()} CREDIT
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter mt-1">
                          No Advanced Credit
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionDropdown 
                      student={student} 
                      handleDelete={handleDelete} 
                      handleEdit={handleEdit} 
                      setSelectedStudent={setSelectedStudent}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {students.length === 0 && (
        <div className="p-12 text-center bg-slate-900/20">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Search size={20} className="text-slate-500" />
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No student records found</p>
        </div>
      )}
    </div>
  );
};

export default StudentFeeList;