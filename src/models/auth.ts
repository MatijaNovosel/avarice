export interface DecodedToken {
  Id: string;
  email: string;
  exp: number;
  iat: number;
  nbf: number;
  unique_name: string;
}

export interface AuthResult {
  token: string;
  result: boolean;
  errors: string[];
}
