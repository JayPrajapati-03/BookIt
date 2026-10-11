import type { Permission } from '@bookit/shared';

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  requiredPermission?: Permission;
  isPublic?: boolean;
}

export const ROUTE_REGISTRY: RouteDefinition[] = [
  // Public routes
  { method: 'GET', path: '/healthz', isPublic: true },
  { method: 'GET', path: '/readyz', isPublic: true },
  { method: 'GET', path: '/api/v1/ping', isPublic: true },
  { method: 'POST', path: '/api/v1/auth/register', isPublic: true },
  { method: 'POST', path: '/api/v1/auth/login', isPublic: true },
  { method: 'POST', path: '/api/v1/auth/refresh', isPublic: true },

  // Guest / Authenticated user routes
  { method: 'GET', path: '/api/v1/auth/me', requiredPermission: 'notifications:read:own' },
  { method: 'POST', path: '/api/v1/auth/logout', requiredPermission: 'notifications:read:own' },
  { method: 'POST', path: '/api/v1/auth/logout-all', requiredPermission: 'notifications:read:own' },
  { method: 'GET', path: '/api/v1/bookings', requiredPermission: 'bookings:read:own' },
  { method: 'POST', path: '/api/v1/bookings/quote', requiredPermission: 'bookings:create' },
  { method: 'POST', path: '/api/v1/bookings/hold', requiredPermission: 'bookings:create' },
  { method: 'POST', path: '/api/v1/reviews', requiredPermission: 'reviews:create' },
  { method: 'GET', path: '/api/v1/wishlist', requiredPermission: 'wishlist:manage:own' },

  // Staff routes
  { method: 'POST', path: '/api/v1/admin/walk-in', requiredPermission: 'bookings:walk_in' },
  {
    method: 'PATCH',
    path: '/api/v1/admin/bookings/test-id/status',
    requiredPermission: 'bookings:update:status',
  },
  { method: 'POST', path: '/api/v1/admin/blocks', requiredPermission: 'blocks:manage' },
  {
    method: 'POST',
    path: '/api/v1/admin/reviews/test-id/respond',
    requiredPermission: 'reviews:respond',
  },

  // Admin-only routes
  { method: 'POST', path: '/api/v1/admin/hotels', requiredPermission: 'hotels:manage' },
  { method: 'POST', path: '/api/v1/admin/pricing-rules', requiredPermission: 'pricing:manage' },
  { method: 'GET', path: '/api/v1/admin/audit-logs', requiredPermission: 'audit:read' },
  { method: 'GET', path: '/api/v1/admin/reports/occupancy', requiredPermission: 'reports:read' },
  { method: 'PATCH', path: '/api/v1/admin/settings', requiredPermission: 'settings:manage' },
  { method: 'GET', path: '/api/v1/admin/users', requiredPermission: 'users:manage' },
];
