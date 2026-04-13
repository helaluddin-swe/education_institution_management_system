import { AlertTriangle, CheckCircle2, Clock, Home, Toolbox, Users } from 'lucide-react';
import React from 'react';



// export const stats = [
//   {
//     label: "Total Units",
//     value: "124",
//     icon: Home,
//     color: "text-blue-400",
//   },
//   {
//     label: "Occupancy",
//     value: "92%",
//     icon: Users,
//     color: "text-emerald-400",
//   },
//   {
//     label: "Pending Repairs",
//     value: "12",
//     icon: Toolbox,
//     color: "text-amber-400",
//   },
// ];

// export const maintenencData = [
//   {
//     title: "AC Service Required",
//     unit: "Unit 402",
//     priority: "High",
//     time: "2 hours ago",
//     icon: AlertTriangle,
//   },
//   {
//     title: "Leaky Faucet Fix",
//     unit: "Unit 105",
//     priority: "Medium",
//     time: "5 hours ago",
//     icon: Clock,
//   },
//   {
//     title: "Paint Touch-up",
//     unit: "Lobby",
//     priority: "Low",
//     time: "1 day ago",
//     icon: CheckCircle2,
//   },
// ];

// export const dummyTennant = [
//   {
//     name: "Helal Uddin",
//     unit: "B-104",
//     status: "Active",
//     email: "helal@example.com",
//     lease: "Dec 2026",
//     type: "Commercial", // Added for shop/flat distinction
//     revenue: "$1,200"
//   },
//   {
//     name: "Sarah Connor",
//     unit: "A-202",
//     status: "Expiring Soon",
//     email: "sarah@example.com",
//     lease: "April 2026",
//     type: "Residential",
//     revenue: "$2,400"
//   },
//   {
//     name: "Michael Scott",
//     unit: "C-501",
//     status: "Active",
//     email: "m.scott@example.com",
//     lease: "Jan 2027",
//     type: "Residential",
//     revenue: "$2,100"
//   },
// ];

// // New data for the Finance and Marketing sections
// export const financeData = [
//   { month: 'Jan', revenue: 42000, expenses: 12000 },
//   { month: 'Feb', revenue: 45000, expenses: 15000 },
//   { month: 'Mar', revenue: 41000, expenses: 11000 },
// ];


export const stats = [
  {
    label: "মোট ইউনিট",
    value: "১২৪",
    icon: Home,
    color: "text-blue-400",
  },
  {
    label: "বসবাসকারী",
    value: "৯২%",
    icon: Users,
    color: "text-emerald-400",
  },
  {
    label: "বাকি মেরামত",
    value: "১২",
    icon: Toolbox,
    color: "text-amber-400",
  },
];

export const maintenencData = [
  {
    title: "এসি সার্ভিস প্রয়োজন",
    unit: "ইউনিট ৪০২",
    priority: "জরুরী",
    time: "২ ঘণ্টা আগে",
    icon: AlertTriangle,
  },
  {
    title: "কলের লিক মেরামত",
    unit: "ইউনিট ১০৫",
    priority: "মাঝারি",
    time: "৫ ঘণ্টা আগে",
    icon: Clock,
  },
  {
    title: "রং টাচ-আপ",
    unit: "লবি",
    priority: "সাধারণ",
    time: "১ দিন আগে",
    icon: CheckCircle2,
  },
];



