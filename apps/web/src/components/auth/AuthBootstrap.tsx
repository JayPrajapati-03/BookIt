import React, { useEffect } from 'react';
import { apiClient } from '../../services/api.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { logout, setCredentials, setLoading } from '../../store/slices/authSlice.js';

let restorePromise: Promise<void> | null = null;

type AuthBootstrapProps = {
  children: React.ReactNode;
};

export const AuthBootstrap: React.FC<AuthBootstrapProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    const hasSession =
      typeof window !== 'undefined' && localStorage.getItem('bookit_logged_in') === 'true';

    if (!hasSession) {
      dispatch(setLoading(false));
      return;
    }

    if (!restorePromise) {
      restorePromise = apiClient
        .post('/auth/refresh', {})
        .then((res) => {
          const { user, accessToken } = res.data.data;
          dispatch(setCredentials({ user, accessToken }));
        })
        .catch(() => {
          dispatch(logout());
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      restorePromise.finally(() => {
        dispatch(setLoading(false));
      });
    }
  }, [dispatch]);

  if (isLoading) return null;

  return <>{children}</>;
};
