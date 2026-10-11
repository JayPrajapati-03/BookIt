import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks.js';
import {
  LayoutDashboard,
  CalendarDays,
  Building2,
  Users,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import styles from './AdminLayout.module.css';

const NAV = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
  { label: 'Bookings', icon: <CalendarDays size={18} />, path: '/admin/bookings' },
  { label: 'Tape Chart', icon: <CalendarDays size={18} />, path: '/admin/tape-chart' },
  { label: 'Properties', icon: <Building2 size={18} />, path: '/admin/properties' },
  { label: 'Users', icon: <Users size={18} />, path: '/admin/users' },
  { label: 'Reports', icon: <BarChart3 size={18} />, path: '/admin/reports' },
  { label: 'Audit Logs', icon: <ShieldCheck size={18} />, path: '/admin/audit-logs' },
];

export const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !['staff', 'admin'].includes(user.role)) {
      navigate('/');
    }
  }, [isLoading, navigate, user]);

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
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            if (item.label === 'Users' && user?.role !== 'admin') return null;
            if (item.label === 'Audit Logs' && user?.role !== 'admin') return null;
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
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
