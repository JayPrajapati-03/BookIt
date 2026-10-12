import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { Button } from '../../components/common/index.js';
import styles from './AdminBookingsPage.module.css';

export const AdminWalkInPage: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [hotelId, setHotelId] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getHotels().then((res) => setHotels(res.data.data.hotels));
  }, []);

  useEffect(() => {
    if (!hotelId) return;
    adminApi.getRoomTypes(hotelId).then((res) => setRoomTypes(res.data.data.roomTypes));
  }, [hotelId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.createWalkIn({
        roomTypeId,
        checkIn,
        checkOut,
        adults: 1,
        children: 0,
        guestDetails: { name, email, phone },
      });
      setName('');
      setEmail('');
      setPhone('');
      setRoomTypeId('');
      alert('Walk-in booking created');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Walk-in</h1>
          <p className={styles.subtitle}>Create a front-desk booking</p>
        </div>
      </div>

      <form className={styles.tableWrap} style={{ padding: 20, maxWidth: 640 }} onSubmit={submit}>
        <div className={styles.toolbar}>
          <select
            className={styles.searchInput}
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            required
          >
            <option value="">Select hotel</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
          <select
            className={styles.searchInput}
            value={roomTypeId}
            onChange={(e) => setRoomTypeId(e.target.value)}
            required
          >
            <option value="">Select room type</option>
            {roomTypes.map((rt) => (
              <option key={rt._id} value={rt._id}>
                {rt.name}
              </option>
            ))}
          </select>
          <input
            className={styles.searchInput}
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
          <input
            className={styles.searchInput}
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
          <input
            className={styles.searchInput}
            placeholder="Guest name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={styles.searchInput}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.searchInput}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <Button variant="primary" disabled={saving}>
          {saving ? 'Creating...' : 'Create Walk-in'}
        </Button>
      </form>
    </div>
  );
};
