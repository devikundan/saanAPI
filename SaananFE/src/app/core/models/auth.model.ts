export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  fullName: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
