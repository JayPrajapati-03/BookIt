import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/index.js';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-sand)',
          color: 'var(--color-tide)',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '24px',
        }}
      >
        <Sparkles size={16} />
        <span>Phase 0 Foundation Complete</span>
      </div>

      <h1
        style={{
          fontSize: '2.75rem',
          fontWeight: 700,
          color: 'var(--color-lagoon)',
          lineHeight: 1.15,
          marginBottom: '16px',
        }}
      >
        Real-Time Hotel Booking Engine
      </h1>

      <p
        style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}
      >
        Boutique heritage stays across India with strict double-booking prevention, atomic Mongo
        transactions, and sub-second Socket.io synchronization.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link to="/_ui">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
            Explore Design System (/_ui)
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="outline" size="lg">
            Explore Stays
          </Button>
        </Link>
      </div>
    </div>
  );
};
