
export interface BaseResponse<T> {
  detail: T;
}
export interface PaginatedBaseResponse<T> {
  detail: T;
  next: string;
  previous: string;
  next_c: string;
  previous_c: string;
}
export interface UserRegisterResponse {
  name: string;
  email: string;
}
