export interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}
