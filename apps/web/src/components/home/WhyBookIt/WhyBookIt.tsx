import React from 'react';
import { ShieldCheck, Zap, Clock, Star } from 'lucide-react';
import styles from './WhyBookIt.module.css';

const FEATURES = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Zero Double-Bookings',
    desc: 'ACID transactions with ledger-level guarantees. Your reservation is locked the moment you confirm.',
    accent: '#0f9f6e',
    bg: '#ecfdf5',
  },
  {
    icon: <Zap size={28} />,
    title: 'Real-Time Availability',
    desc: 'Live sync directly from the front desk. No stale data, no surprises at check-in.',
    accent: '#d97706',
    bg: '#fffbeb',
  },
  {
    icon: <Clock size={28} />,
    title: '10-Minute Hold',
    desc: 'Rooms are held exclusively for you during checkout. No race conditions, no lost bookings.',
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: <Star size={28} />,
    title: 'Handpicked Heritage',
    desc: 'Every property is verified for authenticity — havelis, palace hotels, and boutique gems only.',
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
];

export const WhyBookIt: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Why BookIt?</h2>
          <p className={styles.subtitle}>
            Built for travellers who refuse to compromise on authenticity, transparency, and peace of mind.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.iconWrap} style={{ background: f.bg, color: f.accent }}>
                {f.icon}
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
