import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, map, switchMap, take } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private svc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // const token = this.svc.userToken$;
    // if (token != '') {
    //   console.log(request.headers);
    //   let clonedRequest = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   return next.handle(clonedRequest);
    // } else {
    //   return next.handle(request);
    // }

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
