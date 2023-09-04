import { HttpStatusCode } from '@angular/common/http';

export interface IErrorResponse {
  error: {
    timestamp: Date;
    status: string;
    message: string;
    details: string;
  };
  status: HttpStatusCode;
}
