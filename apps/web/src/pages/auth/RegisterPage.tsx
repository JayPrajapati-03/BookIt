import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '@bookit/shared';
import { Button, Field } from '../../components/common/index.js';
import { apiClient } from '../../services/api.js';
import { useAppDispatch } from '../../store/hooks.js';
import { setCredentials } from '../../store/slices/authSlice.js';
import { toast } from 'sonner';
import styles from './LoginPage.module.css';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', data);
      const { user, accessToken } = response.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Account created successfully! Welcome to BookIt.');
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
      const message =
        axiosErr.response?.data?.error?.message || 'Registration failed. Please check your inputs.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Book boutique stays with real-time room confirmation</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Field
            label="Full Name"
            placeholder="Aditi Sharma"
            error={errors.name?.message}
            required
            {...register('name')}
          />

          <Field
            label="Email Address"
            type="email"
            placeholder="aditi@example.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <Field
            label="Mobile Phone (optional)"
            type="tel"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Field
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            error={errors.password?.message}
            required
            {...register('password')}
          />

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className={styles.footerLinks}>
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className={styles.link}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
