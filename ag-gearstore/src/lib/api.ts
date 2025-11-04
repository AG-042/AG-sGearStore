const API_URL = 'http://localhost:8000';

/**
 * Shop UI for soccer fans, guest-friendly browsing
 */

export interface ProductVariant {
  id: number;
  size: string;
  stock: number;
  price_override: string | null;
}

export interface Product {
  id: number;
  name: string;
  base_price: string;
  stock: number;
  image: string;
  team: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.detail || errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error - please try again');
  }
}

export const productsApi = {
  async getAll(params?: { team?: string; search?: string; price_min?: string; price_max?: string }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.team) searchParams.append('team', params.team);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.price_min) searchParams.append('price_min', params.price_min);
    if (params?.price_max) searchParams.append('price_max', params.price_max);

    const query = searchParams.toString();
    return apiRequest<Product[]>(`/api/store/products/${query ? `?${query}` : ''}`);
  },

  async getById(id: number): Promise<Product> {
    return apiRequest<Product>(`/api/store/products/${id}/`);
  },

  async getCategories() {
    return apiRequest<Array<{ id: number; name: string; slug: string }>>('/api/store/categories/');
  },
};

export const checkoutApi = {
  async guestCheckout(cartItems: Array<{ product_id: number; quantity: number }>) {
    return apiRequest<{ order_id: string }>(
      '/api/store/guest-checkout/',
      {
        method: 'POST',
        body: JSON.stringify({ cart_items: cartItems }),
      }
    );
  },

  async authCheckout(cartItems: Array<{ product_id: number; quantity: number }>) {
    return apiRequest<{ order_id: string; total: number; points_awarded: number }>(
      '/api/store/auth-checkout/',
      {
        method: 'POST',
        body: JSON.stringify({ cart_items: cartItems }),
      }
    );
  },
};
