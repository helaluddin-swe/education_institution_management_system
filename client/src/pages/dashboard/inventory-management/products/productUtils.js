export const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
export const productsData = [
  // --- MARCH: CURRENT INVENTORY SNAPSHOT ---
  { 
    id: 1, 
    title: 'Ultra-HD Curved Monitor 32"', 
    sku: 'ELEC-MON-32C',
    category: 'Electronics', 
    stock: 4,               // Logic: stock < reorderPoint = Low Stock
    reorderPoint: 10, 
    price: 349.99,
    status: 'Low Stock', 
    dateAdded: 'Mar 28', 
    supplier: 'TechVision Corp',
    demand: 'High',
    warehouseLoc: 'Aisle 4, Shelf B'
  },
  { 
    id: 2, 
    title: 'Ergonomic Mesh Office Chair', 
    sku: 'FURN-CHR-ERG',
    category: 'Furniture', 
    stock: 45, 
    reorderPoint: 15, 
    price: 189.50,
    status: 'In Stock', 
    dateAdded: 'Mar 29', 
    supplier: 'ComfortSeating Ltd',
    demand: 'Medium',
    warehouseLoc: 'Aisle 12, Shelf A'
  },
  { 
    id: 3, 
    title: 'Mechanical RGB Keyboard', 
    sku: 'ELEC-KBD-RGB',
    category: 'Electronics', 
    stock: 0, 
    reorderPoint: 20, 
    price: 89.00,
    status: 'Out of Stock', 
    dateAdded: 'Mar 30', 
    supplier: 'GamerGear Inc',
    demand: 'Most Selling',
    warehouseLoc: 'Aisle 2, Shelf D'
  },
  { 
    id: 4, 
    title: 'Standing Desk (Electric)', 
    sku: 'FURN-DSK-STD',
    category: 'Furniture', 
    stock: 12, 
    reorderPoint: 5, 
    price: 499.00,
    status: 'In Stock', 
    dateAdded: 'Mar 31', 
    supplier: 'FlexiWork',
    demand: 'Steady',
    warehouseLoc: 'Aisle 10, Shelf C'
  },

  // --- APRIL: UPCOMING SHIPMENTS & NEW ARRIVALS ---
  { 
    id: 5, 
    title: 'Wireless Noise Cancelling Buds', 
    sku: 'ELEC-AUD-WLS',
    category: 'Electronics', 
    stock: 85, 
    reorderPoint: 30, 
    price: 129.99,
    status: 'In Stock', 
    dateAdded: 'Apr 01', 
    supplier: 'SonicFlow',
    demand: 'Seasonal',
    warehouseLoc: 'Aisle 3, Shelf E'
  },
  { 
    id: 6, 
    title: 'Bamboo Desk Organizer', 
    sku: 'OFFC-ORG-BAM',
    category: 'Office Supplies', 
    stock: 3, 
    reorderPoint: 25, 
    price: 24.99,
    status: 'Low Stock', 
    dateAdded: 'Apr 02', 
    supplier: 'EcoOffice',
    demand: 'Low',
    warehouseLoc: 'Aisle 1, Shelf A'
  },
  { 
    id: 7, 
    title: 'USB-C Fast Charger 65W', 
    sku: 'ELEC-CHG-65W',
    category: 'Electronics', 
    stock: 120, 
    reorderPoint: 40, 
    price: 35.00,
    status: 'In Stock', 
    dateAdded: 'Apr 05', 
    supplier: 'PowerUp Tech',
    demand: 'Most Selling',
    warehouseLoc: 'Aisle 5, Shelf B'
  },
  { 
    id: 8, 
    title: 'Recycled Paper Reams (500ct)', 
    sku: 'SUPP-PPR-REC',
    category: 'Office Supplies', 
    stock: 500, 
    reorderPoint: 100, 
    price: 8.50,
    status: 'In Stock', 
    dateAdded: 'Apr 10', 
    supplier: 'GreenPrint Co',
    demand: 'Whole Year',
    warehouseLoc: 'Aisle 15, Shelf F'
  }
];
