export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  imageUrl: string;
  categoryId: string;
  features: string[];
  inStock: boolean;
  bestSeller?: boolean;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export const categories: Category[] = [
  {
    id: 'skincare-tools',
    name: 'Skincare Tools',
    color: '#6366F1', // Indigo
  },
  {
    id: 'skincare-products',
    name: 'Skincare Products',
    color: '#8B5CF6', // Purple
  },
  {
    id: 'grooming',
    name: 'Grooming',
    color: '#10B981', // Green
  },
  {
    id: 'fitness',
    name: 'Fitness',
    color: '#F59E0B', // Amber
  },
  {
    id: 'supplements',
    name: 'Supplements',
    color: '#EC4899', // Pink
  },
  {
    id: 'style',
    name: 'Style',
    color: '#14B8A6', // Teal
  },
];

export const products: Product[] = [
  // Skincare Tools
  {
    id: 'dermaroller-0.5mm',
    name: 'Premium Dermaroller 0.5mm',
    description: 'High-quality dermaroller with 540 titanium micro-needles for facial rejuvenation. Stimulates collagen production and improves skin texture.',
    price: 24.99,
    discountPercentage: 15,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=500&auto=format&fit=crop',
    categoryId: 'skincare-tools',
    features: [
      '540 titanium micro-needles',
      '0.5mm needle length for facial use',
      'Stimulates collagen production',
      'Improves product absorption',
      'Includes storage case'
    ],
    inStock: true,
    bestSeller: true,
  },
  {
    id: 'jade-roller',
    name: 'Jade Facial Roller',
    description: 'Natural jade facial roller that helps reduce puffiness, improve circulation, and enhance product absorption. Provides cooling sensation for relaxation.',
    price: 19.99,
    discountPercentage: 0,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1628688375420-61455ad3a45c?q=80&w=500&auto=format&fit=crop',
    categoryId: 'skincare-tools',
    features: [
      'Natural jade stone',
      'Dual-ended for face and eye area',
      'Reduces puffiness',
      'Improves circulation',
      'Enhances product absorption'
    ],
    inStock: true,
  },
  {
    id: 'gua-sha',
    name: 'Rose Quartz Gua Sha Tool',
    description: 'Traditional facial massage tool made from rose quartz. Helps define facial contours, reduce tension, and promote lymphatic drainage.',
    price: 18.99,
    discountPercentage: 10,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1628688375420-61455ad3a45c?q=80&w=500&auto=format&fit=crop',
    categoryId: 'skincare-tools',
    features: [
      'Genuine rose quartz',
      'Improves facial contours',
      'Reduces facial tension',
      'Promotes lymphatic drainage',
      'Includes instruction guide'
    ],
    inStock: true,
  },
  
  // Skincare Products
  {
    id: 'vitamin-c-serum',
    name: 'Brightening Vitamin C Serum',
    description: 'Potent 20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and provides antioxidant protection.',
    price: 29.99,
    discountPercentage: 0,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    categoryId: 'skincare-products',
    features: [
      '20% Vitamin C concentration',
      'Contains hyaluronic acid',
      'Antioxidant protection',
      'Reduces dark spots',
      'Brightens complexion'
    ],
    inStock: true,
    bestSeller: true,
  },
  {
    id: 'retinol-cream',
    name: 'Advanced Retinol Night Cream',
    description: 'Powerful anti-aging night cream with 0.5% retinol. Reduces fine lines, improves skin texture, and promotes cell turnover while you sleep.',
    price: 34.99,
    discountPercentage: 5,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop',
    categoryId: 'skincare-products',
    features: [
      '0.5% retinol concentration',
      'Reduces fine lines and wrinkles',
      'Improves skin texture',
      'Promotes cell turnover',
      'Hydrating formula'
    ],
    inStock: true,
  },
  {
    id: 'hyaluronic-acid',
    name: 'Hydrating Hyaluronic Acid Serum',
    description: 'Intense hydration serum with multiple molecular weights of hyaluronic acid. Plumps skin, reduces fine lines, and provides long-lasting moisture.',
    price: 22.99,
    discountPercentage: 0,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    categoryId: 'skincare-products',
    features: [
      'Multiple molecular weights of hyaluronic acid',
      'Intense hydration',
      'Plumps skin',
      'Reduces fine lines',
      'Oil-free formula'
    ],
    inStock: true,
  },
  
  // Grooming
  {
    id: 'beard-trimmer',
    name: 'Precision Beard Trimmer',
    description: 'Professional-grade beard trimmer with multiple length settings. Provides precise trimming and shaping for perfect beard maintenance.',
    price: 49.99,
    discountPercentage: 10,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1621607150902-a7f7be0c0f0f?q=80&w=500&auto=format&fit=crop',
    categoryId: 'grooming',
    features: [
      '20 length settings',
      'Cordless operation',
      'Waterproof design',
      '90 minutes runtime',
      'Includes cleaning brush and oil'
    ],
    inStock: true,
    bestSeller: true,
  },
  {
    id: 'beard-oil',
    name: 'Premium Beard Oil',
    description: 'Nourishing beard oil with argan and jojoba oils. Softens beard hair, conditions skin, and reduces itchiness for a well-groomed appearance.',
    price: 18.99,
    discountPercentage: 0,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1621607150902-a7f7be0c0f0f?q=80&w=500&auto=format&fit=crop',
    categoryId: 'grooming',
    features: [
      'Contains argan and jojoba oils',
      'Softens beard hair',
      'Reduces itchiness',
      'Conditions skin',
      'Light woodsy scent'
    ],
    inStock: true,
  },
  {
    id: 'facial-cleanser',
    name: "Men's Facial Cleanser",
    description: 'Deep-cleansing face wash formulated specifically for men. Removes dirt, oil, and impurities without stripping skin of natural moisture.',
    price: 16.99,
    discountPercentage: 5,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=500&auto=format&fit=crop',
    categoryId: 'grooming',
    features: [
      'Deep cleansing formula',
      'Balances oil production',
      'Prevents breakouts',
      'Non-drying formula',
      'Suitable for daily use'
    ],
    inStock: true,
  },
  
  // Fitness
  {
    id: 'resistance-bands',
    name: 'Premium Resistance Bands Set',
    description: 'Set of 5 resistance bands with different tension levels. Perfect for strength training, muscle building, and rehabilitation exercises.',
    price: 29.99,
    discountPercentage: 15,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop',
    categoryId: 'fitness',
    features: [
      '5 resistance levels',
      'Made from durable latex',
      'Includes carrying case',
      'Door anchor included',
      'Exercise guide included'
    ],
    inStock: true,
  },
  {
    id: 'jaw-exerciser',
    name: 'Jawline Exerciser',
    description: 'Silicone jaw exerciser designed to strengthen jaw muscles and enhance definition. Helps improve facial appearance with regular use.',
    price: 19.99,
    discountPercentage: 0,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop',
    categoryId: 'fitness',
    features: [
      'Food-grade silicone',
      'Multiple resistance levels',
      'Strengthens jaw muscles',
      'Enhances jawline definition',
      'Includes carrying case'
    ],
    inStock: true,
    bestSeller: true,
  },
  {
    id: 'posture-corrector',
    name: 'Adjustable Posture Corrector',
    description: 'Comfortable posture corrector that helps align spine and shoulders. Improves appearance and reduces back pain from poor posture.',
    price: 24.99,
    discountPercentage: 10,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop',
    categoryId: 'fitness',
    features: [
      'Adjustable straps',
      'Breathable material',
      'Discreet under clothing',
      'Improves spine alignment',
      'Reduces back pain'
    ],
    inStock: true,
  },
  
  // Supplements
  {
    id: 'collagen-powder',
    name: 'Collagen Peptides Powder',
    description: 'High-quality collagen peptides for skin, hair, and joint health. Unflavored powder easily dissolves in beverages and supports skin elasticity.',
    price: 27.99,
    discountPercentage: 0,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=500&auto=format&fit=crop',
    categoryId: 'supplements',
    features: [
      'Type I & III collagen',
      'Grass-fed and pasture-raised source',
      'Supports skin elasticity',
      'Promotes hair strength',
      'Unflavored and easy to mix'
    ],
    inStock: true,
    bestSeller: true,
  },
  {
    id: 'biotin-supplement',
    name: 'High-Potency Biotin',
    description: '10,000mcg biotin supplement for hair, skin, and nail health. Supports keratin production and helps improve appearance from within.',
    price: 19.99,
    discountPercentage: 5,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=500&auto=format&fit=crop',
    categoryId: 'supplements',
    features: [
      '10,000mcg per serving',
      'Supports hair growth',
      'Strengthens nails',
      'Improves skin health',
      '60-day supply'
    ],
    inStock: true,
  },
  {
    id: 'protein-powder',
    name: 'Whey Protein Isolate',
    description: 'Premium whey protein isolate with 25g protein per serving. Supports muscle growth and recovery for improved physique and strength.',
    price: 39.99,
    discountPercentage: 10,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=500&auto=format&fit=crop',
    categoryId: 'supplements',
    features: [
      '25g protein per serving',
      'Low in carbs and fat',
      'Supports muscle growth',
      'Aids recovery',
      'Great taste'
    ],
    inStock: true,
  },
  
  // Style
  {
    id: 'minimalist-watch',
    name: 'Minimalist Stainless Steel Watch',
    description: 'Elegant minimalist watch with stainless steel case and mesh band. Elevates any outfit and adds a touch of sophistication to your appearance.',
    price: 79.99,
    discountPercentage: 15,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=500&auto=format&fit=crop',
    categoryId: 'style',
    features: [
      'Stainless steel case',
      'Mesh band',
      'Minimalist design',
      'Water-resistant',
      'Japanese quartz movement'
    ],
    inStock: true,
  },
  {
    id: 'leather-wallet',
    name: 'Genuine Leather Slim Wallet',
    description: 'Handcrafted slim wallet made from genuine leather. Features RFID blocking technology and elegant design for the modern man.',
    price: 34.99,
    discountPercentage: 0,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500&auto=format&fit=crop',
    categoryId: 'style',
    features: [
      'Genuine leather',
      'RFID blocking',
      'Slim profile',
      'Multiple card slots',
      'Handcrafted'
    ],
    inStock: true,
    bestSeller: true,
  },
  {
    id: 'sunglasses',
    name: 'Polarized Aviator Sunglasses',
    description: 'Classic aviator sunglasses with polarized lenses. Protects eyes from UV rays while adding a timeless style element to any outfit.',
    price: 49.99,
    discountPercentage: 10,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500&auto=format&fit=crop',
    categoryId: 'style',
    features: [
      'Polarized lenses',
      'UV400 protection',
      'Stainless steel frame',
      'Classic aviator design',
      'Includes case and cleaning cloth'
    ],
    inStock: true,
  },
];