import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { format, subDays } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import styles from './AdminReportsPage.module.css';

const formatInr = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`;

const PIE_COLORS = ['#1f6f78', '#2d8a6e', '#f2b33d', '#d9482b', '#748c8e', '#9e6400'];

export const AdminReportsPage: React.FC = () => {
  const [from, setFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getReports(from, to);
      setData(res.data.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalRevenue = data?.dailyRevenue?.reduce((acc: number, d: any) => acc + d.revenue, 0) || 0;
  const totalBookings = data?.byStatus?.reduce((acc: number, s: any) => acc + s.count, 0) || 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reports</h1>
        <div className={styles.dateFilters}>
          <label>
            From{' '}
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={styles.dateInput}
            />
          </label>
          <label>
            To{' '}
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={styles.dateInput}
            />
          </label>
          <button className={styles.applyBtn} onClick={load}>
            Apply
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading reports…</div>
      ) : (
        <div className={styles.content}>
          {/* Summary */}
          <div className={styles.summaryRow}>
            <div className={styles.summaryCard}>
              <p className={styles.summaryValue}>{formatInr(totalRevenue)}</p>
              <p className={styles.summaryLabel}>Total Revenue</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryValue}>{totalBookings}</p>
              <p className={styles.summaryLabel}>Total Bookings</p>
            </div>
            <div className={styles.summaryCard}>
              <p className={styles.summaryValue}>
                {totalBookings > 0 ? formatInr(Math.round(totalRevenue / totalBookings)) : '—'}
              </p>
              <p className={styles.summaryLabel}>Avg. Booking Value</p>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            {/* Daily Revenue */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Daily Revenue</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={(data?.dailyRevenue || []).map((d: any) => ({
                    date: d._id.slice(5),
                    revenue: d.revenue / 100,
                  }))}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip formatter={(v: any) => `₹${v.toLocaleString('en-IN')}`} />
                  <Bar dataKey="revenue" fill="#1f6f78" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Booking Status Pie */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Bookings by Status</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={(data?.byStatus || []).map((s: any) => ({ name: s._id, value: s.count }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {(data?.byStatus || []).map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Hotels */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Top Properties by Revenue</h3>
              <div className={styles.topHotels}>
                {(data?.byHotel || []).slice(0, 8).map((h: any, i: number) => (
                  <div key={i} className={styles.hotelRow}>
                    <span className={styles.hotelRank}>{i + 1}</span>
                    <div className={styles.hotelInfo}>
                      <span className={styles.hotelName}>{h.hotel?.name}</span>
                      <span className={styles.hotelCity}>{h.hotel?.city}</span>
                    </div>
                    <div className={styles.hotelStats}>
                      <span className={styles.hotelRevenue}>{formatInr(h.revenue)}</span>
                      <span className={styles.hotelCount}>{h.count} bookings</span>
                    </div>
                  </div>
                ))}
                {(data?.byHotel || []).length === 0 && <p className={styles.noData}>No data yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
