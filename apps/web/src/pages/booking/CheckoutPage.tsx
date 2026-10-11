import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks.js';
import { bookingsApi, hotelsApi } from '../../services/api.js';
import { nanoid } from 'nanoid';
import { format, differenceInCalendarDays } from 'date-fns';
import {
  ShieldCheck,
  Clock,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/common/index.js';
import styles from './CheckoutPage.module.css';

type CheckoutStep = 'review' | 'processing' | 'confirmed' | 'error';

const formatInr = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const roomTypeId = searchParams.get('roomTypeId') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const adults = Number(searchParams.get('adults') || 1);
  const hotelSlug = searchParams.get('hotel') || '';

  const [step, setStep] = useState<CheckoutStep>('review');
  const [quote, setQuote] = useState<{
    totalPricePaise: number;
    nights: number;
    breakdown: any[];
  } | null>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [roomType, setRoomType] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState('');
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!roomTypeId || !checkIn || !checkOut) {
      navigate('/');
      return;
    }

    Promise.all([
      bookingsApi.quote(roomTypeId, checkIn, checkOut, adults),
      hotelsApi.getBySlug(hotelSlug),
    ])
      .then(([quoteRes, hotelRes]) => {
        setQuote(quoteRes.data.data);
        setHotel(hotelRes.data.data.hotel);
        const rt = hotelRes.data.data.roomTypes?.find((r: any) => r._id === roomTypeId);
        setRoomType(rt);
      })
      .catch(() => navigate('/'));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!holdExpiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, holdExpiresAt.getTime() - Date.now());
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${mins}:${secs.toString().padStart(2, '0')}`);
      if (remaining === 0) {
        setStep('error');
        setError('Your hold has expired. Please start a new booking.');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const handleHold = async () => {
    setStep('processing');
    try {
      const key = nanoid(16);
      const res = await bookingsApi.hold(
        {
          roomTypeId,
          checkIn,
          checkOut,
          adults,
          children: 0,
          guestDetails: {
            name: guestName,
            email: guestEmail,
            phone: guestPhone,
            requests: specialRequests,
          },
        },
        key,
      );
      const b = res.data.data.booking;
      setBooking(b);
      setHoldExpiresAt(new Date(b.holdExpiresAt));
      setStep('confirmed');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to hold booking. Please try again.');
      setStep('error');
    }
  };

  const handleConfirm = async () => {
    if (!booking) return;
    setStep('processing');
    try {
      await bookingsApi.confirm(booking._id);
      navigate(`/bookings/${booking._id}?confirmed=1`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Confirmation failed');
      setStep('error');
    }
  };

  const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));

  if (!quote || !hotel) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingGrid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className={styles.grid}>
        {/* Left: Steps */}
        <div className={styles.main}>
          {step === 'review' && (
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Guest Details</h2>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label>Full Name *</label>
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Name on booking"
                  />
                </div>
                <div className={styles.formField}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Confirmation will be sent here"
                  />
                </div>
                <div className={styles.formField}>
                  <label>Phone</label>
                  <input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 …"
                  />
                </div>
                <div className={`${styles.formField} ${styles.fullWidth}`}>
                  <label>Special Requests</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Dietary requirements, accessibility needs, early check-in…"
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles.policyBox}>
                <ShieldCheck size={18} className={styles.policyIcon} />
                <div>
                  <strong>Cancellation Policy</strong>
                  <p>
                    Free cancellation up to {hotel.policies.freeCancellationHours}h before check-in.
                    After that, {hotel.policies.lateCancellationPenaltyPercent}% penalty applies.
                  </p>
                </div>
              </div>

              <Button
                id="checkout-hold-btn"
                variant="primary"
                size="lg"
                onClick={handleHold}
                disabled={!guestName || !guestEmail}
                style={{ width: '100%', marginTop: '24px' }}
              >
                <CreditCard size={18} /> Reserve Now — {formatInr(quote.totalPricePaise)}
              </Button>
            </section>
          )}

          {step === 'processing' && (
            <div className={styles.processing}>
              <div className={styles.spinner} />
              <p>Securing your room…</p>
            </div>
          )}

          {step === 'confirmed' && booking && (
            <section className={styles.card}>
              <div className={styles.holdBanner}>
                <Clock size={20} />
                <div>
                  <strong>Room held for {countdown}</strong>
                  <p>Complete payment to confirm your reservation</p>
                </div>
              </div>

              <div className={styles.bookingRef}>
                <span className={styles.refLabel}>Reference</span>
                <span className={styles.refValue}>{booking.reference}</span>
              </div>

              <p className={styles.holdNote}>
                This is a <strong>hold</strong>, not a confirmed booking. Click confirm below to
                complete your reservation.
              </p>

              <Button
                id="checkout-confirm-btn"
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                style={{ width: '100%', marginTop: '24px' }}
              >
                <CheckCircle2 size={18} /> Confirm Booking
              </Button>
            </section>
          )}

          {step === 'error' && (
            <section className={`${styles.card} ${styles.errorCard}`}>
              <AlertTriangle size={32} className={styles.errorIcon} />
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <Button
                id="checkout-retry-btn"
                variant="ghost"
                onClick={() => {
                  setStep('review');
                  setError('');
                }}
              >
                Try Again
              </Button>
            </section>
          )}
        </div>

        {/* Right: Summary */}
        <aside className={styles.summary}>
          <div className={styles.hotelImage}>
            {hotel.images[0] && <img src={hotel.images[0].url} alt={hotel.name} />}
          </div>
          <div className={styles.summaryContent}>
            <h3 className={styles.summaryHotel}>{hotel.name}</h3>
            <p className={styles.summaryCity}>
              {hotel.city}, {hotel.state}
            </p>

            {roomType && <p className={styles.summaryRoom}>{roomType.name}</p>}

            <div className={styles.summaryDates}>
              <div className={styles.summaryDate}>
                <span className={styles.dateLabel}>Check-in</span>
                <span className={styles.dateValue}>
                  {format(new Date(checkIn), 'EEE, d MMM yyyy')}
                </span>
              </div>
              <div className={styles.summaryDate}>
                <span className={styles.dateLabel}>Check-out</span>
                <span className={styles.dateValue}>
                  {format(new Date(checkOut), 'EEE, d MMM yyyy')}
                </span>
              </div>
            </div>

            <div className={styles.summaryLine}>
              <span>
                {nights} night{nights > 1 ? 's' : ''} × {adults} guest{adults > 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.totalAmount}>{formatInr(quote.totalPricePaise)}</span>
            </div>

            <p className={styles.summaryNote}>Taxes & fees included</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
