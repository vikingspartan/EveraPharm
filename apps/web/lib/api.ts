const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

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

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    shippingAddress: string;
    billingAddress: string;
    paymentMethod: string;
    notes?: string;
  }) {
    return this.request<{
      id: string;
      orderNumber: string;
      status: string;
      total: string;
      items: Array<{
        id: string;
        quantity: number;
        unitPrice: string;
        total: string;
        product: {
          id: string;
          name: string;
          requiresPrescription: boolean;
        };
      }>;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request<Array<{
      id: string;
      orderNumber: string;
      status: string;
      total: string;
      createdAt: string;
      items: Array<{
        id: string;
        quantity: number;
        product: {
          id: string;
          name: string;
          images: string[];
        };
      }>;
    }>>('/orders');
  }

  async getOrder(id: string) {
    return this.request<{
      id: string;
      orderNumber: string;
      status: string;
      subtotal: string;
      tax: string;
      shippingCost: string;
      total: string;
      shippingAddress: string;
      billingAddress: string;
      paymentMethod: string;
      paymentStatus: string;
      createdAt: string;
      updatedAt: string;
      shippedAt: string | null;
      deliveredAt: string | null;
      items: Array<{
        id: string;
        quantity: number;
        unitPrice: string;
        total: string;
        product: {
          id: string;
          name: string;
          genericName: string | null;
          manufacturer: string;
          requiresPrescription: boolean;
          images: string[];
        };
      }>;
      customer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      prescription?: {
        id: string;
        status: string;
        doctorName: string;
        prescribedDate: string;
      };
    }>(`/orders/${id}`);
  }

  async uploadPrescription(orderId: string, prescriptionData: FormData) {
    const headers: Record<string, string> = {};
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/prescription`, {
      method: 'POST',
      headers,
      body: prescriptionData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Admin methods
  async getAdminStats() {
    return this.request<{
      stats: {
        totalOrders: number;
        pendingOrders: number;
        totalProducts: number;
        activeProducts: number;
        totalUsers: number;
        totalRevenue: number;
        todayOrders: number;
        todayRevenue: number;
        lowStockProducts: number;
      };
      recentOrders: Array<any>;
      lowStockAlerts: Array<any>;
      salesByCategory: Array<{
        category: string;
        orderCount: number;
        revenue: number;
      }>;
    }>('/admin/stats');
  }

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
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
      data: Array<any>;
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<any>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
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
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        phoneNumber: string | null;
        isActive: boolean;
        createdAt: string;
        _count: {
          orders: number;
        };
      }>;
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  }

  async updateUser(userId: string, data: { isActive?: boolean; role?: string }) {
    return this.request<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isActive: boolean;
    }>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(productId: string) {
    return this.request<void>(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  async createProduct(productData: any) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: any) {
    return this.request<any>(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  }
}

export const api = new ApiClient();