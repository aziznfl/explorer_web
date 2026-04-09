export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    limit: number;
    lastId?: string;
    hasMore?: boolean;
  };
}
