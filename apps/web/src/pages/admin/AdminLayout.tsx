import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { apiClient } from '../../services/api.js';
import { logout } from '../../store/slices/authSlice.js';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  BarChart3,
  ShieldCheck,
  LogOut,
  ClipboardList,
  UserPlus,
} from 'lucide-react';
import styles from './AdminLayout.module.css';

type AdminRole = 'staff' | 'admin';

const NAV = [
  {
    label: 'Today',
    icon: <ClipboardList size={18} />,
    path: '/admin/today',
    roles: ['staff', 'admin'],
  },
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin', roles: ['admin'] },
  {
    label: 'Bookings',
    icon: <CalendarDays size={18} />,
    path: '/admin/bookings',
    roles: ['staff', 'admin'],
  },
  {
    label: 'Tape Chart',
    icon: <CalendarDays size={18} />,
    path: '/admin/tape-chart',
    roles: ['staff', 'admin'],
  },
  {
    label: 'Walk-in',
    icon: <UserPlus size={18} />,
    path: '/admin/walk-in',
    roles: ['staff', 'admin'],
  },
  {
    label: 'Properties',
    icon: <Building2 size={18} />,
    path: '/admin/properties',
    roles: ['admin'],
  },
  { label: 'Users', icon: <Users size={18} />, path: '/admin/users', roles: ['admin'] },
  { label: 'Reports', icon: <BarChart3 size={18} />, path: '/admin/reports', roles: ['admin'] },
  {
    label: 'Audit Logs',
    icon: <ShieldCheck size={18} />,
    path: '/admin/audit-logs',
    roles: ['admin'],
  },
];

const STAFF_ALLOWED_PATHS = [
  '/admin/today',
  '/admin/bookings',
  '/admin/tape-chart',
  '/admin/walk-in',
];

export const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !['staff', 'admin'].includes(user.role)) {
      navigate('/');
      return;
    }
    if (user.role === 'staff' && !STAFF_ALLOWED_PATHS.includes(location.pathname)) {
      navigate('/admin/bookings', { replace: true });
    }
  }, [isLoading, location.pathname, navigate, user]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network failure on logout.
    }
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) return null;

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo}>
            {sidebarOpen ? 'BookIt' : 'B'}
          </Link>
          <button
            className={styles.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span aria-hidden="true">≡</span>
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            if (!item.roles.includes(user?.role as AdminRole)) return null;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            {sidebarOpen && (
              <>
                <span className={styles.footerName}>{user?.name}</span>
                <span className={styles.footerRole}>{user?.role}</span>
              </>
            )}
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
