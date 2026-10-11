import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { logout } from '../../../store/slices/authSlice.js';
import { apiClient } from '../../../services/api.js';
import { Button } from '../../common/Button/Button.js';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import styles from './AppHeader.module.css';

export interface AppHeaderProps {
  isSocketConnected?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ isSocketConnected = true }) => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network failure on logout
    }
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link to="/" className={styles.logo}>
            BookIt
            <span className={styles.logoDot} />
          </Link>

          <nav>
            <ul className={styles.navLinks}>
              <li>
                <Link to="/search" className={styles.navLink}>
                  Explore Stays
                </Link>
              </li>
              {(user?.role === 'staff' || user?.role === 'admin') && (
                <li>
                  <Link to="/admin" className={styles.navLink}>
                    Front Desk
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.actionsGroup}>
          <div
            className={styles.liveIndicator}
            title={isSocketConnected ? 'Real-time WebSocket connected' : 'Connecting…'}
          >
            <span
              className={`${styles.liveDot} ${isSocketConnected ? styles.connected : styles.reconnecting}`}
            />
            <span>{isSocketConnected ? 'Live' : 'Connecting…'}</span>
          </div>

          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard">
                <Button id="header-dashboard-btn" variant="ghost" size="sm">
                  <User size={15} /> {user.name.split(' ')[0]}
                </Button>
              </Link>
              <Button
                id="header-logout-btn"
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                <LogOut size={15} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button id="header-login-btn" variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button id="header-register-btn" variant="primary" size="sm">
                  Join
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
