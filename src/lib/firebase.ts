import { supabase, isSupabaseConfigured } from './supabase';

export interface ProductVariant {
  color: string;
  price: number;
  originalPrice?: number;
  image?: string;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'cricket-bats' | 'cricket-balls' | 'cricket-gear' | 'hockey-sticks' | 'hockey-balls' | 'hockey-gear';
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  image: string;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  variants?: ProductVariant[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  category: string;
  quantity: number;
  notes: string;
  brandingRequired: boolean;
  createdAt: string;
  status?: 'pending' | 'contacted' | 'completed';
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Portfolio {
  id: string;
  slug: string;
  fullName: string;
  sport: 'cricket' | 'hockey' | 'both';
  role: string;
  age: number;
  city: string;
  state: string;
  profileImage: string;
  bio: string;
  achievements: string[];
  stats: Record<string, string>;
  experience: string;
  academy: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  editPin: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Seed catalog data populated from actual crawled content and enhanced with premium specs
const productsCatalog: Product[] = [
  {
    id: 'adrin-premium-hockey-ball',
    name: 'Adrin Premium Hockey Ball',
    category: 'hockey-balls',
    price: 129,
    originalPrice: 216,
    description: 'Expertly designed match-grade hockey ball with a dimpled, hard-gloss surface. Engineered for ultimate aerodynamic consistency on wet or dry turfs. Resists high-speed impacts without chipping.',
    features: [
      'Official size & weight regulation specs',
      'Advanced dimpled surface for aerodynamic precision',
      'High-gloss moisture-resistant outer coat',
      'Extreme impact resistance and shape retention'
    ],
    specifications: {
      'Material': 'Precision-engineered polyurethane formulation',
      'Structure': 'Cork and rubber dense composite core',
      'Surface': 'Precision molded dimpled texture',
      'Standard': 'Match grade certified'
    },
    image: '/images/hero_hockey.jpg', // Fallback to our high-quality asset
    rating: 4.8,
    reviewsCount: 34,
    isBestSeller: true,
    variants: [
      { color: 'Pure White', price: 129, originalPrice: 216 },
      { color: 'Electric Pink', price: 135, originalPrice: 220 },
      { color: 'Neon Lime', price: 149, originalPrice: 240 }
    ]
  },
  {
    id: 'adrin-i-10-pvc-wind-ball',
    name: 'Adrin i-10 PVC Wind Ball',
    category: 'cricket-balls',
    price: 139,
    originalPrice: 180,
    description: 'The definitive training and recreational wind ball. Features a highly pronounced raised seam for excellent finger grip and swing optimization. Formulated with our signature toxic-free polymer compound.',
    features: [
      'Heavy 110g weighted design simulates leather bounce',
      'Pronounced raised seam for realistic seam-bowling action',
      'Toxic-free, child-safe rubberized formula',
      'Waterproof structure suitable for all weather play'
    ],
    specifications: {
      'Weight': '110 grams +/- 3g',
      'Material': 'Safe Non-Toxic High-Elastic PVC',
      'Seam Type': 'Raised interlocking stitch seam',
      'Play Surface': 'Concrete, clay, turf, indoor'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.9,
    reviewsCount: 88,
    isBestSeller: true,
    variants: [
      { color: 'Electric Pink', price: 145, originalPrice: 190 },
      { color: 'Neon Yellow', price: 139, originalPrice: 180 },
      { color: 'High Vis White', price: 139, originalPrice: 180 }
    ]
  },
  {
    id: 'adrin-pro-composite-hockey-stick',
    name: 'Adrin Sports Pro Field Hockey Stick',
    category: 'hockey-sticks',
    price: 2999,
    originalPrice: 4000,
    description: 'Unleash devastating power and surgical precision. Built from high-impact fiberglass and premium composite overlays. Features a specialized low-bow shaft optimized for standard aerial play and swift drag flicks.',
    features: [
      'Fiberglass composite design for extreme vibration damping',
      'Low Bow profile (24mm curve at 250mm) for modern play',
      'Reinforced high-impact backhand zone',
      'Super-soft anti-slip grip with memory foam buffer'
    ],
    specifications: {
      'Composition': '75% Fiberglass, 20% Carbon-composite, 5% Aramid',
      'Bow Type': 'Low Bow - Modern Profile',
      'Size': '36.5 inch / 37.5 inch',
      'Weight': 'Lightweight (525g - 540g)'
    },
    image: '/images/hero_hockey.jpg',
    rating: 4.7,
    reviewsCount: 19,
    isNewArrival: true
  },
  {
    id: 'adrin-striker-pro-plastic-bat',
    name: 'ADRIN Striker Pro Plastic Cricket Bat',
    category: 'cricket-bats',
    price: 560,
    originalPrice: 700,
    description: 'Heavy-duty molded plastic cricket bat designed for tennis ball and wind ball play. Ergonomically shaped to maximize sweet spot velocity and impact threshold. Fully weather-resistant and warp-proof.',
    features: [
      'Engineered with premium reinforced impact-resistant PVC',
      'Ergonomic handle wrapped in premium sweat-absorbent grip',
      'Extended thick edges for maximum shot power',
      'Ideal for heavy-duty daily turf and street matches'
    ],
    specifications: {
      'Material': 'High-density impact-resistant polymers',
      'Sweet Spot': 'Mid-to-low high profile',
      'Handle': 'Full rubber-wrapped round cane format',
      'Ball Type': 'Tennis ball and PVC wind balls only'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.6,
    reviewsCount: 42,
    isNewArrival: true
  },
  {
    id: 'adrin-pvc-pink-seam-ball',
    name: 'Adrin PVC White Cricket Ball (Pink Seam)',
    category: 'cricket-balls',
    price: 169,
    originalPrice: 250,
    description: 'Specially engineered high-visibility white PVC training ball. The contrasting pink raised seam offers unmatched visual tracking for swing coaching and night-session academies.',
    features: [
      'Contrasting pink seam enables instant spin tracking',
      'Hollow core with micro-weighted compound for stable trajectory',
      'Extreme durability - outlasts standard leather balls 5x',
      'ISI Quality Certified manufacturing standards'
    ],
    specifications: {
      'Color': 'High-Visibility Match White',
      'Seam Color': 'Electric Pink Glow Seam',
      'Diameter': 'Official 72mm',
      'Weight': '115 grams'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.7,
    reviewsCount: 15
  },
  {
    id: 'adrin-elite-fiberglass-hockey-stick',
    name: 'Adrin Sports Field Hockey Stick',
    category: 'hockey-sticks',
    price: 1000,
    originalPrice: 4000,
    description: 'An outstanding entry-to-intermediate fiberglass composite stick. Provides excellent ball-feel, control, and massive structural integrity. Perfect for school leagues, academies, and clubs.',
    features: [
      'High-durability fiberglass construction',
      'Standard mid-bow shaft profile for multi-purpose playing styles',
      'Enhanced touch-surface coating on the head for superior trapping',
      '100% impact-tested and quality certified'
    ],
    specifications: {
      'Composition': '95% Premium Fiberglass, 5% Aramid structure',
      'Bow Type': 'Standard Mid Bow',
      'Length': '36.5 inch',
      'Flex Rating': 'Flexible (Forgiving impact response)'
    },
    image: '/images/hero_hockey.jpg',
    rating: 4.5,
    reviewsCount: 22,
    isNewArrival: true
  },
  {
    id: 'adrin-junior-lightweight-bat',
    name: 'Adrin Sports Junior Cricket Bat',
    category: 'cricket-bats',
    price: 799,
    originalPrice: 900,
    description: 'Specially scaled lightweight PVC bat tailored for kids and junior players. Designed to encourage correct hand-eye coordination and smooth swing strokes without heavy wrist fatigue.',
    features: [
      'Feather-light swing dynamics specifically for youngsters',
      'Shorter, narrow-profile handle with premium safety grip',
      'Rounded edges to prevent chips and ground scuffs',
      'Colorful modern decal styling'
    ],
    specifications: {
      'Weight Class': 'Ultra-Lightweight (Under 600 grams)',
      'Recommended Age': '6 to 14 Years',
      'Size Options': 'Size 3, Size 4, Size 5 available',
      'Body': 'Premium high-rigidity non-shatter PVC'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.8,
    reviewsCount: 29
  },
  {
    id: 'adrin-plain-hockey-ball',
    name: 'Adrin Plain Hockey Ball (Smooth)',
    category: 'hockey-balls',
    price: 128,
    originalPrice: 200,
    description: 'Perfect high-gloss smooth surface training hockey ball. Standard weight, meeting national academy specs. Delivers reliable rolling trajectories on sand-dressed and traditional grass fields.',
    features: [
      'Super high-gloss finish resists grass/sand stains',
      'Smooth official weight molding',
      'Exceptional toughness and bounce predictability',
      'Certified non-toxic composition'
    ],
    specifications: {
      'Material': 'High-Gloss Hardened Polymer',
      'Diameter': '71.5mm',
      'Structure': 'Hollow dense-wall core',
      'Certified': 'Yes - Academic Grade'
    },
    image: '/images/hero_hockey.jpg',
    rating: 4.4,
    reviewsCount: 11
  },
  {
    id: 'adrin-play-to-win-bat',
    name: 'Adrin Play to Win PVC Cricket Bat',
    category: 'cricket-bats',
    price: 699,
    originalPrice: 800,
    description: 'Advanced adult-sized performance PVC cricket bat. Carefully weighted to mimic premium Kashmir willow profile while retaining structural invulnerability against rough concrete play and wind balls.',
    features: [
      'Full-size adult handle with double vulcanized grip wrapper',
      'Perfect weight distribution for balanced power swings',
      'Solid reinforced core handles heavy winds and tennis speed impacts',
      'Includes custom protective slipcase'
    ],
    specifications: {
      'Size': 'Full Size (Short Handle)',
      'Total Weight': '820 grams +/- 10g',
      'Body Composition': 'Structural impact-absorbing polycarbonate blend',
      'Edge Thickness': '38mm massive edge'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.7,
    reviewsCount: 51,
    isNewArrival: true
  },
  {
    id: 'adrin-pro-wicket-keeping-kit',
    name: 'Adrin Pro Wicket Keeping Kit',
    category: 'cricket-gear',
    price: 1499,
    originalPrice: 2199,
    description: 'Professional wicket keeping bundle featuring premium dynamic range guards and gloves. Spliced from reinforced leatherette, carbon shielding inserts, and comfortable ventilated mesh lining.',
    features: [
      'High-impact padded leg guards with quick-release buckles',
      'Reinforced finger protective cups on keeping gloves',
      'Super-soft interior sweat-absorbing fabric layer',
      'Meets club tournament protection parameters'
    ],
    specifications: {
      'Include': '1 Pair Leg Guards, 1 Pair Gloves, 1 Pair Inner Gloves',
      'Size': 'Adult Standard / Youth Standard',
      'Material': 'Poly-urethane face, impact foam core'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.8,
    reviewsCount: 18
  },
  {
    id: 'adrin-club-batting-gloves',
    name: 'Adrin Elite Club Batting Gloves',
    category: 'cricket-gear',
    price: 499,
    originalPrice: 750,
    description: 'High-comfort batting gloves featuring structured foam blocks for impact distribution. Reinforced sheepskin palms provide absolute grip control in hot, humid conditions.',
    features: [
      'Dual-split finger blocks for enhanced mobility',
      'Mesh cooling panels along fingers',
      'Towelled elastic wrist band with heavy-duty Velcro closure',
      'Extra leather reinforcement on wear zones'
    ],
    specifications: {
      'Palm Material': 'Premium textured sheepskin',
      'Finger Inserts': 'High-density absorption foam overlay',
      'Size': 'Adult Right-Hand / Left-Hand configurations'
    },
    image: '/images/hero_cricket.jpg',
    rating: 4.6,
    reviewsCount: 27
  },
  {
    id: 'adrin-armored-hockey-shinguards',
    name: 'Adrin Armored Field Hockey Shinguards',
    category: 'hockey-gear',
    price: 349,
    originalPrice: 599,
    description: 'Full-protection ankle-to-knee athletic shinguards. Molded hard-shell PP shield stands up to direct hockey stick strikes. Thick shock-absorbing foam lining ensures comfortable play.',
    features: [
      'Anatomically contoured left/right leg specific fit',
      'Reinforced ventilation slots to limit heat buildup',
      'Double elastic straps with high grip adjustments',
      'Impact-resistant Polypropylene armor plate'
    ],
    specifications: {
      'Shell': 'Premium high impact Polypropylene (PP)',
      'Lining': '12mm compressed EVA cushioning foam',
      'Fit': 'Double strap ergonomic calf wrapping'
    },
    image: '/images/hero_hockey.jpg',
    rating: 4.7,
    reviewsCount: 16
  }
];

// Helper functions that represent Database interactions (dynamically fall back/read from LocalStorage)
const mapDbProductToProduct = (dbProd: any): Product => {
  return {
    id: dbProd.id,
    name: dbProd.name,
    category: dbProd.category,
    price: Number(dbProd.price),
    originalPrice: Number(dbProd.original_price !== undefined ? dbProd.original_price : (dbProd.originalPrice || dbProd.price)),
    description: dbProd.description,
    features: Array.isArray(dbProd.features) ? dbProd.features : [],
    specifications: typeof dbProd.specifications === 'string' 
      ? JSON.parse(dbProd.specifications) 
      : (dbProd.specifications || {}),
    image: dbProd.image,
    rating: Number(dbProd.rating || 5.0),
    reviewsCount: Number(dbProd.reviews_count !== undefined ? dbProd.reviews_count : (dbProd.reviewsCount || 0)),
    isBestSeller: !!(dbProd.is_best_seller || dbProd.isBestSeller),
    isNewArrival: !!(dbProd.is_new_arrival || dbProd.isNewArrival),
    variants: Array.isArray(dbProd.variants) ? dbProd.variants : (dbProd.variants ? (typeof dbProd.variants === 'string' ? JSON.parse(dbProd.variants) : dbProd.variants) : undefined)
  };
};

export const db = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured) {
      return productsCatalog;
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapDbProductToProduct);
      }
    } catch (err) {
      console.warn('Supabase getProducts error, falling back to mock catalog:', err);
    }
    return productsCatalog;
  },

  // Get single product
  getProductById: async (id: string): Promise<Product | null> => {
    if (!isSupabaseConfigured) {
      return productsCatalog.find(p => p.id === id) || null;
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return mapDbProductToProduct(data);
      }
    } catch (err) {
      console.warn(`Supabase getProductById(${id}) error, falling back to mock catalog:`, err);
    }
    return productsCatalog.find(p => p.id === id) || null;
  },

  // Search and filter products
  queryProducts: async (filters: {
    category?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> => {
    const getLocalResult = () => {
      let result = [...productsCatalog];

      if (filters.category && filters.category !== 'all') {
        result = result.filter(p => p.category === filters.category || p.category.split('-')[0] === filters.category);
      }

      if (filters.searchQuery) {
        const queryStr = filters.searchQuery.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(queryStr) || 
          p.description.toLowerCase().includes(queryStr) ||
          p.features.some(f => f.toLowerCase().includes(queryStr))
        );
      }

      if (filters.minPrice !== undefined) {
        result = result.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        result = result.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.sort) {
        if (filters.sort === 'price-low') {
          result.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'price-high') {
          result.sort((a, b) => b.price - a.price);
        } else if (filters.sort === 'rating') {
          result.sort((a, b) => b.rating - a.rating);
        }
      }
      return result;
    };

    if (!isSupabaseConfigured) {
      return getLocalResult();
    }

    try {
      let query = supabase.from('products').select('*');

      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'cricket' || filters.category === 'hockey') {
          query = query.like('category', `${filters.category}%`);
        } else {
          query = query.eq('category', filters.category);
        }
      }

      if (filters.searchQuery) {
        const term = filters.searchQuery.toLowerCase();
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.sort) {
        if (filters.sort === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (filters.sort === 'price-high') {
          query = query.order('price', { ascending: false });
        } else if (filters.sort === 'rating') {
          query = query.order('rating', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapDbProductToProduct);
      }
    } catch (err) {
      console.warn('Supabase queryProducts error, falling back to mock query logic:', err);
    }

    return getLocalResult();
  },
  // Submit Bulk Inquiry (Saves in Supabase and falls back to LocalStorage)
  submitInquiry: async (inquiryData: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> => {
    const tempId = 'inq-' + Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: tempId,
      createdAt,
      status: inquiryData.status || 'pending'
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('adrin_inquiries');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newInquiry);
      localStorage.setItem('adrin_inquiries', JSON.stringify(list));
    }

    if (!isSupabaseConfigured) {
      return newInquiry;
    }

    try {
      const dbInquiry = {
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        organization: inquiryData.organization,
        category: inquiryData.category,
        quantity: Number(inquiryData.quantity),
        notes: inquiryData.notes,
        branding_required: !!inquiryData.brandingRequired,
        status: inquiryData.status || 'pending'
      };

      const { data, error } = await supabase
        .from('inquiries')
        .insert([dbInquiry])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        console.log('Supabase Sync - Successfully saved Inquiry:', data);
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          organization: data.organization,
          category: data.category,
          quantity: data.quantity,
          notes: data.notes,
          brandingRequired: data.branding_required,
          createdAt: data.created_at,
          status: data.status || 'pending'
        };
      }
    } catch (err) {
      console.warn('Supabase submitInquiry error, saved locally in localStorage:', err);
    }

    return newInquiry;
  },

  // Get Submitted Inquiries
  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          organization: item.organization,
          category: item.category,
          quantity: item.quantity,
          notes: item.notes,
          brandingRequired: item.branding_required,
          createdAt: item.created_at,
          status: item.status || 'pending'
        }));
      }
    } catch (err) {
      console.warn('Supabase getInquiries error, returning local inquiries:', err);
    }

    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const existing = localStorage.getItem('adrin_inquiries');
        resolve(existing ? JSON.parse(existing) : []);
      } else {
        resolve([]);
      }
    });
  },

  // Update Inquiry Status (Admin CRUD)
  updateInquiryStatus: async (id: string, status: 'pending' | 'contacted' | 'completed'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase updateInquiryStatus error, updating locally in localStorage:', err);
    }

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('adrin_inquiries');
      if (existing) {
        try {
          const list = JSON.parse(existing);
          const idx = list.findIndex((item: any) => item.id === id);
          if (idx > -1) {
            list[idx].status = status;
            localStorage.setItem('adrin_inquiries', JSON.stringify(list));
            return true;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return true;
  },

  // Add Product Review (Saves in Supabase and falls back to LocalStorage)
  addReview: async (productId: string, reviewData: { name: string; rating: number; comment: string }): Promise<Review> => {
    const tempId = 'rev-' + Math.random().toString(36).substring(2, 9);
    const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const newReview: Review = {
      id: tempId,
      productId,
      reviewerName: reviewData.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: dateStr
    };

    if (typeof window !== 'undefined') {
      const key = `adrin_reviews_${productId}`;
      const existing = localStorage.getItem(key);
      const list = existing ? JSON.parse(existing) : [];
      list.push(newReview);
      localStorage.setItem(key, JSON.stringify(list));
    }

    if (!isSupabaseConfigured) {
      return newReview;
    }

    try {
      const dbReview = {
        product_id: productId,
        reviewer_name: reviewData.name,
        rating: Number(reviewData.rating),
        comment: reviewData.comment
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert([dbReview])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        console.log('Supabase Sync - Successfully added Review:', data);
        return {
          id: data.id,
          productId: data.product_id,
          reviewerName: data.reviewer_name,
          rating: data.rating,
          comment: data.comment,
          date: new Date(data.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        };
      }
    } catch (err) {
      console.warn('Supabase addReview error, saved locally in localStorage:', err);
    }

    return newReview;
  },

  // Get Product Reviews
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const defaultReviews: Review[] = [
      {
        id: 'default-1',
        productId,
        reviewerName: 'Rohit Singh (Academy Captain)',
        rating: 5,
        comment: 'Perfect seam, bounce, and outstanding durability. Perfect for practice and match play.',
        date: '10 January 2026'
      },
      {
        id: 'default-2',
        productId,
        reviewerName: 'Coach Harpreet Kaur',
        rating: 5,
        comment: 'The balance and dynamic grip feedback are incredible. Excellent build quality!',
        date: '02 February 2026'
      }
    ];

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        const dbReviews = data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          reviewerName: item.reviewer_name,
          rating: item.rating,
          comment: item.comment,
          date: new Date(item.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        }));
        return [...defaultReviews, ...dbReviews];
      }
    } catch (err) {
      console.warn('Supabase getProductReviews error, returning merged defaults & localStorage reviews:', err);
    }

    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const key = `adrin_reviews_${productId}`;
        const existing = localStorage.getItem(key);
        const stored = existing ? JSON.parse(existing) : [];
        resolve([...defaultReviews, ...stored]);
      } else {
        resolve(defaultReviews);
      }
    });
  },

  // Get All Reviews (Admin Portal)
  getAllReviews: async (): Promise<Review[]> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        return data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          reviewerName: item.reviewer_name,
          rating: item.rating,
          comment: item.comment,
          date: new Date(item.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        }));
      }
    } catch (err) {
      console.warn('Supabase getAllReviews error, gathering reviews from localStorage or seeds:', err);
    }

    // Fallback: merge default reviews for all products in catalog + localStorage reviews
    let allReviews: Review[] = [];
    productsCatalog.forEach(p => {
      const defaultReviews: Review[] = [
        {
          id: `default-${p.id}-1`,
          productId: p.id,
          reviewerName: 'Rohit Singh (Academy Captain)',
          rating: 5,
          comment: `Perfect seam, bounce, and outstanding durability for ${p.name}. Perfect for practice and match play.`,
          date: '10 January 2026'
        },
        {
          id: `default-${p.id}-2`,
          productId: p.id,
          reviewerName: 'Coach Harpreet Kaur',
          rating: 5,
          comment: `The balance and dynamic grip feedback are incredible on ${p.name}. Excellent build quality!`,
          date: '02 February 2026'
        }
      ];
      allReviews = [...allReviews, ...defaultReviews];
      
      if (typeof window !== 'undefined') {
        const key = `adrin_reviews_${p.id}`;
        const existing = localStorage.getItem(key);
        if (existing) {
          try {
            const stored = JSON.parse(existing);
            allReviews = [...allReviews, ...stored];
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
    return allReviews;
  },

  // Delete Review (Admin Portal)
  deleteReview: async (id: string, productId?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase deleteReview error, deleting from localStorage:', err);
    }

    if (typeof window !== 'undefined') {
      if (productId) {
        const key = `adrin_reviews_${productId}`;
        const existing = localStorage.getItem(key);
        if (existing) {
          try {
            const list = JSON.parse(existing);
            const idx = list.findIndex((item: any) => item.id === id);
            if (idx > -1) {
              list.splice(idx, 1);
              localStorage.setItem(key, JSON.stringify(list));
              return true;
            }
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        productsCatalog.forEach(p => {
          const key = `adrin_reviews_${p.id}`;
          const existing = localStorage.getItem(key);
          if (existing) {
            try {
              const list = JSON.parse(existing);
              const idx = list.findIndex((item: any) => item.id === id);
              if (idx > -1) {
                list.splice(idx, 1);
                localStorage.setItem(key, JSON.stringify(list));
              }
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
    }
    return true;
  },

  // Create Product (Admin CRUD)
  createProduct: async (productData: Omit<Product, 'rating' | 'reviewsCount'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      rating: 5.0,
      reviewsCount: 0
    };
    try {
      const dbProd = {
        id: productData.id,
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        original_price: Number(productData.originalPrice),
        description: productData.description,
        features: productData.features,
        specifications: productData.specifications,
        image: productData.image,
        rating: 5.0,
        reviews_count: 0,
        is_best_seller: !!productData.isBestSeller,
        is_new_arrival: !!productData.isNewArrival,
        variants: productData.variants || []
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProd])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        return mapDbProductToProduct(data);
      }
    } catch (err) {
      console.warn('Supabase createProduct error, saving locally in-memory catalog fallback:', err);
    }
    productsCatalog.unshift(newProduct);
    return newProduct;
  },

  // Update Product (Admin CRUD)
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const dbUpdate: any = {};
      if (productData.name !== undefined) dbUpdate.name = productData.name;
      if (productData.category !== undefined) dbUpdate.category = productData.category;
      if (productData.price !== undefined) dbUpdate.price = Number(productData.price);
      if (productData.originalPrice !== undefined) dbUpdate.original_price = Number(productData.originalPrice);
      if (productData.description !== undefined) dbUpdate.description = productData.description;
      if (productData.features !== undefined) dbUpdate.features = productData.features;
      if (productData.specifications !== undefined) dbUpdate.specifications = productData.specifications;
      if (productData.image !== undefined) dbUpdate.image = productData.image;
      if (productData.isBestSeller !== undefined) dbUpdate.is_best_seller = !!productData.isBestSeller;
      if (productData.isNewArrival !== undefined) dbUpdate.is_new_arrival = !!productData.isNewArrival;
      if (productData.variants !== undefined) dbUpdate.variants = productData.variants;

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const updated = mapDbProductToProduct(data);
        const idx = productsCatalog.findIndex(p => p.id === id);
        if (idx > -1) productsCatalog[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.warn('Supabase updateProduct error, updating in-memory catalog:', err);
    }

    const idx = productsCatalog.findIndex(p => p.id === id);
    if (idx > -1) {
      productsCatalog[idx] = { ...productsCatalog[idx], ...productData };
      return productsCatalog[idx];
    }
    throw new Error('Product not found');
  },

  // Delete Product (Admin CRUD)
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const idx = productsCatalog.findIndex(p => p.id === id);
      if (idx > -1) productsCatalog.splice(idx, 1);
      return true;
    } catch (err) {
      console.warn('Supabase deleteProduct error, deleting from memory:', err);
    }

    const idx = productsCatalog.findIndex(p => p.id === id);
    if (idx > -1) {
      productsCatalog.splice(idx, 1);
      return true;
    }
    return false;
  },

  // ==========================================
  // Portfolio CRUD Methods
  // ==========================================

  // Create Portfolio
  createPortfolio: async (data: Omit<Portfolio, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Portfolio> => {
    const id = `portfolio-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const slug = generateSlug(data.fullName, data.city);
    const now = new Date().toISOString();

    const portfolio: Portfolio = {
      ...data,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const dbInsert = {
        id: portfolio.id,
        slug: portfolio.slug,
        full_name: portfolio.fullName,
        sport: portfolio.sport,
        role: portfolio.role,
        age: portfolio.age,
        city: portfolio.city,
        state: portfolio.state,
        profile_image: portfolio.profileImage,
        bio: portfolio.bio,
        achievements: portfolio.achievements,
        stats: portfolio.stats,
        experience: portfolio.experience,
        academy: portfolio.academy,
        contact_email: portfolio.contactEmail || null,
        contact_phone: portfolio.contactPhone || null,
        social_links: portfolio.socialLinks || null,
        edit_pin: portfolio.editPin,
        is_public: portfolio.isPublic,
        created_at: portfolio.createdAt,
        updated_at: portfolio.updatedAt,
      };

      const { error } = await supabase.from('portfolios').insert([dbInsert]);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase createPortfolio error, saving to localStorage:', err);
    }

    // Always save to localStorage as fallback/cache
    const stored = getStoredPortfolios();
    stored.push(portfolio);
    localStorage.setItem('adrin_portfolios', JSON.stringify(stored));

    return portfolio;
  },

  // Get Portfolio by Slug
  getPortfolioBySlug: async (slug: string): Promise<Portfolio | null> => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (data) return mapDbPortfolioToPortfolio(data);
    } catch (err) {
      console.warn('Supabase getPortfolioBySlug error, falling back to localStorage:', err);
    }

    const stored = getStoredPortfolios();
    return stored.find(p => p.slug === slug) || null;
  },

  // Get Portfolio by ID
  getPortfolioById: async (id: string): Promise<Portfolio | null> => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) return mapDbPortfolioToPortfolio(data);
    } catch (err) {
      console.warn('Supabase getPortfolioById error, falling back to localStorage:', err);
    }

    const stored = getStoredPortfolios();
    return stored.find(p => p.id === id) || null;
  },

  // Get All Public Portfolios
  getAllPortfolios: async (): Promise<Portfolio[]> => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapDbPortfolioToPortfolio);
      }
    } catch (err) {
      console.warn('Supabase getAllPortfolios error, falling back to localStorage:', err);
    }

    const stored = getStoredPortfolios();
    return stored.filter(p => p.isPublic);
  },

  // Search Portfolios
  searchPortfolios: async (filters: {
    searchQuery?: string;
    sport?: string;
    city?: string;
    role?: string;
  }): Promise<Portfolio[]> => {
    try {
      let query = supabase.from('portfolios').select('*').eq('is_public', true);

      if (filters.sport && filters.sport !== 'all') {
        query = query.eq('sport', filters.sport);
      }

      if (filters.searchQuery) {
        const term = filters.searchQuery.toLowerCase();
        query = query.or(`full_name.ilike.%${term}%,city.ilike.%${term}%,role.ilike.%${term}%,academy.ilike.%${term}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(mapDbPortfolioToPortfolio);
      }
    } catch (err) {
      console.warn('Supabase searchPortfolios error, falling back to localStorage:', err);
    }

    // LocalStorage fallback
    let results = getStoredPortfolios().filter(p => p.isPublic);

    if (filters.sport && filters.sport !== 'all') {
      results = results.filter(p => p.sport === filters.sport || p.sport === 'both');
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.academy.toLowerCase().includes(q)
      );
    }

    if (filters.city) {
      const c = filters.city.toLowerCase();
      results = results.filter(p => p.city.toLowerCase().includes(c));
    }

    if (filters.role) {
      results = results.filter(p => p.role.toLowerCase().includes(filters.role!.toLowerCase()));
    }

    return results;
  },

  // Update Portfolio (requires correct PIN)
  updatePortfolio: async (id: string, pin: string, data: Partial<Portfolio>): Promise<Portfolio> => {
    // Verify PIN first
    const existing = await db.getPortfolioById(id);
    if (!existing) throw new Error('Portfolio not found');
    if (existing.editPin !== pin) throw new Error('Invalid PIN');

    const updatedData = { ...existing, ...data, updatedAt: new Date().toISOString() };

    try {
      const dbUpdate: Record<string, unknown> = { updated_at: updatedData.updatedAt };
      if (data.fullName !== undefined) dbUpdate.full_name = data.fullName;
      if (data.sport !== undefined) dbUpdate.sport = data.sport;
      if (data.role !== undefined) dbUpdate.role = data.role;
      if (data.age !== undefined) dbUpdate.age = data.age;
      if (data.city !== undefined) dbUpdate.city = data.city;
      if (data.state !== undefined) dbUpdate.state = data.state;
      if (data.profileImage !== undefined) dbUpdate.profile_image = data.profileImage;
      if (data.bio !== undefined) dbUpdate.bio = data.bio;
      if (data.achievements !== undefined) dbUpdate.achievements = data.achievements;
      if (data.stats !== undefined) dbUpdate.stats = data.stats;
      if (data.experience !== undefined) dbUpdate.experience = data.experience;
      if (data.academy !== undefined) dbUpdate.academy = data.academy;
      if (data.contactEmail !== undefined) dbUpdate.contact_email = data.contactEmail;
      if (data.contactPhone !== undefined) dbUpdate.contact_phone = data.contactPhone;
      if (data.socialLinks !== undefined) dbUpdate.social_links = data.socialLinks;
      if (data.isPublic !== undefined) dbUpdate.is_public = data.isPublic;

      const { error } = await supabase.from('portfolios').update(dbUpdate).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase updatePortfolio error, updating localStorage:', err);
    }

    // Update localStorage
    const stored = getStoredPortfolios();
    const idx = stored.findIndex(p => p.id === id);
    if (idx > -1) {
      stored[idx] = updatedData;
    } else {
      stored.push(updatedData);
    }
    localStorage.setItem('adrin_portfolios', JSON.stringify(stored));

    return updatedData;
  },

  // Delete Portfolio (requires correct PIN)
  deletePortfolio: async (id: string, pin: string): Promise<boolean> => {
    const existing = await db.getPortfolioById(id);
    if (!existing) throw new Error('Portfolio not found');
    if (existing.editPin !== pin) throw new Error('Invalid PIN');

    try {
      const { error } = await supabase.from('portfolios').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase deletePortfolio error, deleting from localStorage:', err);
    }

    const stored = getStoredPortfolios();
    const filtered = stored.filter(p => p.id !== id);
    localStorage.setItem('adrin_portfolios', JSON.stringify(filtered));
    return true;
  },
};

// ==========================================
// Portfolio Helper Functions
// ==========================================

function generateSlug(name: string, city: string): string {
  const base = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

function getStoredPortfolios(): Portfolio[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('adrin_portfolios');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function mapDbPortfolioToPortfolio(data: Record<string, unknown>): Portfolio {
  return {
    id: data.id as string,
    slug: data.slug as string,
    fullName: (data.full_name || data.fullName || '') as string,
    sport: (data.sport || 'cricket') as Portfolio['sport'],
    role: (data.role || '') as string,
    age: Number(data.age) || 0,
    city: (data.city || '') as string,
    state: (data.state || '') as string,
    profileImage: (data.profile_image || data.profileImage || '') as string,
    bio: (data.bio || '') as string,
    achievements: (data.achievements || []) as string[],
    stats: (data.stats || {}) as Record<string, string>,
    experience: (data.experience || '') as string,
    academy: (data.academy || '') as string,
    contactEmail: (data.contact_email || data.contactEmail || '') as string,
    contactPhone: (data.contact_phone || data.contactPhone || '') as string,
    socialLinks: (data.social_links || data.socialLinks || {}) as Portfolio['socialLinks'],
    editPin: (data.edit_pin || data.editPin || '') as string,
    isPublic: data.is_public !== undefined ? !!data.is_public : data.isPublic !== undefined ? !!data.isPublic : true,
    createdAt: (data.created_at || data.createdAt || new Date().toISOString()) as string,
    updatedAt: (data.updated_at || data.updatedAt || new Date().toISOString()) as string,
  };
}

