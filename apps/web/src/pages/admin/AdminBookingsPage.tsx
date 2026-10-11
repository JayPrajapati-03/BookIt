import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../services/api.js';
import { format } from 'date-fns';
import { Badge } from '../../components/common/index.js';
import { Search, Download, RefreshCw } from 'lucide-react';
import styles from './AdminBookingsPage.module.css';

const formatInr = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`;

const STATUS_VARIANTS: Record<string, any> = {
  confirmed: 'success',
  hold: 'warning',
  checked_in: 'success',
  checked_out: 'neutral',
  cancelled: 'danger',
  no_show: 'danger',
};

const STATUSES = ['', 'hold', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'];

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);

  const load = async (reset = false) => {
    setIsLoading(true);
    try {
      const res = await adminApi.getBookings({
        status: statusFilter || undefined,
        search: search || undefined,
        cursor: reset ? undefined : cursor,
        limit: 20,
      });
      const data = res.data.data;
      if (reset) {
        setBookings(data.bookings);
      } else {
        setBookings((prev) => [...prev, ...data.bookings]);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(true);
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(true);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    await adminApi.updateBookingStatus(bookingId, newStatus);
    setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
  };

  const exportCsv = () => {
    const header = 'Reference,Hotel,Guest,Email,Check-in,Check-out,Nights,Status,Total\n';
    const rows = bookings
      .map(
        (b) =>
          `${b.reference},${b.hotel?.name},${b.guestDetails?.name},${b.guestDetails?.email},${b.checkIn?.slice(0, 10)},${b.checkOut?.slice(0, 10)},${b.nights},${b.status},${b.totalPricePaise / 100}`,
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bookings</h1>
          <p className={styles.subtitle}>{total.toLocaleString()} total bookings</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={() => load(true)} title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button className={styles.iconBtn} onClick={exportCsv} title="Export CSV">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search reference, name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className={styles.statusFilters}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`${styles.chip} ${statusFilter === s ? styles.chipActive : ''}`}
              onClick={() => {
                setStatusFilter(s);
              }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Hotel</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className={styles.row}>
                <td>
                  <code className={styles.ref}>{b.reference}</code>
                </td>
                <td className={styles.hotelCell}>{b.hotel?.name}</td>
                <td>
                  <div className={styles.guestCell}>
                    <span>{b.guestDetails?.name || b.guest?.name}</span>
                    <span className={styles.guestEmail}>{b.guestDetails?.email}</span>
                  </div>
                </td>
                <td>{b.checkIn ? format(new Date(b.checkIn), 'd MMM yy') : '—'}</td>
                <td>{b.checkOut ? format(new Date(b.checkOut), 'd MMM yy') : '—'}</td>
                <td className={styles.center}>{b.nights}</td>
                <td>
                  <Badge variant={STATUS_VARIANTS[b.status] || 'neutral'}>
                    {b.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className={styles.price}>{formatInr(b.totalPricePaise)}</td>
                <td>
                  <select
                    className={styles.statusSelect}
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                  >
                    {STATUSES.filter(Boolean).map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={9} className={styles.loading}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && bookings.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button className={styles.loadMore} onClick={() => load(false)} disabled={isLoading}>
          Load more
        </button>
      )}
    </div>
  );
};