// ফিন্যান্স এবং মার্কেটিং সেকশনের তথ্য
export const financeData = [
  { month: 'জানুয়ারি', revenue: 42000, expenses: 12000 },
  { month: 'ফেব্রুয়ারি', revenue: 45000, expenses: 15000 },
  { month: 'মার্চ', revenue: 41000, expenses: 11000 },
];
export const documents_Pdf=['Lease_Agreement.pdf', 'Police_Verification.docx', 'Trade_License_S01.pdf', 'Tax_Receipt_2025.pdf']
// bangla
export const unitsDataBN = [
  {
    id: 1,
    unitNo: "১০১",
    type: "আবাসিক ফ্ল্যাট",
    status: "ফাঁকা",
    floor: "০১",
    size: "১২৫০",
    category: "Residential",
    rent: "২৫,০০০",
    month: "ডিসেম্বর",
    year: 2026,
    advance: "৫০,০০০",
    bedrooms: 3,
    bathrooms: 2,
    balcony: 2,
    facing: "দক্ষিণ মুখী",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    thana: "পাঁচলাইশ",
    roadNo: "রোড-০৫, নাসিরাবাদ",
    amenities: ["লিফট", "জেনারেটর", "সিসিটিভি", "গ্যারেজ"],
    description: "আধুনিক সুযোগ-সুবিধা সম্বলিত নিরিবিলি পরিবেশে ৩ বেডরুমের চমৎকার একটি ফ্ল্যাট। পর্যাপ্ত আলো-বাতাস এবং প্রশস্ত বারান্দা রয়েছে।",
    features: "নতুন রঙ করা, টাইলস করা ফ্লোর, আধুনিক কিচেন ক্যাবিনেট।",
    contact: "০১৭XXXXXXXX"
  },
  {
    id: 2,
    unitNo: "১০২",
    type: "বাণিজ্যিক দোকান",
    status: "ভাড়া হয়েছে",
    floor: "০১",
    size: "৮০০",
    category: "Commercial",
    rent: "৪০,০০০",
    month: "নভেম্বর",
    year: 2025,
    advance: "৪,০০,০০০",
    facing: "মেইন রোড",
    division: "ঢাকা",
    district: "ঢাকা",
    thana: "উত্তরা",
    roadNo: "সেক্টর-০৭, মেইন রোড",
    amenities: ["বিদ্যুৎ", "নিরাপত্তা প্রহরী", "পাবলিক টয়লেট"],
    description: "ব্যস্ততম রাস্তার পাশে ব্যবসার জন্য উপযুক্ত লোকেশন। শোরুম বা বড় দোকানের জন্য আদর্শ জায়গা।",
    features: "প্রশস্ত সম্মুখ ভাগ, গ্লাস ডোর ফিটিং, ফায়ার এক্সটিংগুইশার সুবিধা।",
    contact: "০১৯XXXXXXXX"
  },
  {
    id: 3,
    unitNo: "২০১",
    type: "আবাসিক ফ্ল্যাট",
    status: "ভাড়া হয়েছে",
    floor: "০২",
    size: "১৫০০",
    category: "Residential",
    rent: "৩২,০০০",
    month: "জানুয়ারি",
    year: 2026,
    advance: "৬৫,০০০",
    bedrooms: 3,
    bathrooms: 3,
    balcony: 3,
    facing: "পূর্ব মুখী",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    thana: "হালিশহর",
    roadNo: "ব্লক-এল, রোড-০২",
    amenities: ["লিফট", "পার্কিং", "ইন্টারকম", "গার্ডেন"],
    description: "বিলাসবহুল ইন্টেরিয়র ডিজাইন করা বড় পরিবারের জন্য উপযোগী ফ্ল্যাট। প্রতিটি রুমে অ্যাটাচড বাথরুমের সুবিধা আছে।",
    features: "মাস্টার বেডরুম, গিজার সুবিধা, কিচেন হুড ইনস্টল করা।",
    contact: "০১৮XXXXXXXX"
  },
  {
    id: 4,
    unitNo: "২০২",
    type: "অফিস স্পেস",
    status: "ফাঁকা",
    floor: "০২",
    size: "১১০০",
    category: "Commercial",
    rent: "৩৫,০০০",
    month: "মার্চ",
    year: 2026,
    advance: "১,০০,০০০",
    facing: "পশ্চিম মুখী",
    division: "ঢাকা",
    district: "ঢাকা",
    thana: "বনানী",
    roadNo: "রোড-১১, ব্লক-সি",
    amenities: ["লিফট", "হাই-স্পিড ইন্টারনেট", "কনফারেন্স রুম"],
    description: "আইটি ফার্ম বা কর্পোরেট অফিসের জন্য পারফেক্ট স্পেস। ওপেন ফ্লোর প্ল্যান হওয়ায় পছন্দমতো ডিজাইন করে নেয়া সম্ভব।",
    features: "সেন্ট্রাল এসি লাইন, পর্যাপ্ত পাওয়ার আউটলেট, কার পার্কিং।",
    contact: "০১৫XXXXXXXX"
  },
  {
    id: 5,
    unitNo: "৩০১",
    type: "স্টুডিও অ্যাপার্টমেন্ট",
    status: "ফাঁকা",
    floor: "০৩",
    size: "৬০০",
    category: "Residential",
    rent: "১৫,০০০",
    month: "জুন",
    year: 2026,
    advance: "৩০,০০০",
    bedrooms: 1,
    bathrooms: 1,
    balcony: 1,
    facing: "উত্তর মুখী",
    division: "সিলেট",
    district: "সিলেট",
    thana: "জিন্দাবাজার",
    roadNo: "এয়ারপোর্ট রোড",
    amenities: ["লিফট", "ওয়াইফাই", "রুফটপ অ্যাক্সেস"],
    description: "ব্যাচেলর বা ছোট পরিবারের জন্য স্মার্ট সলিউশন। রুফটপে বাগান করার সুবিধা এবং চমৎকার ভিউ।",
    features: "কম্প্যাক্ট ডিজাইন, ওপেন কিচেন, সেমি-ফার্নিশড।",
    contact: "০১৬XXXXXXXX"
  }
];

