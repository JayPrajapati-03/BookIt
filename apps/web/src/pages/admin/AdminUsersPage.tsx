import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { Badge, Button } from '../../components/common/index.js';
import { UserCog, Shield } from 'lucide-react';
import styles from './AdminUsersPage.module.css';

const ROLES = ['guest', 'staff', 'admin'];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  const load = async () => {
    setIsLoading(true);
    const res = await adminApi.getUsers({ search: search || undefined, limit: 50 });
    setUsers(res.data.data.users);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (userId: string) => {
    await adminApi.updateUserRole(userId, editRole);
    setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: editRole } : u)));
    setEditingId(null);
  };

  const ROLE_VARIANTS: Record<string, any> = {
    admin: 'danger',
    staff: 'warning',
    guest: 'neutral',
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className={styles.searchForm}
        >
          <input
            className={styles.searchInput}
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button id="user-search-btn" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={styles.row}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <span className={styles.userName}>{user.name}</span>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {editingId === user._id ? (
                    <div className={styles.editRole}>
                      <select
                        className={styles.roleSelect}
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button className={styles.saveBtn} onClick={() => handleRoleChange(user._id)}>
                        Save
                      </button>
                      <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <Badge variant={ROLE_VARIANTS[user.role] || 'neutral'}>{user.role}</Badge>
                  )}
                </td>
                <td className={styles.date}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                </td>
                <td>
                  <Badge
                    variant={
                      user.lockUntil && new Date(user.lockUntil) > new Date() ? 'danger' : 'success'
                    }
                  >
                    {user.lockUntil && new Date(user.lockUntil) > new Date() ? 'Locked' : 'Active'}
                  </Badge>
                </td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setEditingId(user._id);
                      setEditRole(user.role);
                    }}
                    title="Change role"
                  >
                    <UserCog size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={5} className={styles.loading}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
