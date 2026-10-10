import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../common/Button/Button.js';
import styles from './AppHeader.module.css';

export interface AppHeaderProps {
  isSocketConnected?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ isSocketConnected = true }) => {
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
              <li>
                <Link to="/_ui" className={styles.navLink}>
                  Design System (/_ui)
                </Link>
              </li>
              <li>
                <Link to="/admin" className={styles.navLink}>
                  Front Desk (Admin)
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.actionsGroup}>
          <div
            className={styles.liveIndicator}
            title={isSocketConnected ? 'Real-time WebSocket connected' : 'Connecting to real-time engine...'}
          >
            <span className={styles.liveDot} />
            <span>{isSocketConnected ? 'Live' : 'Reconnecting...'}</span>
          </div>

          <Link to="/bookings">
            <Button variant="ghost" size="sm">
              My Bookings
            </Button>
          </Link>

          <Link to="/login">
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