// english
export const unitsDataEN = [
  {
    id: 1,
    unitNo: "101",
    type: "Residential Flat",
    status: "Vacant",
    floor: "01",
    size: "1250",
    category: "Residential",
    rent: "25,000",
    month: "December",
    year: 2026,
    advance: "50,000",
    bedrooms: 3,
    bathrooms: 2,
    balcony: 2,
    facing: "South Facing",
    division: "Chattogram",
    district: "Chattogram",
    thana: "Panchlaish",
    roadNo: "Road-05, Nasirabad",
    amenities: ["Lift", "Generator", "CCTV", "Garage"],
    description: "A beautiful 3-bedroom flat in a quiet environment with modern facilities. Plenty of light and air with spacious balconies.",
    features: "Freshly painted, tiled floor, modern kitchen cabinets.",
    contact: "+88017XXXXXXXX"
  },
  {
    id: 2,
    unitNo: "102",
    type: "Commercial Shop",
    status: "Occupied",
    floor: "01",
    size: "800",
    category: "Commercial",
    rent: "40,000",
    month: "November",
    year: 2025,
    advance: "4,00,000",
    facing: "Main Road",
    division: "Dhaka",
    district: "Dhaka",
    thana: "Uttara",
    roadNo: "Sector-07, Main Road",
    amenities: ["Electricity", "Security Guard", "Public Toilet"],
    description: "Perfect location for business next to a busy road. Ideal for a showroom or large shop.",
    features: "Wide frontage, glass door fitting, fire extinguisher facility.",
    contact: "+88019XXXXXXXX"
  },
  {
    id: 3,
    unitNo: "201",
    type: "Residential Flat",
    status: "Occupied",
    floor: "02",
    size: "1500",
    category: "Residential",
    rent: "32,000",
    month: "January",
    year: 2026,
    advance: "65,000",
    bedrooms: 3,
    bathrooms: 3,
    balcony: 3,
    facing: "East Facing",
    division: "Chattogram",
    district: "Chattogram",
    thana: "Halishahar",
    roadNo: "Block-L, Road-02",
    amenities: ["Lift", "Parking", "Intercom", "Garden"],
    description: "Luxury interior-designed flat suitable for large families. Each room has an attached bathroom facility.",
    features: "Master bedroom, geyser facility, kitchen hood installed.",
    contact: "+88018XXXXXXXX"
  },
  {
    id: 4,
    unitNo: "202",
    type: "Office Space",
    status: "Vacant",
    floor: "02",
    size: "1100",
    category: "Commercial",
    rent: "35,000",
    month: "March",
    year: 2026,
    advance: "1,00,000",
    facing: "West Facing",
    division: "Dhaka",
    district: "Dhaka",
    thana: "Banani",
    roadNo: "Road-11, Block-C",
    amenities: ["Lift", "High-speed Internet", "Conference Room"],
    description: "Perfect space for IT firms or corporate offices. Open floor plan allows for custom design.",
    features: "Central AC line, ample power outlets, car parking.",
    contact: "+88015XXXXXXXX"
  },
  {
    id: 5,
    unitNo: "301",
    type: "Studio Apartment",
    status: "Vacant",
    floor: "03",
    size: "600",
    category: "Residential",
    rent: "15,000",
    month: "June",
    year: 2026,
    advance: "30,000",
    bedrooms: 1,
    bathrooms: 1,
    balcony: 1,
    facing: "North Facing",
    division: "Sylhet",
    district: "Sylhet",
    thana: "Zindabazar",
    roadNo: "Airport Road",
    amenities: ["Lift", "WiFi", "Rooftop Access"],
    description: "Smart solution for bachelors or small families. Rooftop garden access with a great view.",
    features: "Compact design, open kitchen, semi-furnished.",
    contact: "+88016XXXXXXXX"
  }
];

export const dummyTennant = [
  {
    id: 1,
    name: "হেলাল উদ্দিন",
    unit: "বি-১০৪",
    status: "সক্রিয়",
    email: "helal@example.com",
    lease: "ডিসেম্বর ২০২৬",
    type: "বাণিজ্যিক", 
    phone: "01700000000",
    joiningDate: "জানুয়ারি ২০২৪",
    payments: [
      { month: "জানুয়ারি", year: 2026, status: "Paid", rent: 15000, electricity: 1200, water: 500, gas: 1080, service: 1000, parking: 500, dust: 100 },
      { month: "ফেব্রুয়ারি", year: 2026, status: "Pending", rent: 15000, electricity: 1450, water: 500, gas: 1080, service: 1000, parking: 500, dust: 100 }
    ]
  },
  {
    id: 2,
    name: "সারা কনর",
    unit: "এ-২০২",
    status: "মেয়াদ শেষ",
    email: "sarah@example.com",
    lease: "এপ্রিল ২০২৬",
    type: "আবাসিক",
    phone: "01800000000",
    joiningDate: "জুন ২০২৫",
    payments: [
      { month: "জানুয়ারি", year: 2026, status: "Paid", rent: 12000, electricity: 800, water: 300, gas: 1080, service: 500, parking: 0, dust: 100 }
    ]
  }
];