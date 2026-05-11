export class AppError extends Error {
  statusCode: number;
  details?: unknown;
  status?: string;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'Client Fail' : 'Server Error' 
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
