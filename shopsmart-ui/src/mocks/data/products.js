/**
 * Mock products dataset per CONTRACT Section 5, 7.
 * Contains 14 representative products covering:
 * - LAP101 hero Dell Inspiron 15 (899 USD, 16GB RAM, 512GB SSD, rating 4.4, in stock)
 * - 4 laptops < $1000 with >= 16GB RAM (including dedicated GPU LAP102)
 * - 2 budget laptops with 8GB RAM
 * - Premium laptops ($1400-$2400) including 1 with stock 0 (LAP108)
 * - 4 low stock products (LAP103, LAP106, AUD301, SHN402)
 * - Phones, audio, footwear, and books
 */

export function computeAvailability(stockQty) {
  if (stockQty <= 0) return 'OUT_OF_STOCK';
  if (stockQty <= 5) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export const PRODUCTS = [
  {
    id: 'LAP101',
    name: 'Dell Inspiron 15',
    categoryId: 2, // Laptops
    brand: 'Dell',
    description: 'Versatile 15.6-inch laptop with 13th Gen Intel Core i7, crisp FHD display, and rapid SSD storage. Perfect for productivity, studying, and multitasking.',
    price: 899.00,
    rating: 4.4,
    stockQty: 15,
    specs: {
      cpu: 'Intel Core i7-1355U',
      ramGb: 16,
      storageGb: 512,
      storageType: 'SSD',
      gpu: 'Intel Iris Xe',
      displayInches: 15.6,
      weightKg: 1.65,
      batteryHours: 8,
      os: 'Windows 11 Home',
    },
    images: [
      'https://picsum.photos/seed/LAP101/600/450',
      'https://picsum.photos/seed/LAP101-2/600/450',
    ],
  },
  {
    id: 'LAP102',
    name: 'Lenovo IdeaPad Gaming 3',
    categoryId: 2,
    brand: 'Lenovo',
    description: 'High-performance gaming laptop equipped with AMD Ryzen 5, 16GB RAM, and NVIDIA GeForce RTX 4050 dedicated graphics for gaming and creative workloads.',
    price: 949.00,
    rating: 4.3,
    stockQty: 8,
    specs: {
      cpu: 'AMD Ryzen 5 7535HS',
      ramGb: 16,
      storageGb: 512,
      storageType: 'SSD',
      gpu: 'NVIDIA GeForce RTX 4050 (6GB)',
      displayInches: 15.6,
      weightKg: 2.32,
      batteryHours: 6,
      os: 'Windows 11 Home',
    },
    images: [
      'https://picsum.photos/seed/LAP102/600/450',
      'https://picsum.photos/seed/LAP102-2/600/450',
    ],
  },
  {
    id: 'LAP103',
    name: 'HP Pavilion 15',
    categoryId: 2,
    brand: 'HP',
    description: 'Sleek aluminum chassis laptop with AMD Ryzen 7 processor, 16GB memory, and audio tuned by B&O. Great everyday reliability.',
    price: 829.00,
    rating: 4.2,
    stockQty: 4, // LOW_STOCK
    specs: {
      cpu: 'AMD Ryzen 7 7730U',
      ramGb: 16,
      storageGb: 512,
      storageType: 'SSD',
      gpu: 'AMD Radeon Graphics',
      displayInches: 15.6,
      weightKg: 1.75,
      batteryHours: 7.5,
      os: 'Windows 11 Home',
    },
    images: [
      'https://picsum.photos/seed/LAP103/600/450',
    ],
  },
  {
    id: 'LAP104',
    name: 'Acer Aspire 5',
    categoryId: 2,
    brand: 'Acer',
    description: 'Productivity workhorse featuring Intel Core i5, 16GB RAM, dual cooling fans, and comprehensive connectivity ports.',
    price: 749.00,
    rating: 4.1,
    stockQty: 12,
    specs: {
      cpu: 'Intel Core i5-1335U',
      ramGb: 16,
      storageGb: 512,
      storageType: 'SSD',
      gpu: 'Intel Iris Xe',
      displayInches: 15.6,
      weightKg: 1.78,
      batteryHours: 8,
      os: 'Windows 11 Home',
    },
    images: [
      'https://picsum.photos/seed/LAP104/600/450',
    ],
  },
  {
    id: 'LAP105',
    name: 'ASUS VivoBook Go 15',
    categoryId: 2,
    brand: 'ASUS',
    description: 'Lightweight budget laptop with 8GB RAM, fast SSD, and anti-glare screen designed for students and basic everyday computing.',
    price: 429.00,
    rating: 3.9,
    stockQty: 20,
    specs: {
      cpu: 'AMD Ryzen 3 7320U',
      ramGb: 8,
      storageGb: 256,
      storageType: 'SSD',
      gpu: 'AMD Radeon 610M',
      displayInches: 15.6,
      weightKg: 1.63,
      batteryHours: 9,
      os: 'Windows 11 Home in S Mode',
    },
    images: [
      'https://picsum.photos/seed/LAP105/600/450',
    ],
  },
  {
    id: 'LAP106',
    name: 'Lenovo IdeaPad 1',
    categoryId: 2,
    brand: 'Lenovo',
    description: 'Compact 14-inch travel-friendly laptop with 8GB RAM and efficient battery life for browsing, email, and streaming.',
    price: 399.00,
    rating: 3.8,
    stockQty: 3, // LOW_STOCK
    specs: {
      cpu: 'Intel Celeron N4500',
      ramGb: 8,
      storageGb: 256,
      storageType: 'SSD',
      gpu: 'Intel UHD Graphics',
      displayInches: 14.0,
      weightKg: 1.40,
      batteryHours: 7,
      os: 'Windows 11 Home',
    },
    images: [
      'https://picsum.photos/seed/LAP106/600/450',
    ],
  },
  {
    id: 'LAP107',
    name: 'Apple MacBook Pro 14',
    categoryId: 2,
    brand: 'Apple',
    description: 'Industry-leading performance with Apple M3 Pro chip, stunning Liquid Retina XDR display, up to 18 hours battery life, and studio-quality mics.',
    price: 1999.00,
    rating: 4.9,
    stockQty: 10,
    specs: {
      cpu: 'Apple M3 Pro (12-core)',
      ramGb: 18,
      storageGb: 512,
      storageType: 'SSD',
      gpu: '18-core GPU',
      displayInches: 14.2,
      weightKg: 1.61,
      batteryHours: 18,
      os: 'macOS Sonoma',
    },
    images: [
      'https://picsum.photos/seed/LAP107/600/450',
      'https://picsum.photos/seed/LAP107-2/600/450',
    ],
  },
  {
    id: 'LAP108',
    name: 'Dell XPS 15',
    categoryId: 2,
    brand: 'Dell',
    description: 'Premium creator laptop with 4K OLED InfinityEdge touch display, Intel Core i9, 32GB RAM, and NVIDIA GeForce RTX 4070 graphics.',
    price: 2199.00,
    rating: 4.6,
    stockQty: 0, // OUT_OF_STOCK
    specs: {
      cpu: 'Intel Core i9-13900H',
      ramGb: 32,
      storageGb: 1024,
      storageType: 'SSD',
      gpu: 'NVIDIA GeForce RTX 4070 (8GB)',
      displayInches: 15.6,
      weightKg: 1.92,
      batteryHours: 10,
      os: 'Windows 11 Pro',
    },
    images: [
      'https://picsum.photos/seed/LAP108/600/450',
    ],
  },
  {
    id: 'LAP109',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    categoryId: 2,
    brand: 'Lenovo',
    description: 'Ultra-light carbon fiber business ultrabook with Intel Core i7, legendary ergonomic keyboard, and enterprise security.',
    price: 1699.00,
    rating: 4.7,
    stockQty: 6,
    specs: {
      cpu: 'Intel Core i7-1365U',
      ramGb: 16,
      storageGb: 512,
      storageType: 'SSD',
      gpu: 'Intel Iris Xe',
      displayInches: 14.0,
      weightKg: 1.12,
      batteryHours: 13,
      os: 'Windows 11 Pro',
    },
    images: [
      'https://picsum.photos/seed/LAP109/600/450',
    ],
  },
  {
    id: 'PHN201',
    name: 'Samsung Galaxy S24',
    categoryId: 3, // Smartphones
    brand: 'Samsung',
    description: 'Next-gen flagship smartphone with Galaxy AI capabilities, 50MP camera system, Dynamic AMOLED 2X display, and all-day battery.',
    price: 799.00,
    rating: 4.6,
    stockQty: 25,
    specs: {
      screenInches: 6.2,
      ramGb: 8,
      storageGb: 128,
      batteryMah: 4000,
      network: '5G',
      os: 'Android 14',
    },
    images: [
      'https://picsum.photos/seed/PHN201/600/450',
    ],
  },
  {
    id: 'AUD301',
    name: 'Sony WH-1000XM5',
    categoryId: 4, // Audio
    brand: 'Sony',
    description: 'Premium wireless noise-cancelling headphones with Auto NC Optimizer, crystal-clear hands-free calling, and 30-hour battery life.',
    price: 399.00,
    rating: 4.8,
    stockQty: 2, // LOW_STOCK
    specs: {
      type: 'Over-ear',
      noiseCancelling: true,
      batteryHours: 30,
      bluetoothVersion: '5.2',
      weightGrams: 250,
    },
    images: [
      'https://picsum.photos/seed/AUD301/600/450',
    ],
  },
  {
    id: 'SHN401',
    name: 'Nike Air Zoom Pegasus 40',
    categoryId: 6, // Footwear
    brand: 'Nike',
    description: 'Responsive daily running shoe with dual Zoom Air units and engineered mesh for a springy, comfortable stride.',
    price: 130.00,
    rating: 4.5,
    stockQty: 18,
    specs: {
      type: 'Running shoes',
      gender: 'Unisex',
      material: 'Engineered mesh',
      closure: 'Lace-up',
    },
    images: [
      'https://picsum.photos/seed/SHN401/600/450',
    ],
  },
  {
    id: 'SHN402',
    name: 'Adidas Ultraboost Light',
    categoryId: 6, // Footwear
    brand: 'Adidas',
    description: 'High-cushion performance shoes with lightweight BOOST midsole for exceptional energy return.',
    price: 190.00,
    rating: 4.4,
    stockQty: 3, // LOW_STOCK
    specs: {
      type: 'Running shoes',
      gender: 'Unisex',
      material: 'Primeknit+ TEXTILE',
      closure: 'Lace-up',
    },
    images: [
      'https://picsum.photos/seed/SHN402/600/450',
    ],
  },
  {
    id: 'BOK501',
    name: 'Designing Data-Intensive Applications',
    categoryId: 8, // Technology Books
    brand: "O'Reilly",
    description: 'The definitive guide to the principles and architectures behind modern reliable, scalable, and maintainable systems.',
    price: 45.00,
    rating: 4.9,
    stockQty: 30,
    specs: {
      author: 'Martin Kleppmann',
      pages: 616,
      format: 'Paperback',
      year: 2017,
      isbn: '978-1449373320',
    },
    images: [
      'https://picsum.photos/seed/BOK501/600/450',
    ],
  },
];

/**
 * Maps full product to catalog list item shape:
 * { id, name, brand, categoryId, price, rating, stockQty, availability, imageUrl }
 */
export function toCatalogItem(p) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    categoryId: p.categoryId,
    price: p.price,
    rating: p.rating,
    stockQty: p.stockQty,
    availability: computeAvailability(p.stockQty),
    imageUrl: p.images?.[0] || `https://picsum.photos/seed/${p.id}/600/450`,
  };
}

/**
 * Maps to full product detail shape:
 * item fields + { description, specs, images }
 */
export function toProductDetail(p) {
  const item = toCatalogItem(p);
  return {
    ...item,
    description: p.description,
    specs: p.specs || {},
    images: p.images || [item.imageUrl],
  };
}
