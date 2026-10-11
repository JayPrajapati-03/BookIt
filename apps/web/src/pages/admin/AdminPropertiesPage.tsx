import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api.js';
import { Badge } from '../../components/common/index.js';
import { ExternalLink } from 'lucide-react';
import styles from './AdminPropertiesPage.module.css';

type Hotel = {
  _id: string;
  name: string;
  slug: string;
  city: string;
  status: string;
  starRating?: number;
  ratingAvg?: number;
  fromPricePaise?: number;
};

export const AdminPropertiesPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi
      .getHotels()
      .then((res) => setHotels(res.data.data.hotels || []))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredHotels = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return hotels;

    return hotels.filter((hotel) =>
      [hotel.name, hotel.city, hotel.status].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [hotels, search]);

  const formatINR = (paise?: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format((paise || 0) / 100);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Properties</h1>
          <p className={styles.subtitle}>Review published and draft boutique stays.</p>
        </div>
        <input
          className={styles.searchInput}
          placeholder="Search property, city, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Property</th>
              <th>City</th>
              <th>Status</th>
              <th>Stars</th>
              <th>Rating</th>
              <th>From</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.map((hotel) => (
              <tr key={hotel._id} className={styles.row}>
                <td>
                  <div className={styles.propertyCell}>
                    <span className={styles.propertyName}>{hotel.name}</span>
                    <span className={styles.propertySlug}>{hotel.slug}</span>
                  </div>
                </td>
                <td>{hotel.city}</td>
                <td>
                  <Badge variant={hotel.status === 'published' ? 'success' : 'neutral'}>
                    {hotel.status}
                  </Badge>
                </td>
                <td>{hotel.starRating ? `${hotel.starRating} star` : '-'}</td>
                <td>{hotel.ratingAvg ? hotel.ratingAvg.toFixed(1) : '-'}</td>
                <td>{formatINR(hotel.fromPricePaise)}</td>
                <td>
                  <Link className={styles.viewLink} to={`/hotels/${hotel.slug}`}>
                    <ExternalLink size={15} />
                  </Link>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={7} className={styles.loading}>
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && filteredHotels.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
