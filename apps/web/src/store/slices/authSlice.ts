import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { setAccessToken } from '../../services/api.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'staff' | 'admin';
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      setAccessToken(action.payload.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookit_logged_in', 'true');
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      setAccessToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bookit_logged_in');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
