export const studentProfiles = [
  {
    id: '2026-10A-100',
    fullName: 'Arif Rahman',
    rollNumber: 100,
    grade: '10',
    section: 'A',
    admissionDate: '2025-01-10',
    status: 'Active',
    personal: { dob: '2010-05-15', gender: 'Male', bloodGroup: 'B+', address: 'Halishahar, Chattogram', email: 'arif.rahman@school.edu' },
    guardian: { name: 'Ziaur Rahman', relation: 'Father', phone: '01712345678', occupation: 'Business' },
    academics: { attendance: '94%', lastGPA: '4.80', rank: '3rd' },
    paymentHistory: [
      { invoiceId: 'F101', month: 'March', year: '2026', total: 1200, paid: 1200, status: 'Paid', date: '2026-03-15', method: 'bKash', transactionId: 'BK9928374' },
      { invoiceId: 'F088', month: 'February', year: '2026', total: 1200, paid: 1200, status: 'Paid', date: '2026-02-12', method: 'Cash', transactionId: 'N/A' }
    ],
    financials: { totalPayable: 2400, totalPaid: 2400, dueBalance: 0 }
  },
  {
    id: '2026-8B-101',
    fullName: 'Nusrat Jahan',
    rollNumber: 101,
    grade: '8',
    section: 'B',
    admissionDate: '2024-12-05',
    status: 'Active',
    personal: { dob: '2012-08-22', gender: 'Female', bloodGroup: 'O+', address: 'Gulshan, Dhaka', email: 'nusrat.j@school.edu' },
    guardian: { name: 'Kamal Hossain', relation: 'Father', phone: '01812345679', occupation: 'Engineer' },
    academics: { attendance: '98%', lastGPA: '5.00', rank: '1st' },
    paymentHistory: [
      { invoiceId: 'F102', month: 'March', year: '2026', total: 1100, paid: 400, status: 'Partial', date: '2026-03-20', method: 'bKash', transactionId: 'BK4455221' }
    ],
    financials: { totalPayable: 1100, totalPaid: 400, dueBalance: 700 }
  },
  {
    id: '2026-12C-102',
    fullName: 'Emma Wilson',
    rollNumber: 102,
    grade: '12',
    section: 'C',
    admissionDate: '2023-01-15',
    status: 'Active',
    personal: { dob: '2008-03-12', gender: 'Female', bloodGroup: 'A-', address: 'Banani, Dhaka', email: 'emma.w@school.edu' },
    guardian: { name: 'Robert Wilson', relation: 'Father', phone: '01912345680', occupation: 'Teacher' },
    academics: { attendance: '88%', lastGPA: '3.75', rank: '12th' },
    paymentHistory: [
      { invoiceId: 'F103', month: 'March', year: '2026', total: 1500, paid: 0, status: 'Overdue', date: '2026-03-01', method: 'N/A', transactionId: 'N/A' }
    ],
    financials: { totalPayable: 1500, totalPaid: 0, dueBalance: 1500 }
  },
  {
    id: '2026-5A-105',
    fullName: 'James Bond',
    rollNumber: 105,
    grade: '5',
    section: 'A',
    admissionDate: '2025-02-20',
    status: 'Active',
    personal: { dob: '2015-11-07', gender: 'Male', bloodGroup: 'AB+', address: 'Uttara, Dhaka', email: '007@school.edu' },
    guardian: { name: 'Andrew Bond', relation: 'Father', phone: '01612345681', occupation: 'Consultant' },
    academics: { attendance: '91%', lastGPA: '4.20', rank: '5th' },
    paymentHistory: [
      { invoiceId: 'F104', month: 'March', year: '2026', total: 900, paid: 900, status: 'Paid', date: '2026-03-22', method: 'Bank', transactionId: 'TXN889900' }
    ],
    financials: { totalPayable: 900, totalPaid: 900, dueBalance: 0 }
  },
  {
    id: '2026-2B-106',
    fullName: 'Sophia Liu',
    rollNumber: 106,
    grade: '2',
    section: 'B',
    admissionDate: '2026-01-05',
    status: 'Active',
    personal: { dob: '2018-09-30', gender: 'Female', bloodGroup: 'B-', address: 'Panchlaish, Chattogram', email: 'sophia.liu@school.edu' },
    guardian: { name: 'David Liu', relation: 'Father', phone: '01512345682', occupation: 'Doctor' },
    academics: { attendance: '100%', lastGPA: '5.00', rank: '2nd' },
    paymentHistory: [
      { invoiceId: 'F105', month: 'March', year: '2026', total: 850, paid: 0, status: 'Pending', date: '2026-03-25', method: 'N/A', transactionId: 'N/A' }
    ],
    financials: { totalPayable: 850, totalPaid: 0, dueBalance: 850 }
  },
  {
    id: '2026-9A-110',
    fullName: 'Zayan Malik',
    rollNumber: 110,
    grade: '9',
    section: 'A',
    admissionDate: '2024-05-12',
    status: 'Active',
    personal: { dob: '2011-02-14', gender: 'Male', bloodGroup: 'O-', address: 'Agrabad, Chattogram', email: 'zayan.m@school.edu' },
    guardian: { name: 'Yousuf Malik', relation: 'Father', phone: '01312345683', occupation: 'Pilot' },
    academics: { attendance: '92%', lastGPA: '4.50', rank: '8th' },
    paymentHistory: [
      { invoiceId: 'F106', month: 'March', year: '2026', total: 1150, paid: 1150, status: 'Paid', date: '2026-03-10', method: 'Nagad', transactionId: 'NG778899' }
    ],
    financials: { totalPayable: 1150, totalPaid: 1150, dueBalance: 0 }
  },
  {
    id: '2026-7C-115',
    fullName: 'Ayesha Siddiqua',
    rollNumber: 115,
    grade: '7',
    section: 'C',
    admissionDate: '2025-08-18',
    status: 'Active',
    personal: { dob: '2013-04-05', gender: 'Female', bloodGroup: 'A+', address: 'Khulshi, Chattogram', email: 'ayesha.s@school.edu' },
    guardian: { name: 'Mariam Begum', relation: 'Mother', phone: '01412345684', occupation: 'Homemaker' },
    academics: { attendance: '85%', lastGPA: '3.90', rank: '15th' },
    paymentHistory: [
      { invoiceId: 'F107', month: 'March', year: '2026', total: 1050, paid: 500, status: 'Partial', date: '2026-03-18', method: 'Cash', transactionId: 'N/A' }
    ],
    financials: { totalPayable: 1050, totalPaid: 500, dueBalance: 550 }
  },
  {
    id: '2026-11B-120',
    fullName: 'Rahul Sharma',
    rollNumber: 120,
    grade: '11',
    section: 'B',
    admissionDate: '2023-06-25',
    status: 'Inactive',
    personal: { dob: '2009-12-12', gender: 'Male', bloodGroup: 'B+', address: 'Sylhet Sadar', email: 'rahul.s@school.edu' },
    guardian: { name: 'Sanjay Sharma', relation: 'Father', phone: '01212345685', occupation: 'Chef' },
    academics: { attendance: '70%', lastGPA: '3.20', rank: '45th' },
    paymentHistory: [
      { invoiceId: 'F108', month: 'February', year: '2026', total: 1400, paid: 1400, status: 'Paid', date: '2026-02-05', method: 'Bank', transactionId: 'TRX443322' }
    ],
    financials: { totalPayable: 1400, totalPaid: 1400, dueBalance: 0 }
  },
  {
    id: '2026-6A-125',
    fullName: 'Liam Neeson',
    rollNumber: 125,
    grade: '6',
    section: 'A',
    admissionDate: '2025-11-11',
    status: 'Active',
    personal: { dob: '2014-06-18', gender: 'Male', bloodGroup: 'AB-', address: 'Dhanmondi, Dhaka', email: 'liam.n@school.edu' },
    guardian: { name: 'John Neeson', relation: 'Father', phone: '01112345686', occupation: 'Actor' },
    academics: { attendance: '96%', lastGPA: '4.95', rank: '2nd' },
    paymentHistory: [
      { invoiceId: 'F109', month: 'March', year: '2026', total: 950, paid: 950, status: 'Paid', date: '2026-03-12', method: 'bKash', transactionId: 'BK112233' }
    ],
    financials: { totalPayable: 950, totalPaid: 950, dueBalance: 0 }
  },
  {
    id: '2026-4B-130',
    fullName: 'Fatima Zahra',
    rollNumber: 130,
    grade: '4',
    section: 'B',
    admissionDate: '2026-01-20',
    status: 'Active',
    personal: { dob: '2016-01-01', gender: 'Female', bloodGroup: 'O+', address: 'Nasirabad, Chattogram', email: 'fatima.z@school.edu' },
    guardian: { name: 'Ibrahim Khalil', relation: 'Father', phone: '01012345687', occupation: 'Architect' },
    academics: { attendance: '99%', lastGPA: '5.00', rank: '1st' },
    paymentHistory: [
      { invoiceId: 'F110', month: 'March', year: '2026', total: 850, paid: 850, status: 'Paid', date: '2026-03-24', method: 'Nagad', transactionId: 'NG556677' }
    ],
    financials: { totalPayable: 850, totalPaid: 850, dueBalance: 0 }
  }
];

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const downloadPDF = (student) => {
  const doc = new jsPDF();
  const stats = getStats(student);

  // --- Header Section ---
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text("ACADEMIC REPORT CARD", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Academic Year: 2025-2026`, 105, 27, { align: "center" });

  // --- Student Information ---
  doc.setDrawColor(200);
  doc.line(20, 35, 190, 35); // Horizontal line
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Name: ${student.name}`, 20, 45);
  doc.text(`Roll No: ${student.rollNo}`, 20, 52);
  doc.text(`Class: ${student.class} - ${student.section}`, 140, 45);
  doc.text(`Attendance: ${student.attendance}`, 140, 52);

  // --- Results Table ---
  const tableRows = [
    ['Mathematics', student.math, '100', student.math >= 40 ? 'Pass' : 'Fail'],
    ['Science', student.science, '100', student.science >= 40 ? 'Pass' : 'Fail'],
    ['English', student.english, '100', student.english >= 40 ? 'Pass' : 'Fail'],
    ['Bangla', student.bangla, '100', student.bangla >= 40 ? 'Pass' : 'Fail'],
    ['Higher Math', student.hMath, '100', student.hMath >= 40 ? 'Pass' : 'Fail'],
    ['Grammar', student.grammar, '100', student.grammar >= 40 ? 'Pass' : 'Fail'],
  ];

  doc.autoTable({
    startY: 65,
    head: [['Subject', 'Obtained Marks', 'Total Marks', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    styles: { fontSize: 10, cellPadding: 5 }
  });

  // --- Summary & Remarks ---
  const finalY = doc.lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.text(`Final Result: ${stats.status}`, 20, finalY);
  doc.text(`Grade: ${stats.grade}`, 140, finalY);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Teacher's Remarks:", 20, finalY + 15);
  doc.setFont("helvetica", "italic");
  doc.text(student.remarks || "No remarks provided.", 20, finalY + 22);

  // --- Footer / Signatures ---
  doc.setFont("helvetica", "normal");
  doc.line(20, 260, 70, 260); 
  doc.text("Class Teacher", 35, 265, { align: "center" });
  
  doc.line(140, 260, 190, 260);
  doc.text("Principal", 165, 265, { align: "center" });

  // Save the PDF
  doc.save(`${student.name}_Report_Card.pdf`);
};