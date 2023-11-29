export interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
}
