export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiMeta {
  message?: string;
  status?: number;
  [key: string]: any;
}
