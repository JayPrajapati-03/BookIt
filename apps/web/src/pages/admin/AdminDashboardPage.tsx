import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { getSocket } from '../../services/socket.js';
import {
  TrendingUp,
  Users,
  BedDouble,
  BarChart2,
  CalendarCheck,
  Clock,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import styles from './AdminDashboardPage.module.css';

const formatInr = (p: number) => `₹${(p / 100).toLocaleString('en-IN')}`;

interface KPIs {
  totalBookings: number;
  confirmedToday: number;
  arrivalsToday: number;
  departuresToday: number;
  occupancyRate: number;
  revenue30dPaise: number;
  adrPaise: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [dashRes, reportRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getReports(),
      ]);
      setKpis(dashRes.data.data.kpis);
      setRevenue(reportRes.data.data.dailyRevenue || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live refresh on availability changes
    const socket = getSocket();
    socket.on('availability:changed', () => loadData());
    return () => {
      socket.off('availability:changed');
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.kpiGrid}>
          {[...Array(7)].map((_, i) => (
            <div key={i} className={styles.kpiSkeleton} />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Occupancy Rate',
      value: `${kpis?.occupancyRate ?? 0}%`,
      icon: <BedDouble size={20} />,
      color: '#1f6f78',
    },
    {
      label: 'Revenue (30d)',
      value: formatInr(kpis?.revenue30dPaise ?? 0),
      icon: <TrendingUp size={20} />,
      color: '#2d8a6e',
    },
    {
      label: 'ADR',
      value: formatInr(kpis?.adrPaise ?? 0),
      icon: <BarChart2 size={20} />,
      color: '#5b7f8a',
    },
    {
      label: 'Total Bookings',
      value: kpis?.totalBookings ?? 0,
      icon: <CalendarCheck size={20} />,
      color: '#f2b33d',
    },
    {
      label: 'Confirmed Today',
      value: kpis?.confirmedToday ?? 0,
      icon: <Activity size={20} />,
      color: '#1b7a43',
    },
    {
      label: 'Arrivals Today',
      value: kpis?.arrivalsToday ?? 0,
      icon: <ArrowUpRight size={20} />,
      color: '#0f2b2e',
    },
    {
      label: 'Departures Today',
      value: kpis?.departuresToday ?? 0,
      icon: <Clock size={20} />,
      color: '#9e6400',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Operations Dashboard</h1>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} /> Live
        </span>
      </div>

      <div className={styles.kpiGrid}>
        {kpiCards.map((card) => (
          <div key={card.label} className={styles.kpiCard}>
            <div
              className={styles.kpiIcon}
              style={{ background: `${card.color}20`, color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <p className={styles.kpiValue}>{card.value}</p>
              <p className={styles.kpiLabel}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Daily Revenue (30 days)</h3>
          {revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenue.map((r) => ({ date: r._id, revenue: r.revenue / 100 }))}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f6f78" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1f6f78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip formatter={(v: any) => `₹${v.toLocaleString('en-IN')}`} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1f6f78"
                  fill="url(#revenueGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No revenue data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};
