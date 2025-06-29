export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    totalPages: number
  }
}
