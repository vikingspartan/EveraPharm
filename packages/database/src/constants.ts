export const DB_CONSTANTS = {
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    
    // Search
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    
    // Pricing
    DEFAULT_CURRENCY: 'USD',
    CURRENCY_CONVERSION_MARKUP: 0.02, // 2% markup on currency conversion
    
    // Orders
    DEFAULT_PAYMENT_TERMS: 30, // days
    ORDER_NUMBER_PREFIX: 'ORD',
    QUOTE_NUMBER_PREFIX: 'QUO',
    INVOICE_NUMBER_PREFIX: 'INV',
    
    // Documents
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    
    // Security
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_SALT_ROUNDS: 10,
    LOGIN_ATTEMPTS_LIMIT: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    
    // Inventory
    LOW_STOCK_THRESHOLD: 0.2, // 20% of reorder level
    
    // Cache TTL (seconds)
    CACHE_TTL: {
      PRODUCTS: 3600, // 1 hour
      CATEGORIES: 86400, // 24 hours
      PRICING: 900, // 15 minutes
      USER_SESSION: 3600, // 1 hour
    },
  } as const
  
  export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ] as const
  
  export const SUPPORTED_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  ] as const
  
  export const PHARMACEUTICAL_CATEGORIES = [
    {
      name: 'Antibiotics',
      subcategories: ['Penicillins', 'Cephalosporins', 'Macrolides', 'Fluoroquinolones', 'Tetracyclines'],
    },
    {
      name: 'Analgesics',
      subcategories: ['NSAIDs', 'Opioids', 'Acetaminophen', 'Muscle Relaxants'],
    },
    {
      name: 'Cardiovascular',
      subcategories: ['ACE Inhibitors', 'Beta Blockers', 'Calcium Channel Blockers', 'Diuretics', 'Statins'],
    },
    {
      name: 'Respiratory',
      subcategories: ['Bronchodilators', 'Corticosteroids', 'Antihistamines', 'Decongestants'],
    },
    {
      name: 'Gastrointestinal',
      subcategories: ['Antacids', 'Proton Pump Inhibitors', 'H2 Blockers', 'Laxatives', 'Antidiarrheals'],
    },
    {
      name: 'Endocrine',
      subcategories: ['Diabetes Medications', 'Thyroid Hormones', 'Corticosteroids'],
    },
    {
      name: 'Neurological',
      subcategories: ['Antidepressants', 'Antipsychotics', 'Anticonvulsants', 'Anxiolytics'],
    },
    {
      name: 'Dermatological',
      subcategories: ['Topical Steroids', 'Antifungals', 'Antibacterials', 'Retinoids'],
    },
  ] as const
  
  export const MEDICAL_DEVICE_CATEGORIES = [
    {
      name: 'Diagnostic Equipment',
      subcategories: ['Blood Glucose Meters', 'Blood Pressure Monitors', 'Thermometers', 'Pulse Oximeters'],
    },
    {
      name: 'Surgical Instruments',
      subcategories: ['Scalpels', 'Forceps', 'Scissors', 'Retractors', 'Needle Holders'],
    },
    {
      name: 'Personal Protective Equipment',
      subcategories: ['Gloves', 'Masks', 'Gowns', 'Face Shields', 'Goggles'],
    },
    {
      name: 'Wound Care',
      subcategories: ['Bandages', 'Gauze', 'Adhesive Tapes', 'Wound Dressings'],
    },
    {
      name: 'Injection Instruments',
      subcategories: ['Syringes', 'Needles', 'IV Catheters', 'Infusion Sets'],
    },
  ] as const
  
  export const SUPPLEMENT_CATEGORIES = [
    {
      name: 'Vitamins',
      subcategories: ['Multivitamins', 'Vitamin A', 'Vitamin B Complex', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
    },
    {
      name: 'Minerals',
      subcategories: ['Calcium', 'Iron', 'Magnesium', 'Zinc', 'Selenium'],
    },
    {
      name: 'Herbal Supplements',
      subcategories: ['Ginseng', 'Echinacea', 'Turmeric', 'Garlic', 'Ginkgo Biloba'],
    },
    {
      name: 'Specialty Formulas',
      subcategories: ['Immune Support', 'Joint Health', 'Heart Health', 'Brain Health', 'Digestive Health'],
    },
  ] as const
  
  export const DOSAGE_FORMS = [
    'Tablet',
    'Capsule',
    'Syrup',
    'Suspension',
    'Injection',
    'Cream',
    'Ointment',
    'Gel',
    'Drops',
    'Spray',
    'Powder',
    'Solution',
    'Suppository',
    'Patch',
    'Inhaler',
  ] as const
  
  export const CERTIFICATIONS = [
    'GMP',
    'ISO 9001',
    'ISO 13485',
    'CE Mark',
    'FDA Approved',
    'WHO Prequalified',
    'USFDA',
    'MHRA',
    'TGA',
    'Health Canada',
  ] as const
  
  export const PHARMACEUTICAL_STANDARDS = [
    'USP', // United States Pharmacopeia
    'BP', // British Pharmacopoeia
    'EP', // European Pharmacopoeia
    'IP', // Indian Pharmacopoeia
    'JP', // Japanese Pharmacopoeia
    'CP', // Chinese Pharmacopoeia
  ] as const