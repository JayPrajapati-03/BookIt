import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout.js';
import { HomePage } from './pages/HomePage.js';
import { UiPreviewPage } from './pages/UiPreviewPage.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { RegisterPage } from './pages/auth/RegisterPage.js';
import { SearchPage } from './pages/search/SearchPage.js';
import { HotelDetailPage } from './pages/hotels/HotelDetailPage.js';
import { CheckoutPage } from './pages/booking/CheckoutPage.js';
import { BookingDetailPage } from './pages/booking/BookingDetailPage.js';
import { GuestDashboardPage } from './pages/guest/GuestDashboardPage.js';
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage.js';
import { TapeChartPage } from './pages/admin/TapeChartPage.js';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.js';
import { AdminAuditPage } from './pages/admin/AdminAuditPage.js';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.js';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'hotels/:slug', element: <HotelDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: '_ui', element: <UiPreviewPage /> },
      // Checkout flow
      { path: 'checkout', element: <CheckoutPage /> },
      // Guest area
      { path: 'dashboard', element: <GuestDashboardPage /> },
      { path: 'bookings/:id', element: <BookingDetailPage /> },
      // 404
      {
        path: '*',
        element: (
          <div style={{ textAlign: 'center', padding: '96px 24px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>404 &mdash; Page Not Found</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              The page you are looking for does not exist.
            </p>
          </div>
        ),
      },
    ],
  },
  // Admin — separate layout (no public header/footer)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
      { path: 'tape-chart', element: <TapeChartPage /> },
      { path: 'properties', element: <AdminPropertiesPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
      { path: 'audit-logs', element: <AdminAuditPage /> },
      { path: 'users', element: <AdminUsersPage /> },
    ],
  },
]);
