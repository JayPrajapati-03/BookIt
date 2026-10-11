import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { Badge } from '../../components/common/index.js';
import { ShieldAlert } from 'lucide-react';
import styles from './AdminAuditPage.module.css';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const load = async (reset = true) => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAuditLogs(reset ? undefined : cursor);
      const data = res.data.data;
      if (reset) setLogs(data.logs);
      else setLogs((prev) => [...prev, ...data.logs]);
      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <ShieldAlert size={24} className={styles.headerIcon} />
        <h1 className={styles.title}>Audit Logs</h1>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Outcome</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className={styles.row}>
                <td className={styles.time}>
                  {new Date(log.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  <span className={styles.userName}>{log.user?.name || '—'}</span>
                  <span className={styles.userEmail}>{log.user?.email}</span>
                </td>
                <td>
                  <code className={styles.action}>{log.action}</code>
                </td>
                <td className={styles.resource}>
                  {log.resource}
                  {log.resourceId && (
                    <span className={styles.resourceId}>
                      {' '}
                      #{log.resourceId.toString().slice(-6)}
                    </span>
                  )}
                </td>
                <td>
                  <Badge variant={log.outcome === 'success' ? 'success' : 'danger'}>
                    {log.outcome}
                  </Badge>
                </td>
                <td className={styles.ip}>{log.ip || '—'}</td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={6} className={styles.loading}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && logs.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No audit logs found
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
