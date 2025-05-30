const API_BASE_URL = 'http://localhost:3002/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.access_token);
    return response;
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await this.request<{
      access_token: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setToken(response.access_token);
    return response;
  }

  async getProfile() {
    return this.request<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      phoneNumber: string | null;
      dateOfBirth: string | null;
      address: string | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>('/users/me');
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    requiresPrescription?: boolean;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    return this.request<{
      data: Array<{
        id: string;
        sku: string;
        name: string;
        genericName: string | null;
        description: string;
        type: string;
        manufacturer: string;
        price: string;
        requiresPrescription: boolean;
        dosageForm: string | null;
        strength: string | null;
        packSize: string | null;
        images: string[];
        isActive: boolean;
        isFeatured: boolean;
        category: {
          id: string;
          name: string;
          slug: string;
        };
      }>;
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request<{
      id: string;
      sku: string;
      name: string;
      genericName: string | null;
      description: string;
      type: string;
      manufacturer: string;
      price: string;
      costPrice: string;
      activeIngredients: string[];
      requiresPrescription: boolean;
      dosageForm: string | null;
      strength: string | null;
      packSize: string | null;
      storageConditions: string | null;
      handlingInstructions: string | null;
      images: string[];
      isActive: boolean;
      isFeatured: boolean;
      category: {
        id: string;
        name: string;
        slug: string;
      };
      inventory: {
        id: string;
        totalQuantity: number;
        availableQuantity: number;
        reservedQuantity: number;
      } | null;
      batches: Array<{
        id: string;
        batchNumber: string;
        quantity: number;
        remainingQuantity: number;
        expiryDate: string;
        manufactureDate: string;
      }>;
    }>(`/products/${id}`);
  }

  async searchProducts(query: string) {
    return this.request<Array<{
      id: string;
      sku: string;
      name: string;
      genericName: string | null;
      description: string;
      manufacturer: string;
      price: string;
      requiresPrescription: boolean;
      images: string[];
      category: {
        id: string;
        name: string;
        slug: string;
      };
    }>>(`/products/search?q=${encodeURIComponent(query)}`);
  }
}

export const api = new ApiClient(); 