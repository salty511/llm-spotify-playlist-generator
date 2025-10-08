import axios from 'axios';

/**
 * Client for FastAPI-backed Spotify OAuth (Authorization Code flow).
 * Backend endpoints implemented in Python FastAPI:
 *  - GET  /auth/login?redirect={true|false}
 *  - GET  /auth/callback?code=...&state=...
 *  - POST /auth/refresh { refresh_token }
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log(API_BASE_URL)

export type AuthLoginResponse = {
  auth_url: string;
  state: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

/**
 * Obtain the Spotify authorization URL from backend (no redirect).
 * Your UI can then set window.location to the returned auth_url.
 */
export async function getAuthUrl(): Promise<AuthLoginResponse> {
  const res = await axios.get<AuthLoginResponse>(`${API_BASE_URL}/auth/login`, {
    params: { redirect: false },
  });
  return res.data;
}

/**
 * Directly redirect the browser to the backend which will 302 to Spotify.
 * Useful for simple flows.
 */
export function redirectToLogin(): void {
  window.location.href = `${API_BASE_URL}/auth/login?redirect=true`;
}

/**
 * Helper to extract "code" and "state" query params from the current URL after redirect back.
 */
export function getCodeFromRedirectUrl(): { code: string | null; state: string | null } {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  return { code, state };
}

/**
 * Exchange authorization code for tokens via backend.
 */
export async function exchangeCodeForToken(code: string, state?: string | null): Promise<TokenResponse> {
  const res = await axios.get<TokenResponse>(`${API_BASE_URL}/auth/callback`, {
    params: { code, state },
  });
  return res.data;
}

/**
 * Refresh access token using a refresh token via backend.
 */
export async function refreshAccessToken(refresh_token: string): Promise<TokenResponse> {
  const res = await axios.post<TokenResponse>(`${API_BASE_URL}/auth/refresh`, { refresh_token });
  return res.data;
}
