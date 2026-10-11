import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../services/api.js';
import { Skeleton } from '../../common/Skeleton/Skeleton.js';
import { MapPin, Moon } from 'lucide-react';
import styles from './OpenTonight.module.css';

interface HotelItem {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  fromPricePaise: number;
  ratingAvg: number;
  images: Array<{ url: string; alt?: string }>;
}

export const OpenTonight: React.FC = () => {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/hotels?limit=4&sort=rating')
      .then((res) => {
        setHotels(res.data.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const formatINR = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Moon size={22} color="var(--color-marigold)" />
          <h2 className={styles.title}>Open Tonight</h2>
          <span className={styles.badge}>Live Available</span>
        </div>
        <Link
          to="/search"
          style={{ fontSize: '0.875rem', color: 'var(--color-tide)', fontWeight: 600 }}
        >
          View all stays &rarr;
        </Link>
      </div>

      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton height="180px" borderRadius="6px" />
                <Skeleton height="20px" width="80%" />
                <Skeleton height="16px" width="50%" />
                <Skeleton height="24px" width="60%" />
              </div>
            ))
          : hotels.map((h) => (
              <Link to={`/hotels/${h.slug}`} key={h._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={
                      h.images[0]?.url ||
                      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
                    }
                    alt={h.name}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{h.name}</h3>
                  <div className={styles.location}>
                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {h.city}, {h.state}
                  </div>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{formatINR(h.fromPricePaise)} / night</span>
                    <span className={styles.unitNotice}>Few units left</span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};
