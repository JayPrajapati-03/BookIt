import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient, wishlistApi } from '../../services/api.js';
import { useAppSelector } from '../../store/hooks.js';
import { Button, Skeleton, EmptyState } from '../../components/common/index.js';
import { Map, List, MapPin, Filter, Heart } from 'lucide-react';
import { HotelSearchMap } from './HotelSearchMap.js';
import styles from './SearchPage.module.css';

interface HotelItem {
  _id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  tagline: string;
  propertyType: string;
  ratingAvg: number;
  fromPricePaise: number;
  location: { coordinates: [number, number] }; // [lng, lat]
  images: Array<{ url: string; alt?: string }>;
}

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<any>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [savedHotelIds, setSavedHotelIds] = useState<Set<string>>(new Set());
  const [savingHotelIds, setSavingHotelIds] = useState<Set<string>>(new Set());

  // Filter values read directly from URL search params for bookmarkability
  const city = searchParams.get('city') || '';
  const sort = searchParams.get('sort') || 'recommended';
  const selectedTypes = searchParams.getAll('propertyType');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Local state for price input with debounce to prevent flashing/reloading
  const [priceInput, setPriceInput] = useState(maxPrice ? (Number(maxPrice) / 100).toString() : '');

  useEffect(() => {
    setPriceInput(maxPrice ? (Number(maxPrice) / 100).toString() : '');
  }, [maxPrice]);

  useEffect(() => {
    setIsSearching(true);
    const queryStr = searchParams.toString();
    apiClient
      .get(`/hotels?${queryStr}`)
      .then((res) => {
        setHotels(res.data.data);
        setTotal(res.data.meta?.total || 0);
        setFacets(res.data.meta?.facets || {});
      })
      .catch(() => {})
      .finally(() => {
        setIsInitialLoading(false);
        setIsSearching(false);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedHotelIds(new Set());
      return;
    }

    wishlistApi
      .getAll()
      .then((res) => {
        const ids = (res.data.data.items || []).map((item: any) => item.hotel?._id).filter(Boolean);
        setSavedHotelIds(new Set(ids));
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentValInRupees = maxPrice ? (Number(maxPrice) / 100).toString() : '';
      if (priceInput.trim() !== currentValInRupees) {
        const val = priceInput.trim() ? (Number(priceInput) * 100).toString() : null;
        updateParam('maxPrice', val);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [priceInput, maxPrice]);

  const updateParam = (key: string, value: string | null) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      setSearchParams(next);
    });
  };

  const togglePropertyType = (type: string) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);
      const current = next.getAll('propertyType');
      next.delete('propertyType');
      if (current.includes(type)) {
        current.filter((t) => t !== type).forEach((t) => next.append('propertyType', t));
      } else {
        [...current, type].forEach((t) => next.append('propertyType', t));
      }
      setSearchParams(next);
    });
  };

  const formatINR = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const getHotelDetailPath = (slug: string) => {
    const stayParams = new URLSearchParams();
    ['checkIn', 'checkOut', 'adults'].forEach((key) => {
      const value = searchParams.get(key);
      if (value) stayParams.set(key, value);
    });

    const queryString = stayParams.toString();
    return queryString ? `/hotels/${slug}?${queryString}` : `/hotels/${slug}`;
  };

  const handleSaveToggle = async (hotelId: string) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    setSavingHotelIds((prev) => new Set(prev).add(hotelId));
    try {
      const res = await wishlistApi.toggle(hotelId);
      const saved = Boolean(res.data.data.saved);
      setSavedHotelIds((prev) => {
        const next = new Set(prev);
        if (saved) {
          next.add(hotelId);
        } else {
          next.delete(hotelId);
        }
        return next;
      });
    } finally {
      setSavingHotelIds((prev) => {
        const next = new Set(prev);
        next.delete(hotelId);
        return next;
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.resultCount}>
            {isInitialLoading ? 'Searching stays...' : `${total} boutique stays found`}
            {city && ` in ${city}`}
          </h1>
        </div>

        <div className={styles.controls}>
          {/* Sort Selector */}
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            style={{
              padding: '8px 12px',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '0.875rem',
            }}
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* List / Map Toggle */}
          <div
            style={{
              display: 'flex',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              leftIcon={<List size={16} />}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              leftIcon={<Map size={16} />}
              onClick={() => setViewMode('map')}
            >
              Map
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Filters Sidebar */}
        <aside className={styles.filtersSidebar}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-lagoon)' }}>
              Filters
            </span>
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-tide)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
          </div>

          {/* Destination */}
          <div>
            <h3 className={styles.filterGroupTitle}>Destination</h3>
            <input
              type="text"
              placeholder="Filter by city..."
              defaultValue={city}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateParam('city', e.currentTarget.value || null);
                }
              }}
              onBlur={(e) => updateParam('city', e.currentTarget.value || null)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'var(--border-hairline)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Property Types */}
          <div>
            <h3 className={styles.filterGroupTitle}>Property Type</h3>
            <div className={styles.checkboxList}>
              {['haveli', 'resort', 'lodge', 'camp', 'boutique', 'homestay'].map((type) => {
                const count = facets.propertyTypes?.find((f: any) => f._id === type)?.count || 0;
                return (
                  <label key={type} className={styles.checkboxLabel}>
                    <div className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => togglePropertyType(type)}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    </div>
                    {count > 0 && <span className={styles.countPill}>{count}</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className={styles.filterGroupTitle}>Max Nightly Price (INR)</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Max ₹"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = priceInput.trim() ? (Number(priceInput) * 100).toString() : null;
                    updateParam('maxPrice', val);
                  }
                }}
                onBlur={() => {
                  const val = priceInput.trim() ? (Number(priceInput) * 100).toString() : null;
                  updateParam('maxPrice', val);
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: 'var(--border-hairline)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>
        </aside>

        {/* Content Area: List View or Map View */}
        <main>
          {viewMode === 'map' ? (
            <HotelSearchMap hotels={hotels} />
          ) : isInitialLoading ? (
            <div className={styles.cardsGrid}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton height="180px" borderRadius="8px" />
                  <Skeleton height="18px" width="75%" />
                  <Skeleton height="14px" width="50%" />
                  <Skeleton height="32px" width="100%" />
                </div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <EmptyState
              icon={<Filter size={32} />}
              title="No properties match your active filters"
              description="Try adjusting your maximum price bounds, property types, or search another destination in India."
              action={
                <Button variant="outline" onClick={() => setSearchParams(new URLSearchParams())}>
                  Reset All Filters
                </Button>
              }
            />
          ) : (
            <div
              className={styles.cardsGrid}
              style={{
                opacity: isSearching ? 0.6 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              {hotels.map((h) => {
                const isSaved = savedHotelIds.has(h._id);
                const isSaving = savingHotelIds.has(h._id);

                return (
                  <article key={h._id} className={styles.card}>
                    <Link to={getHotelDetailPath(h.slug)} className={styles.cardLink}>
                      <div className={styles.imageWrapper}>
                        <img
                          src={
                            h.images[0]?.url ||
                            'https://upload.wikimedia.org/wikipedia/commons/2/28/City_Palace%2C_Udaipur%2C_20191207_0501_6900.jpg'
                          }
                          alt={h.name}
                          className={styles.image}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              'https://upload.wikimedia.org/wikipedia/commons/2/28/City_Palace%2C_Udaipur%2C_20191207_0501_6900.jpg';
                          }}
                        />
                        <span className={styles.propertyBadge}>{h.propertyType}</span>
                      </div>
                      <div className={styles.content}>
                        <div className={styles.cityLocation}>
                          <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
                          {h.city}, {h.state}
                        </div>

                        <h2 className={styles.hotelName} title={h.name}>
                          {h.name}
                        </h2>
                        <p className={styles.tagline}>{h.tagline}</p>

                        <div className={styles.cardFooter}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              From{' '}
                            </span>
                            <span className={styles.price}>{formatINR(h.fromPricePaise)}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {' '}
                              / night
                            </span>
                          </div>
                          <span className={styles.viewLink}>View Rooms &rarr;</span>
                        </div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      className={`${styles.saveButton} ${isSaved ? styles.saveButtonActive : ''}`}
                      onClick={() => handleSaveToggle(h._id)}
                      disabled={isSaving}
                      aria-label={isSaved ? `Remove ${h.name} from saved` : `Save ${h.name}`}
                      title={isSaved ? 'Saved' : 'Save'}
                    >
                      <Heart size={17} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
