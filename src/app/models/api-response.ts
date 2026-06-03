export interface ApiResponse<T = null> {
  statusCode: number;
  message?: string | null;
  data?: T | null;
}
