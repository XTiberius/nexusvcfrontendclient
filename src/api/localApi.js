// Base44 removed: use local offline API (no auth redirects).
// This is a localStorage-backed implementation that works offline without authentication.

const STORAGE_KEYS = {
  companies: 'bbwallet:companies:v1',
  deals: 'bbwallet:deals:v1',
  investments: 'bbwallet:investments:v1',
  entities: 'bbwallet:entities:v1',
  ndas: 'bbwallet:ndas:v1',
  accessRequests: 'bbwallet:accessRequests:v1',
  user: 'bbwallet:user:v1',
  auth: 'bbwallet:auth:v1',
};

// Helper to safely get/set localStorage
const storage = {
  get: (key, defaultValue = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Failed to read ${key} from localStorage:`, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Failed to write ${key} to localStorage:`, e);
      return false;
    }
  },
};

// Generate a simple ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Initialize with sample data if storage is empty
const initializeSampleData = () => {
  if (storage.get(STORAGE_KEYS.companies).length === 0) {
    const sampleCompanies = [
      {
        id: 'company-1',
        name: 'Neural Dynamics',
        sector: 'AI/ML',
        stage: 'Series B',
        description: 'Advanced AI research company',
        long_description: 'Neural Dynamics is pioneering the next generation of artificial intelligence through breakthrough research in neural networks and machine learning.',
        logo_url: null,
        headquarters: 'San Francisco, CA',
        website: 'https://example.com',
        founded_year: 2020,
        team_size: 150,
        total_raised: 45,
        status: 'active',
        is_featured: true,
        key_investors: ['Sequoia Capital', 'Andreessen Horowitz', 'Y Combinator'],
      },
      {
        id: 'company-2',
        name: 'Quantum Systems',
        sector: 'Deep Tech',
        stage: 'Series A',
        description: 'Quantum computing solutions',
        long_description: 'Quantum Systems is developing practical quantum computing applications for enterprise use.',
        logo_url: null,
        headquarters: 'Boston, MA',
        website: 'https://example.com',
        founded_year: 2019,
        team_size: 80,
        total_raised: 25,
        status: 'active',
        is_featured: false,
        key_investors: ['Lightspeed Ventures'],
      },
    ];
    storage.set(STORAGE_KEYS.companies, sampleCompanies);
  }

  if (storage.get(STORAGE_KEYS.deals).length === 0) {
    const sampleDeals = [
      {
        id: 'deal-1',
        company_id: 'company-1',
        title: 'Secondary Market Opportunity - Neural Dynamics',
        deal_type: 'Secondary',
        status: 'open',
        access_level: 'public',
        minimum_investment: 25000,
        implied_valuation: 500,
        share_price: 12.50,
        last_round_price: 10.00,
        closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        allocation_remaining: 5000000,
        highlights: [
          'Strong revenue growth trajectory',
          'Experienced leadership team',
          'Large addressable market',
        ],
      },
      {
        id: 'deal-2',
        company_id: 'company-2',
        title: 'Primary Round - Quantum Systems',
        deal_type: 'Primary',
        status: 'open',
        access_level: 'public',
        minimum_investment: 50000,
        implied_valuation: 200,
        share_price: 8.00,
        closing_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        allocation_remaining: 2000000,
        highlights: [
          'Breakthrough technology',
          'Strategic partnerships',
        ],
      },
    ];
    storage.set(STORAGE_KEYS.deals, sampleDeals);
  }
};

// Initialize on load
initializeSampleData();

// Entity base class
class EntityAPI {
  constructor(entityType, storageKey) {
    this.entityType = entityType;
    this.storageKey = storageKey;
  }

  list(sortBy = '-created_date', limit = 100) {
    let items = storage.get(this.storageKey, []);
    
    // Simple sorting (assuming created_date field)
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      items.sort((a, b) => {
        const aVal = a[field] || a.created_date || 0;
        const bVal = b[field] || b.created_date || 0;
        return bVal > aVal ? 1 : -1;
      });
    } else {
      const field = sortBy;
      items.sort((a, b) => {
        const aVal = a[field] || a.created_date || 0;
        const bVal = b[field] || b.created_date || 0;
        return aVal > bVal ? 1 : -1;
      });
    }
    
    return Promise.resolve(items.slice(0, limit));
  }

  filter(filters = {}, sortBy = '-created_date', limit = 100) {
    let items = storage.get(this.storageKey, []);
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      items = items.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          return item[key] === value;
        });
      });
    }
    
    // Apply sorting
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      items.sort((a, b) => {
        const aVal = a[field] || a.created_date || 0;
        const bVal = b[field] || b.created_date || 0;
        return bVal > aVal ? 1 : -1;
      });
    } else {
      const field = sortBy;
      items.sort((a, b) => {
        const aVal = a[field] || a.created_date || 0;
        const bVal = b[field] || b.created_date || 0;
        return aVal > bVal ? 1 : -1;
      });
    }
    
    return Promise.resolve(items.slice(0, limit));
  }

  create(data) {
    const items = storage.get(this.storageKey, []);
    const newItem = {
      ...data,
      id: data.id || generateId(),
      created_date: data.created_date || new Date().toISOString(),
      created_by: data.created_by || 'local-user@example.com',
    };
    items.push(newItem);
    storage.set(this.storageKey, items);
    return Promise.resolve(newItem);
  }
}

// Auth mock
const auth = {
  isAuthenticated: async () => {
    const authData = storage.get(STORAGE_KEYS.auth, {});
    return !!authData.isAuthenticated;
  },

  me: async () => {
    const user = storage.get(STORAGE_KEYS.user, null);
    if (user) {
      return user;
    }
    // Return a default user if none exists
    const defaultUser = {
      email: 'local-user@example.com',
      full_name: 'Local User',
      role: 'investor',
    };
    storage.set(STORAGE_KEYS.user, defaultUser);
    return defaultUser;
  },

  logout: () => {
    storage.set(STORAGE_KEYS.auth, { isAuthenticated: false });
    storage.set(STORAGE_KEYS.user, null);
    return Promise.resolve();
  },

  redirectToLogin: () => {
    // In local mode, just set as authenticated
    const defaultUser = {
      email: 'local-user@example.com',
      full_name: 'Local User',
      role: 'investor',
    };
    storage.set(STORAGE_KEYS.auth, { isAuthenticated: true });
    storage.set(STORAGE_KEYS.user, defaultUser);
    // Optionally reload to reflect auth state
    window.location.reload();
  },
};

// Export entities
export const Company = new EntityAPI('Company', STORAGE_KEYS.companies);
export const Deal = new EntityAPI('Deal', STORAGE_KEYS.deals);
export const Investment = new EntityAPI('Investment', STORAGE_KEYS.investments);
const EntityInstance = new EntityAPI('Entity', STORAGE_KEYS.entities);
export { EntityInstance as Entity };
export const NDA = new EntityAPI('NDA', STORAGE_KEYS.ndas);
export const AccessRequest = new EntityAPI('AccessRequest', STORAGE_KEYS.accessRequests);

// Export auth
export const User = auth;

// Export a mock base44-like object for compatibility
export const localApi = {
  entities: {
    Company,
    Deal,
    Investment,
    Entity: EntityInstance,
    NDA,
    AccessRequest,
  },
  auth,
};
