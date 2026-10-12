import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginSchema, type LoginInput } from '@bookit/shared';
import { Button, Field } from '../../components/common/index.js';
import { apiClient } from '../../services/api.js';
import { useAppDispatch } from '../../store/hooks.js';
import { setCredentials } from '../../store/slices/authSlice.js';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
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
      if (redirect) {
        navigate(redirect);
      } else if (user.role === 'admin' || user.role === 'staff') {
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
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')}
          />

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className={styles.footerLinks}>
          Don't have an account?{' '}
          <Link
            to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
            className={styles.link}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
