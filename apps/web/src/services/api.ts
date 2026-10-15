import axios, { type AxiosInstance } from 'axios';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true, // send httpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// 401 → refresh → retry once
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await apiClient.post('/auth/refresh', {});
        const newToken = res.data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          processQueue(null);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr);
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bookit_logged_in');
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// ─── Hotels ──────────────────────────────────────────────────────────────────
export const hotelsApi = {
  search: (params: Record<string, string | number | string[] | undefined>) =>
    apiClient.get('/hotels', { params }),
  suggest: (q: string) => apiClient.get('/hotels/suggest', { params: { q } }),
  getBySlug: (slug: string) => apiClient.get(`/hotels/${slug}`),
  getAvailability: (slug: string, checkIn: string, checkOut: string) =>
    apiClient.get(`/hotels/${slug}/availability`, { params: { checkIn, checkOut } }),
  getReviews: (slug: string, cursor?: string) =>
    apiClient.get(`/hotels/${slug}/reviews`, { params: { cursor, limit: 5 } }),
};

export type HotelSuggestion = {
  label: string;
  value: string;
};

export async function getHotelSuggestions(query: string): Promise<HotelSuggestion[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const res = await hotelsApi.suggest(q);
    return res.data?.data || [];
  } catch (error) {
    console.error('Error fetching hotel suggestions:', error);
    return [];
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  quote: (roomTypeId: string, checkIn: string, checkOut: string, adults: number) =>
    apiClient.get('/bookings/quote', { params: { roomTypeId, checkIn, checkOut, adults } }),
  hold: (payload: Record<string, unknown>, idempotencyKey: string) =>
    apiClient.post('/bookings/hold', payload, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  confirm: (id: string) => apiClient.post(`/bookings/${id}/confirm`),
  cancel: (id: string, reason?: string) => apiClient.post(`/bookings/${id}/cancel`, { reason }),
  list: (status?: string, cursor?: string) =>
    apiClient.get('/bookings', { params: { status, cursor, limit: 10 } }),
  get: (id: string) => apiClient.get(`/bookings/${id}`),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistApi = {
  getAll: () => apiClient.get('/wishlist'),
  toggle: (hotelId: string) => apiClient.post('/wishlist/toggle', { hotelId }),
  check: (hotelId: string) => apiClient.get('/wishlist/check', { params: { hotelId } }),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviewsApi = {
  create: (payload: Record<string, unknown>) => apiClient.post('/reviews', payload),
  respond: (id: string, body: string) => apiClient.post(`/admin/reviews/${id}/respond`, { body }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getBookings: (params?: Record<string, string | number | undefined>) =>
    apiClient.get('/admin/bookings', { params }),
  updateBookingStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/bookings/${id}/status`, { status }),
  createWalkIn: (payload: Record<string, unknown>) => apiClient.post('/admin/walk-in', payload),
  getTapeChart: (hotelId: string, startDate: string, days?: number) =>
    apiClient.get('/admin/tape-chart', { params: { hotelId, startDate, days } }),
  getUsers: (params?: Record<string, string | number | undefined>) =>
    apiClient.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) =>
    apiClient.patch(`/admin/users/${id}/role`, { role }),
  getAuditLogs: (cursor?: string) =>
    apiClient.get('/admin/audit-logs', { params: { cursor, limit: 20 } }),
  getReports: (from?: string, to?: string) =>
    apiClient.get('/admin/reports/occupancy', { params: { from, to } }),
  getHotels: () => apiClient.get('/admin/hotels'),
  createHotel: (payload: Record<string, unknown>) => apiClient.post('/admin/hotels', payload),
  getRoomTypes: (hotelId: string) => apiClient.get('/admin/room-types', { params: { hotelId } }),
  createRoomType: (payload: Record<string, unknown>) =>
    apiClient.post('/admin/room-types', payload),
  getPricingRules: (hotelId: string) =>
    apiClient.get('/admin/pricing-rules', { params: { hotelId } }),
  createPricingRule: (payload: Record<string, unknown>) =>
    apiClient.post('/admin/pricing-rules', payload),
  updatePricingRule: (id: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/admin/pricing-rules/${id}`, payload),
  deletePricingRule: (id: string) => apiClient.delete(`/admin/pricing-rules/${id}`),
  createBlock: (payload: Record<string, unknown>) => apiClient.post('/admin/blocks', payload),
};
