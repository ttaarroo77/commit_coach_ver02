export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}