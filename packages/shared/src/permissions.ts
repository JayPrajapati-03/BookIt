import type { UserRole } from './constants.js';

export const PERMISSIONS = [
  // Bookings
  'bookings:create',
  'bookings:read:own',
  'bookings:read:all',
  'bookings:cancel:own',
  'bookings:update:status',
  'bookings:walk_in',
  'bookings:move',

  // Reviews
  'reviews:create',
  'reviews:moderate',
  'reviews:respond',

  // Wishlist & Notifications
  'wishlist:manage:own',
  'notifications:read:own',

  // Admin Properties & Pricing
  'hotels:read',
  'hotels:manage',
  'rooms:manage',
  'pricing:manage',
  'blocks:manage',

  // Admin Team & System
  'users:manage',
  'audit:read',
  'reports:read',
  'settings:manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  guest: [
    'bookings:create',
    'bookings:read:own',
    'bookings:cancel:own',
    'reviews:create',
    'wishlist:manage:own',
    'notifications:read:own',
  ],
  staff: [
    'bookings:create',
    'bookings:read:own',
    'bookings:read:all',
    'bookings:cancel:own',
    'bookings:update:status',
    'bookings:walk_in',
    'bookings:move',
    'hotels:read',
    'notifications:read:own',
    'blocks:manage',
    'reviews:respond',
  ],
  admin: [...PERMISSIONS],
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}
