import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginInput } from '@bookit/shared';
import { Button, Field } from '../../components/common/index.js';
import { apiClient } from '../../services/api.js';
import { useAppDispatch } from '../../store/hooks.js';
import { setCredentials } from '../../store/slices/authSlice.js';
import { toast } from 'sonner';
import { Shield, User, UserCheck } from 'lucide-react';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { user, accessToken } = response.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}`);
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      const message =
        axiosErr.response?.data?.error?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email: string, role: string) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    toast.info(`Pre-filled credentials for ${role}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Manage your bookings or access the front desk</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Field
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>or reviewer 1-click demo</div>

        <div className={styles.demoBox}>
          <span className={styles.demoTitle}>Reviewer Demo Accounts</span>
          <div className={styles.demoButtons}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<User size={15} />}
              onClick={() => handleDemoLogin('demo_guest@bookit.internal', 'Guest')}
            >
              Continue as Guest
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<UserCheck size={15} />}
              onClick={() => handleDemoLogin('demo_staff@bookit.internal', 'Staff')}
            >
              Continue as Staff (Front Desk)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Shield size={15} />}
              onClick={() => handleDemoLogin('demo_admin@bookit.internal', 'Admin')}
            >
              Continue as Admin
            </Button>
          </div>
        </div>

        <div className={styles.footerLinks}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
