import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks.js';
import { bookingsApi, wishlistApi } from '../../services/api.js';
import { format } from 'date-fns';
import { Badge, Skeleton, EmptyState } from '../../components/common/index.js';
import {
  CalendarDays,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  ChevronRight,
} from 'lucide-react';
import styles from './GuestDashboardPage.module.css';

const formatInr = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`;

const STATUS_BADGES: Record<string, { label: string; variant: any }> = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  hold: { label: 'Pending', variant: 'warning' },
  checked_in: { label: 'Checked In', variant: 'success' },
  checked_out: { label: 'Completed', variant: 'neutral' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

type Tab = 'bookings' | 'wishlist';

export const GuestDashboardPage: React.FC = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    Promise.all([bookingsApi.list(statusFilter || undefined), wishlistApi.getAll()])
      .then(([bRes, wRes]) => {
        setBookings(bRes.data.data.bookings);
        setWishlist(wRes.data.data.items);
      })
      .finally(() => setIsLoading(false));
  }, [statusFilter]);

  const handleRemoveWishlist = async (hotelId: string) => {
    await wishlistApi.toggle(hotelId);
    setWishlist((prev) => prev.filter((i) => i.hotel._id !== hotelId));
  };

  return (
    <div className={styles.container}>
      {/* Profile banner */}
      <div className={styles.banner}>
        <div className={styles.avatar}>
          <User size={32} />
        </div>
        <div>
          <h1 className={styles.userName}>{user?.name}</h1>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
        <div className={styles.bannerStats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {
                bookings.filter((b) =>
                  ['confirmed', 'checked_in', 'checked_out'].includes(b.status),
                ).length
              }
            </span>
            <span className={styles.statLabel}>Stays</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{wishlist.length}</span>
            <span className={styles.statLabel}>Saved</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'bookings' ? styles.tabActive : ''}`}
          onClick={() => setTab('bookings')}
        >
          <CalendarDays size={16} /> My Bookings
        </button>
        <button
          className={`${styles.tab} ${tab === 'wishlist' ? styles.tabActive : ''}`}
          onClick={() => setTab('wishlist')}
        >
          <Heart size={16} /> Saved
        </button>
      </div>

      {tab === 'bookings' && (
        <div className={styles.section}>
          <div className={styles.filters}>
            {['', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((s) => (
              <button
                key={s}
                className={`${styles.filterChip} ${statusFilter === s ? styles.filterActive : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s ? STATUS_BADGES[s]?.label || s : 'All'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className={styles.list}>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={100} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={<CalendarDays size={40} />}
              title="No bookings yet"
              description="Explore beautiful stays and make your first booking"
              action={{ label: 'Browse Hotels', href: '/' }}
            />
          ) : (
            <div className={styles.list}>
              {bookings.map((b) => {
                const badge = STATUS_BADGES[b.status] || { label: b.status, variant: 'neutral' };
                return (
                  <Link key={b._id} to={`/bookings/${b._id}`} className={styles.bookingCard}>
                    <div className={styles.bookingImage}>
                      {b.hotel?.images?.[0] ? (
                        <img src={b.hotel.images[0].url} alt={b.hotel.name} />
                      ) : (
                        <div className={styles.imagePlaceholder} />
                      )}
                    </div>
                    <div className={styles.bookingInfo}>
                      <div className={styles.bookingTop}>
                        <h3 className={styles.bookingHotel}>{b.hotel?.name}</h3>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className={styles.bookingCity}>
                        <MapPin size={12} /> {b.hotel?.city}
                      </p>
                      <div className={styles.bookingMeta}>
                        <span>
                          <CalendarDays size={12} /> {format(new Date(b.checkIn), 'd MMM')} –{' '}
                          {format(new Date(b.checkOut), 'd MMM yyyy')}
                        </span>
                        <span className={styles.bookingRef}>{b.reference}</span>
                      </div>
                    </div>
                    <div className={styles.bookingRight}>
                      <span className={styles.bookingPrice}>{formatInr(b.totalPricePaise)}</span>
                      <ChevronRight size={16} className={styles.chevron} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'wishlist' && (
        <div className={styles.section}>
          {isLoading ? (
            <div className={styles.wishGrid}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={240} />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <EmptyState
              icon={<Heart size={40} />}
              title="Nothing saved yet"
              description="Tap the heart icon on any hotel to save it here"
              action={{ label: 'Browse Hotels', href: '/' }}
            />
          ) : (
            <div className={styles.wishGrid}>
              {wishlist.map((item) => {
                const h = item.hotel;
                return (
                  <div key={item._id} className={styles.wishCard}>
                    <Link to={`/hotels/${h.slug}`}>
                      <div className={styles.wishImage}>
                        {h.images?.[0] ? (
                          <img src={h.images[0].url} alt={h.name} />
                        ) : (
                          <div className={styles.imagePlaceholder} />
                        )}
                      </div>
                    </Link>
                    <div className={styles.wishContent}>
                      <button
                        className={styles.removeWish}
                        onClick={() => handleRemoveWishlist(h._id)}
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                      <Link to={`/hotels/${h.slug}`} className={styles.wishName}>
                        {h.name}
                      </Link>
                      <p className={styles.wishCity}>
                        <MapPin size={12} /> {h.city}
                      </p>
                      <p className={styles.wishPrice}>
                        from {formatInr(h.fromPricePaise)}
                        <span>/night</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
