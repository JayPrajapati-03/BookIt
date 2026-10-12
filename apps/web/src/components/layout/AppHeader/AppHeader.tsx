import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { logout } from '../../../store/slices/authSlice.js';
import { apiClient } from '../../../services/api.js';
import { Button } from '../../common/Button/Button.js';
import { LogOut, User } from 'lucide-react';
import styles from './AppHeader.module.css';

export const AppHeader: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSectionLink = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/');

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/#${sectionId}`);
    });
  };

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
        </div>

        <nav className={styles.primaryNav} aria-label="Primary navigation">
          <ul className={styles.navLinks}>
            <li>
              <Link to="/#stays" className={styles.navLink} onClick={handleSectionLink('stays')}>
                Stays
              </Link>
            </li>
            <li>
              <Link
                to="/#destinations"
                className={styles.navLink}
                onClick={handleSectionLink('destinations')}
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                to="/#featured-stays"
                className={styles.navLink}
                onClick={handleSectionLink('featured-stays')}
              >
                Featured
              </Link>
            </li>
            <li>
              <Link to="/#about" className={styles.navLink} onClick={handleSectionLink('about')}>
                About
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className={styles.navLink}
                onClick={handleSectionLink('contact')}
              >
                Contact
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

        <div className={styles.actionsGroup}>
          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard">
                <Button id="header-dashboard-btn" variant="subtle" size="sm">
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
                <Button id="header-login-btn" variant="subtle" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button id="header-register-btn" variant="primary" size="sm">
                  Create Account
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
