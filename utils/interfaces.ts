export interface AuthError extends Error {
  status: number;
}

export interface JwtPayload {
  email: string;
}
