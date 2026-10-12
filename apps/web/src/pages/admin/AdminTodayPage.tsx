import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { format, isSameDay } from 'date-fns';
import { Badge } from '../../components/common/index.js';
import styles from './AdminBookingsPage.module.css';

const STATUS_VARIANTS: Record<string, any> = {
  confirmed: 'success',
  hold: 'warning',
  checked_in: 'success',
  checked_out: 'neutral',
  cancelled: 'danger',
  no_show: 'danger',
};

export const AdminTodayPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    adminApi
      .getBookings({ limit: 100 })
      .then((res) => setBookings(res.data.data.bookings))
      .finally(() => setIsLoading(false));
  }, []);

  const arrivals = bookings.filter((b) => isSameDay(new Date(b.checkIn), today));
  const departures = bookings.filter((b) => isSameDay(new Date(b.checkOut), today));
  const inHouse = bookings.filter(
    (b) =>
      new Date(b.checkIn) <= today && new Date(b.checkOut) > today && b.status === 'checked_in',
  );

  const rows = [
    ...arrivals.map((b) => ({ ...b, task: 'Arrival' })),
    ...departures.map((b) => ({ ...b, task: 'Departure' })),
    ...inHouse.map((b) => ({ ...b, task: 'In-house' })),
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Today</h1>
          <p className={styles.subtitle}>{format(today, 'EEE, d MMM yyyy')}</p>
        </div>
      </div>

      <div className={styles.statusFilters} style={{ marginBottom: 16 }}>
        <span className={styles.chip}>Arrivals: {arrivals.length}</span>
        <span className={styles.chip}>Departures: {departures.length}</span>
        <span className={styles.chip}>In-house: {inHouse.length}</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Task</th>
              <th>Reference</th>
              <th>Hotel</th>
              <th>Guest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={`${b.task}-${b._id}`} className={styles.row}>
                <td>{b.task}</td>
                <td>
                  <code className={styles.ref}>{b.reference}</code>
                </td>
                <td className={styles.hotelCell}>{b.hotel?.name}</td>
                <td>{b.guestDetails?.name || b.guest?.name}</td>
                <td>
                  <Badge variant={STATUS_VARIANTS[b.status] || 'neutral'}>
                    {b.status.replace('_', ' ')}
                  </Badge>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={5} className={styles.loading}>
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No arrivals, departures, or in-house guests today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
