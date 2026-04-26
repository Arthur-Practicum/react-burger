import { describe, it, expect, beforeEach } from 'vitest';

import reducer, {
  setAuthTokens,
  updateAccessToken,
  logout,
  restoreAuth,
  checkAuth,
  initialState,
} from './authSlice';

const mockUser = { email: 'test@example.com', name: 'Test User' };

const authenticatedState = {
  user: mockUser,
  accessToken: 'Bearer token123',
  refreshToken: 'refresh123',
  isAuthenticated: true,
  isInitialized: false,
  isLoading: false,
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('setAuthTokens', () => {
    it('sets user, tokens and isAuthenticated in state', () => {
      const state = reducer(
        undefined,

        setAuthTokens({
          user: mockUser,
          accessToken: 'Bearer token123',
          refreshToken: 'refresh123',
        })
      );

      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('Bearer token123');
      expect(state.refreshToken).toBe('refresh123');
      expect(state.isAuthenticated).toBe(true);
    });

    it('persists all auth data to localStorage', () => {
      reducer(
        undefined,
        setAuthTokens({
          user: mockUser,
          accessToken: 'Bearer token123',
          refreshToken: 'refresh123',
        })
      );

      expect(localStorage.getItem('accessToken')).toBe('Bearer token123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh123');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });
  });

  describe('updateAccessToken', () => {
    it('updates only the access token in state', () => {
      const state = reducer(authenticatedState, updateAccessToken('Bearer newtoken'));

      expect(state.accessToken).toBe('Bearer newtoken');
      expect(state.refreshToken).toBe('refresh123');
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('persists the new access token to localStorage', () => {
      reducer(authenticatedState, updateAccessToken('Bearer newtoken'));

      expect(localStorage.getItem('accessToken')).toBe('Bearer newtoken');
    });
  });

  describe('logout', () => {
    it('clears user and tokens from state', () => {
      const state = reducer(authenticatedState, logout());

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('removes all auth data from localStorage', () => {
      localStorage.setItem('accessToken', 'Bearer token123');
      localStorage.setItem('refreshToken', 'refresh123');
      localStorage.setItem('user', JSON.stringify(mockUser));

      reducer(authenticatedState, logout());

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('restoreAuth', () => {
    it('restores full auth state when all data is present in localStorage', () => {
      localStorage.setItem('accessToken', 'Bearer token123');
      localStorage.setItem('refreshToken', 'refresh123');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const state = reducer(undefined, restoreAuth());

      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('Bearer token123');
      expect(state.refreshToken).toBe('refresh123');
      expect(state.isAuthenticated).toBe(true);
    });

    it('does not change state when localStorage is empty', () => {
      const state = reducer(undefined, restoreAuth());

      expect(state).toEqual(initialState);
    });

    it('clears localStorage and leaves state unchanged when user JSON is invalid', () => {
      localStorage.setItem('accessToken', 'Bearer token123');
      localStorage.setItem('refreshToken', 'refresh123');
      localStorage.setItem('user', 'invalid-json{{{');

      const state = reducer(undefined, restoreAuth());

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('checkAuth extra reducers', () => {
    it('sets isLoading=true on pending', () => {
      const state = reducer(undefined, checkAuth.pending('requestId', undefined));

      expect(state.isLoading).toBe(true);
    });

    it('sets isInitialized=true and isLoading=false on fulfilled', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        checkAuth.fulfilled(undefined, 'requestId', undefined)
      );

      expect(state.isInitialized).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('clears auth state and sets isInitialized=true on rejected', () => {
      const state = reducer(
        authenticatedState,
        checkAuth.rejected(null, 'requestId', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isInitialized).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });
});
