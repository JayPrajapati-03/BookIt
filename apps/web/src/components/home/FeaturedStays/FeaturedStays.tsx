import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../services/api.js';
import { MapPin, Star, Zap, ArrowRight } from 'lucide-react';
import styles from './FeaturedStays.module.css';

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

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
];

export const FeaturedStays: React.FC = () => {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/hotels?limit=4&sort=rating')
      .then((res) => setHotels(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const formatINR = (paise: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < Math.round(rating) ? '#f2b33d' : 'none'}
        stroke={i < Math.round(rating) ? '#f2b33d' : '#d6dcd9'}
      />
    ));
  };

  return (
    <section id="featured-stays" className={styles.section}>
      <div className={styles.inner}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.sectionTag}>
              <Zap size={14} />
              Available Tonight
            </div>
            <h2 className={styles.title}>Featured Stays</h2>
            <p className={styles.subtitle}>
              Curated boutique properties — live availability, no surprises at check-in.
            </p>
          </div>
          <Link to="/search" className={styles.viewAll}>
            View all stays <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonImg} />
                  <div className={styles.skeletonBody}>
                    <div className={styles.skeletonLine} style={{ width: '70%' }} />
                    <div className={styles.skeletonLine} style={{ width: '45%', height: '12px' }} />
                    <div className={styles.skeletonLine} style={{ width: '55%' }} />
                  </div>
                </div>
              ))
            : hotels.map((h, idx) => (
                <Link to={`/hotels/${h.slug}`} key={h._id} className={styles.card}>
                  {/* Image */}
                  <div className={styles.imageWrap}>
                    <img
                      src={h.images[0]?.url || FALLBACK_IMAGES[idx % 4]}
                      alt={h.name}
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGES[idx % 4];
                      }}
                    />
                    <div className={styles.imageOverlay} />


                  </div>

                  {/* Content */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{h.name}</h3>
                    <div className={styles.location}>
                      <MapPin size={13} />
                      {h.city}, {h.state}
                    </div>

                    {h.ratingAvg > 0 && (
                      <div className={styles.rating}>
                        {renderStars(h.ratingAvg)}
                        <span className={styles.ratingNum}>{h.ratingAvg.toFixed(1)}</span>
                      </div>
                    )}

                    <div className={styles.priceRow}>
                      <div>
                        <span className={styles.priceFrom}>from</span>
                        <span className={styles.price}>{formatINR(h.fromPricePaise)}</span>
                        <span className={styles.priceNight}> /night</span>
                      </div>
                      <span className={styles.bookNow}>Book →</span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};
