import { AuthError } from "./interfaces";

export function authError(message: string, status: number) {
  const error = new Error(message) as AuthError;
  error.status = status;
  return error;
}
