import { HttpStatusCode } from '@angular/common/http';

export interface ICustomResponse {
  timestamp: Date;
  message: string;
  status: HttpStatusCode;
}
