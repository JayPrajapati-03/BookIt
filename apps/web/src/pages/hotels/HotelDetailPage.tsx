import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import { useAppSelector } from '../../store/hooks.js';
import { apiClient } from '../../services/api.js';
import { Button, Skeleton, Badge, Dialog } from '../../components/common/index.js';
import { MapPin, Star, Bed, Users, Maximize2, ShieldCheck, Check } from 'lucide-react';
import styles from './HotelDetailPage.module.css';

interface RoomType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  maxGuests: number;
  beds: string;
  sizeSqm: number;
  amenities: string[];
  basePricePaise: number;
  unitCount: number;
  images: Array<{ url: string; alt?: string }>;
}

interface HotelData {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  address: string;
  amenities: string[];
  ratingAvg: number;
  ratingCount: number;
  starRating: number;
  propertyType: string;
  policies: {
    checkInTime: string;
    checkOutTime: string;
    freeCancellationHours: number;
    lateCancellationPenaltyPercent: number;
  };
  images: Array<{ url: string; alt?: string }>;
}

const DEFAULT_CHECK_IN = '2026-10-14';
const DEFAULT_CHECK_OUT = '2026-10-17';
const DEFAULT_ADULTS = 2;

const isDateInputValue = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());

const getDateParam = (value: string | null, fallback: string): string =>
  value && isDateInputValue(value) ? value : fallback;

const getAdultParam = (value: string | null) => {
  const adults = Number(value);
  return Number.isInteger(adults) && adults > 0 ? adults : DEFAULT_ADULTS;
};

const getNightCount = (checkIn: string, checkOut: string) => {
  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  return Number.isFinite(nights) && nights > 0 ? nights : 1;
};

