import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsApi } from '../../services/api.js';
import { useAppSelector } from '../../store/hooks.js';
import { format } from 'date-fns';
import { Badge, Button, Skeleton } from '../../components/common/index.js';
import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Users,
  Home,
  Star,
  AlertTriangle,
} from 'lucide-react';
import styles from './BookingDetailPage.module.css';

const formatInr = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

const statusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ReactNode }
> = {
  confirmed: { label: 'Confirmed', variant: 'success', icon: <CheckCircle2 size={16} /> },
  hold: { label: 'Hold', variant: 'warning', icon: <Clock size={16} /> },
  checked_in: { label: 'Checked In', variant: 'success', icon: <CheckCircle2 size={16} /> },
  checked_out: { label: 'Checked Out', variant: 'neutral', icon: <CheckCircle2 size={16} /> },
  cancelled: { label: 'Cancelled', variant: 'danger', icon: <XCircle size={16} /> },
  no_show: { label: 'No Show', variant: 'danger', icon: <AlertTriangle size={16} /> },
};

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((s) => s.auth);
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!id) return;
    bookingsApi
      .get(id)
      .then((res) => {
        setBooking(res.data.data.booking);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!booking) return;
    setCancelling(true);
    try {
      const res = await bookingsApi.cancel(booking._id, cancelReason);
      setBooking(res.data.data.booking);
      setShowCancelDialog(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton height={40} style={{ marginBottom: 24 }} />
        <Skeleton height={200} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <AlertTriangle size={48} />
          <h2>Booking not found</h2>
          <Link to="/dashboard">View all bookings</Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[booking.status] || statusConfig.hold;
  const hotel = booking.hotel;
  const roomType = booking.roomType;
  const canCancel = ['hold', 'confirmed'].includes(booking.status);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link to="/dashboard" className={styles.back}>
            ← My Bookings
          </Link>
          <h1 className={styles.reference}>{booking.reference}</h1>
        </div>
        <Badge variant={status.variant}>
          {status.icon} {status.label}
        </Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          {/* Hotel Info */}
          <div className={styles.card}>
            <div className={styles.hotelCard}>
              {hotel?.images?.[0] && (
                <img src={hotel.images[0].url} alt={hotel.name} className={styles.hotelImg} />
              )}
              <div>
                <h2 className={styles.hotelName}>{hotel?.name}</h2>
                <p className={styles.hotelCity}>
                  <MapPin size={14} /> {hotel?.city}
                </p>
                {roomType && (
                  <p className={styles.roomName}>
                    <Home size={14} /> {roomType.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Stay Details</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <Calendar size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Check-in</span>
                  <span className={styles.detailValue}>
                    {format(new Date(booking.checkIn), 'EEE, d MMMM yyyy')}
                  </span>
                  <span className={styles.detailSub}>
                    {hotel?.policies?.checkInTime || '14:00'}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Calendar size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Check-out</span>
                  <span className={styles.detailValue}>
                    {format(new Date(booking.checkOut), 'EEE, d MMMM yyyy')}
                  </span>
                  <span className={styles.detailSub}>
                    {hotel?.policies?.checkOutTime || '11:00'}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Clock size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Duration</span>
                  <span className={styles.detailValue}>
                    {booking.nights} night{booking.nights > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Users size={16} className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Guests</span>
                  <span className={styles.detailValue}>
                    {booking.adults} adult{booking.adults > 1 ? 's' : ''}
                    {booking.children > 0 &&
                      `, ${booking.children} child${booking.children > 1 ? 'ren' : ''}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Guest Details</h3>
            <dl className={styles.guestList}>
              <div className={styles.guestRow}>
                <dt>Name</dt>
                <dd>{booking.guestDetails.name}</dd>
              </div>
              <div className={styles.guestRow}>
                <dt>Email</dt>
                <dd>{booking.guestDetails.email}</dd>
              </div>
              {booking.guestDetails.phone && (
                <div className={styles.guestRow}>
                  <dt>Phone</dt>
                  <dd>{booking.guestDetails.phone}</dd>
                </div>
              )}
              {booking.guestDetails.requests && (
                <div className={styles.guestRow}>
                  <dt>Requests</dt>
                  <dd className={styles.requests}>{booking.guestDetails.requests}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Cancellation Info */}
          {booking.cancellationInfo && (
            <div className={`${styles.card} ${styles.cancelCard}`}>
              <h3 className={styles.cardTitle}>Cancellation Details</h3>
              <p>
                Cancelled on{' '}
                {format(new Date(booking.cancellationInfo.cancelledAt), 'dd MMM yyyy, HH:mm')}
              </p>
              {booking.cancellationInfo.reason && <p>Reason: {booking.cancellationInfo.reason}</p>}
              <div className={styles.refundRow}>
                <span>Refund: {formatInr(booking.cancellationInfo.refundPaise)}</span>
                {booking.cancellationInfo.penaltyPaise > 0 && (
                  <span className={styles.penalty}>
                    Penalty: {formatInr(booking.cancellationInfo.penaltyPaise)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <div className={styles.priceRow}>
              <span>Total Paid</span>
              <span className={styles.priceTotal}>{formatInr(booking.totalPricePaise)}</span>
            </div>
            <p className={styles.priceSub}>Including all taxes & fees</p>
          </div>

          {canCancel && (
            <Button
              id="booking-cancel-btn"
              variant="ghost"
              size="sm"
              onClick={() => setShowCancelDialog(true)}
              style={{
                width: '100%',
                marginTop: 12,
                borderColor: 'var(--status-danger)',
                color: 'var(--status-danger)',
              }}
            >
              Cancel Booking
            </Button>
          )}

          {booking.status === 'checked_out' && (
            <Link to={`/bookings/${booking._id}/review`}>
              <Button
                id="booking-review-btn"
                variant="secondary"
                size="sm"
                style={{ width: '100%', marginTop: 12 }}
              >
                <Star size={14} /> Leave a Review
              </Button>
            </Link>
          )}
        </aside>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <h3>Cancel Booking?</h3>
            <p className={styles.dialogText}>
              Free cancellation deadline: {booking.policySnapshot.freeCancellationHours}h before
              check-in. Cancellations after that incur a{' '}
              {booking.policySnapshot.lateCancellationPenaltyPercent}% penalty.
            </p>
            <textarea
              className={styles.reasonInput}
              placeholder="Reason (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
            <div className={styles.dialogActions}>
              <Button
                id="cancel-keep-btn"
                variant="ghost"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Booking
              </Button>
              <Button
                id="cancel-confirm-btn"
                variant="primary"
                onClick={handleCancel}
                disabled={cancelling}
                style={{ background: 'var(--status-danger)' }}
              >
                {cancelling ? 'Cancelling…' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
