export interface ErrorResponse {
  ok: boolean,
  message?: string,
  errors?: {
    email?: string;
    general?: string;
  }
}