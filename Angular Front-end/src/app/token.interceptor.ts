import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private svc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.svc.user$.pipe(
      take(1),
      switchMap((val) => {
        return val
          ? next.handle(
              request.clone({
                headers: request.headers.append(
                  'Authorization',
                  'Bearer ' +
                    val.accessToken.slice(0, val.accessToken.length - 2)
                ),
              })
            )
          : next.handle(request);
      })
    );
  }
}
