import React from 'react';
import styles from './AppFooter.module.css';

export const AppFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <h3 className={styles.title}>BookIt</h3>
            <p className={styles.tagline}>
              Portfolio-grade, real-time hotel reservation engine for boutique heritage stays across
              India. Built with Express 5, React 19, Socket.io, and strict MongoDB transactions.
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#9ab4b7' }}>
              IST Timezone Canonical &middot; UTC Midnight Ledger
            </span>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <span>&copy; {new Date().getFullYear()} BookIt Stays. All rights reserved.</span>
          <span>Zero Mock Data &middot; Real MongoDB Replication &middot; Strict Concurrency</span>
        </div>
      </div>
    </footer>
  );
};