export const HotelDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const adultsParam = searchParams.get('adults');

  const [checkIn, setCheckIn] = useState(() => getDateParam(checkInParam, DEFAULT_CHECK_IN));
  const [checkOut, setCheckOut] = useState(() => getDateParam(checkOutParam, DEFAULT_CHECK_OUT));
  const [adults, setAdults] = useState(() => getAdultParam(adultsParam));

  // Lightbox
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    apiClient
      .get(`/hotels/${slug}`)
      .then((res) => {
        setHotel(res.data.data.hotel);
        setRoomTypes(res.data.data.roomTypes);
        if (res.data.data.roomTypes.length > 0) {
          setSelectedRoom(res.data.data.roomTypes[0]);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [slug]);

  useEffect(() => {
    setCheckIn(getDateParam(checkInParam, DEFAULT_CHECK_IN));
    setCheckOut(getDateParam(checkOutParam, DEFAULT_CHECK_OUT));
    setAdults(getAdultParam(adultsParam));
  }, [checkInParam, checkOutParam, adultsParam]);

  const formatINR = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  if (isLoading || !hotel) {
    return (
      <div className={styles.container}>
        <Skeleton height="36px" width="50%" style={{ marginBottom: 12 }} />
        <Skeleton height="20px" width="30%" style={{ marginBottom: 24 }} />
        <Skeleton height="400px" style={{ marginBottom: 32 }} />
      </div>
    );
  }

  const nights = getNightCount(checkIn, checkOut);
  const subtotalPaise = selectedRoom ? selectedRoom.basePricePaise * nights : 0;
  const taxPaise = Math.round(subtotalPaise * 0.18);
  const totalPaise = subtotalPaise + taxPaise;

  const handleHoldRoom = () => {
    if (!selectedRoom) return;
    const checkoutUrl = `/checkout?hotel=${encodeURIComponent(slug || '')}&roomTypeId=${selectedRoom._id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
    } else {
      navigate(checkoutUrl);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.hotelName}>{hotel.name}</h1>
        <div className={styles.metaRow}>
          <span>
            <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
            {hotel.address}, {hotel.city}, {hotel.state}
          </span>
          <span>&middot;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={14} fill="var(--color-marigold)" color="var(--color-marigold)" />
            {hotel.ratingAvg.toFixed(1)} ({hotel.ratingCount} guest reviews)
          </span>
          <span>&middot;</span>
          <span style={{ textTransform: 'capitalize' }}>{hotel.propertyType}</span>
        </div>
      </div>

      {/* Asymmetric Photo Mosaic */}
      <div className={styles.mosaic}>
        <img
          src={
            hotel.images[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
          }
          alt="Main property view"
          className={styles.heroPhoto}
          onClick={() => setActivePhoto(hotel.images[0]?.url)}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        {hotel.images.slice(1, 5).map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.alt || 'Hotel gallery'}
            className={styles.subPhoto}
            onClick={() => setActivePhoto(img.url)}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        ))}
      </div>

      <div className={styles.layout}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Editorial Story */}
          <section>
            <h2 className={styles.sectionTitle}>The Stay</h2>
            <p className={styles.story}>{hotel.description}</p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className={styles.sectionTitle}>Curated Amenities</h2>
            <div className={styles.amenitiesGrid}>
              {hotel.amenities.map((a, idx) => (
                <div key={idx} className={styles.amenityTag}>
                  <Check size={14} color="var(--color-tide)" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Room Tiers */}
          <section>
            <h2 className={styles.sectionTitle}>Available Rooms & Suites</h2>
            <div>
              {roomTypes.map((rt) => {
                const isSelected = selectedRoom?._id === rt._id;
                return (
                  <div
                    key={rt._id}
                    className={styles.roomCard}
                    style={{
                      borderColor: isSelected ? 'var(--color-tide)' : undefined,
                      boxShadow: isSelected ? '0 0 0 1px var(--color-tide)' : undefined,
                    }}
                  >
                    <div className={styles.roomHeader}>
                      <div>
                        <h3 className={styles.roomName}>{rt.name}</h3>
                        <div className={styles.roomDetails}>
                          <span>
                            <Users size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Up to {rt.maxGuests} Guests
                          </span>
                          <span>
                            <Bed size={14} style={{ display: 'inline', marginRight: 4 }} />
                            {rt.beds}
                          </span>
                          <span>
                            <Maximize2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                            {rt.sizeSqm} m&sup2;
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--color-lagoon)',
                          }}
                        >
                          {formatINR(rt.basePricePaise)}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          {' '}
                          / night
                        </span>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {rt.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Badge variant="danger">{rt.unitCount} units left</Badge>
                      <Button
                        variant={isSelected ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRoom(rt)}
                      >
                        {isSelected ? 'Selected Room' : 'Select This Room'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Policies */}
          <section>
            <h2 className={styles.sectionTitle}>Policies & Guarantees</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.9375rem',
              }}
            >
              <div>
                <strong>Check-In:</strong> from {hotel.policies.checkInTime} &middot;{' '}
                <strong>Check-Out:</strong> until {hotel.policies.checkOutTime}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--status-success)',
                }}
              >
                <ShieldCheck size={16} />
                <span>
                  Free cancellation available up to {hotel.policies.freeCancellationHours} hours
                  before check-in.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Booking Quote Panel */}
        <aside>
          <div className={styles.stickyPanel}>
            <div style={{ borderBottom: 'var(--border-hairline)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Nightly Tariff
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-lagoon)' }}>
                {selectedRoom ? formatINR(selectedRoom.basePricePaise) : '—'}
                <span
                  style={{ fontSize: '0.9375rem', fontWeight: 400, color: 'var(--text-secondary)' }}
                >
                  {' '}
                  / night
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Stay Dates</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '6px',
                    border: 'var(--border-hairline)',
                    borderRadius: 4,
                  }}
                />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '6px',
                    border: 'var(--border-hairline)',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>

            {selectedRoom && (
              <div style={{ borderTop: 'var(--border-hairline)', paddingTop: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: '0.875rem',
                  }}
                >
                  <span>
                    {formatINR(selectedRoom.basePricePaise)} &times; {nights} nights
                  </span>
                  <span>{formatINR(subtotalPaise)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: '0.875rem',
                  }}
                >
                  <span>Goods & Services Tax (18% GST)</span>
                  <span>{formatINR(taxPaise)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    borderTop: 'var(--border-hairline)',
                    paddingTop: 8,
                  }}
                >
                  <span>Total</span>
                  <span>{formatINR(totalPaise)}</span>
                </div>
              </div>
            )}

            <Button variant="primary" size="lg" onClick={handleHoldRoom}>
              Hold Room for 10 Mins
            </Button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Zero prepayment required to lock in your dates.
            </p>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      <Dialog isOpen={!!activePhoto} onClose={() => setActivePhoto(null)} title={hotel.name}>
        {activePhoto && (
          <img
            src={activePhoto}
            alt="Expanded hotel view"
            style={{ width: '100%', height: 'auto', borderRadius: 4 }}
          />
        )}
      </Dialog>
    </div>
  );
};
