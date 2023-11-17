export interface DecodedToken {
  Id: string;
  email: string;
  exp: number;
  iat: number;
  nbf: number;
  unique_name: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}
