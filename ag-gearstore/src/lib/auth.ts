/**
 * Auth UI for fans, guest checkout for quick buys
 */

const API_URL = 'http://localhost:8000';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Invalid credentials');
  }

  const tokens: LoginResponse = await response.json();
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
  return tokens;
};

export const register = async (data: RegisterData): Promise<void> => {
  const response = await fetch(`${API_URL}/api/users/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.username?.[0] || error.email?.[0] || 'Registration failed');
  }

  // Auto-login after registration
  await login({ username: data.username, password: data.password });
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
