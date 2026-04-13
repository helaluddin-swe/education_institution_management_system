


export const GOALS_DATABASE = [
  {
    id: "G-01",
    title: "Emergency Safety Net",
    target: 15000,
    achieved: 13800,
    monthlyContribution: 1200,
    daysRemaining: 60,
    status: "On Track",
    colorTheme: "#6366f1", // Indigo
    categories: [
      { id: 101, name: 'Housing', amount: 800, iconName: 'home', color: 'bg-blue-600', trend: '-2%' },
      { id: 102, name: 'Insurance', amount: 200, iconName: 'shield', color: 'bg-indigo-600', trend: 'Stable' },
      { id: 103, name: 'Medical', amount: 150, iconName: 'heart', color: 'bg-rose-500', trend: '+5%' }
    ]
  },
  {
    id: "G-02",
    title: "Euro Summer 2026",
    target: 8500,
    achieved: 4250,
    monthlyContribution: 500,
    daysRemaining: 141,
    status: "Balanced",
    colorTheme: "#f59e0b", // Amber
    categories: [
      { id: 201, name: 'Flights', amount: 1200, iconName: 'zap', color: 'bg-amber-500', trend: '+12%' },
      { id: 202, name: 'Dining', amount: 450, iconName: 'utensils', color: 'bg-orange-500', trend: '-8%' },
      { id: 203, name: 'Gear', amount: 300, iconName: 'shopping', color: 'bg-purple-500', trend: 'Stable' }
    ]
  },
  {
    id: "G-03",
    title: "Tech Stack Upgrade",
    target: 3000,
    achieved: 3150,
    monthlyContribution: 300,
    daysRemaining: 9,
    status: "Completed",
    colorTheme: "#10b981", // Emerald
    categories: [
      { id: 301, name: 'Hardware', amount: 2200, iconName: 'grid', color: 'bg-slate-800', trend: 'Paid' },
      { id: 302, name: 'Software', amount: 400, iconName: 'film', color: 'bg-cyan-500', trend: 'Subscribed' }
    ]
  },
  {
    id: "G-04",
    title: "Tesla Downpayment",
    target: 20000,
    achieved: 2400,
    monthlyContribution: 800,
    daysRemaining: 289,
    status: "Early Stage",
    colorTheme: "#3b82f6", // Blue
    categories: [
      { id: 401, name: 'Fuel/Charge', amount: 150, iconName: 'car', color: 'bg-emerald-600', trend: '-20%' },
      { id: 402, name: 'Maintenance', amount: 100, iconName: 'grid', color: 'bg-slate-400', trend: 'Stable' }
    ]
  }
];