import React, { useEffect, useState, useRef } from 'react';
import { adminApi } from '../../services/api.js';
import { getSocket } from '../../services/socket.js';
import { addDays, format, startOfDay, differenceInCalendarDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import styles from './TapeChartPage.module.css';

const DAY_WIDTH = 60; // px per day column

interface Room {
  _id: string;
  number: string;
  roomType: { name: string };
}
interface Booking {
  _id: string;
  reference: string;
  checkIn: string;
  checkOut: string;
  status: string;
  guestDetails: { name: string };
  room?: string | { _id: string; number: string };
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#1f6f78',
  checked_in: '#1b7a43',
  checked_out: '#748c8e',
  cancelled: '#d9482b',
  hold: '#9e6400',
};

export const TapeChartPage: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [numDays] = useState(14);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adminApi.getHotels().then((r) => {
      setHotels(r.data.data.hotels);
      if (r.data.data.hotels.length > 0) {
        setSelectedHotel(r.data.data.hotels[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedHotel) return;
    loadChart();
  }, [selectedHotel, startDate]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('availability:changed', () => {
      if (selectedHotel) loadChart();
    });
    return () => {
      socket.off('availability:changed');
    };
  }, [selectedHotel, startDate]);

  const loadChart = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getTapeChart(
        selectedHotel,
        startDate.toISOString().split('T')[0],
        numDays,
      );
      const { rooms: r, bookings: b, dateRange: dr } = res.data.data;
      setRooms(r);
      setBookings(b);
      setDateRange(dr.map((d: string) => new Date(d)));
    } finally {
      setIsLoading(false);
    }
  };

  const shiftDays = (n: number) => setStartDate(addDays(startDate, n));

  // Map booking to its position on the tape
  const getBookingStyle = (booking: Booking, dayCount: number) => {
    const checkIn = startOfDay(new Date(booking.checkIn));
    const checkOut = startOfDay(new Date(booking.checkOut));
    const rangeStart = startDate;
    const rangeEnd = addDays(startDate, dayCount);

    const visibleStart = checkIn < rangeStart ? rangeStart : checkIn;
    const visibleEnd = checkOut > rangeEnd ? rangeEnd : checkOut;

    const left = differenceInCalendarDays(visibleStart, rangeStart) * DAY_WIDTH;
    const width = differenceInCalendarDays(visibleEnd, visibleStart) * DAY_WIDTH - 4;
    const color = STATUS_COLORS[booking.status] || '#748c8e';

    return { left, width: Math.max(width, 4), color };
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tape Chart</h1>
        <div className={styles.controls}>
          <select
            className={styles.hotelSelect}
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
          >
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
          <button className={styles.navBtn} onClick={() => shiftDays(-7)}>
            <ChevronLeft size={16} /> 7d
          </button>
          <span className={styles.dateRange}>
            {format(startDate, 'd MMM')} – {format(addDays(startDate, numDays - 1), 'd MMM yyyy')}
          </span>
          <button className={styles.navBtn} onClick={() => shiftDays(7)}>
            7d <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className={styles.chartWrap}>
        {/* Room number column */}
        <div className={styles.roomCol}>
          <div className={styles.roomColHeader}>Room</div>
          {rooms.map((room) => (
            <div key={room._id} className={styles.roomCell}>
              <span className={styles.roomNum}>{room.number}</span>
              <span className={styles.roomType}>{room.roomType?.name}</span>
            </div>
          ))}
        </div>

        {/* Scrollable grid */}
        <div className={styles.gridWrap} ref={gridRef}>
          {/* Date headers */}
          <div className={styles.dateHeaders} style={{ width: dateRange.length * DAY_WIDTH }}>
            {dateRange.map((date, i) => {
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const isWeekend = [0, 6].includes(date.getDay());
              return (
                <div
                  key={i}
                  className={`${styles.dateHeader} ${isToday ? styles.today : ''} ${isWeekend ? styles.weekend : ''}`}
                  style={{ width: DAY_WIDTH }}
                >
                  <span className={styles.dateDay}>{format(date, 'EEE')}</span>
                  <span className={styles.dateNum}>{format(date, 'd')}</span>
                </div>
              );
            })}
          </div>

          {/* Room rows */}
          {rooms.map((room) => {
            const roomBookings = bookings.filter((b) => {
              const bRoomId = typeof b.room === 'object' ? b.room?._id : b.room;
              return bRoomId === room._id;
            });

            return (
              <div
                key={room._id}
                className={styles.roomRow}
                style={{ width: dateRange.length * DAY_WIDTH }}
              >
                {/* Day cells background */}
                {dateRange.map((date, i) => {
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  const isWeekend = [0, 6].includes(date.getDay());
                  return (
                    <div
                      key={i}
                      className={`${styles.dayCell} ${isToday ? styles.todayCell : ''} ${isWeekend ? styles.weekendCell : ''}`}
                      style={{ width: DAY_WIDTH }}
                    />
                  );
                })}

                {/* Booking bars */}
                {roomBookings.map((booking) => {
                  const { left, width, color } = getBookingStyle(booking, numDays);
                  if (width <= 0) return null;
                  return (
                    <div
                      key={booking._id}
                      className={styles.bookingBar}
                      style={{ left, width, background: color }}
                      title={`${booking.reference} — ${booking.guestDetails?.name}`}
                    >
                      <span className={styles.barText}>
                        {booking.guestDetails?.name || booking.reference}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {isLoading && <div className={styles.loadingOverlay}>Loading…</div>}
          {!isLoading && rooms.length === 0 && (
            <div className={styles.empty}>Select a hotel to view the tape chart</div>
          )}
        </div>
      </div>
    </div>
  );
};
