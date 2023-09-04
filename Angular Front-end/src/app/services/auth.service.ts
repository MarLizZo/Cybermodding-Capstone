import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
  catchError,
  map,
  take,
  tap,
} from 'rxjs';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { HttpClient } from '@angular/common/http';
import { ILoginData } from '../interfaces/ilogin-data';
import { IRegisterData } from '../interfaces/iregister-data';
import { IRegisterResponse } from '../interfaces/iregister-response';
import { IPingData } from '../interfaces/iping-data';
import { IStorageUserData } from '../interfaces/istorage-user-data';
import { Router } from '@angular/router';

interface privObj {
  isMod: boolean;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = 'http://localhost:8080/api/auth';
  private subj = new BehaviorSubject<IStorageUserData | null>(null);
  user$ = this.subj.asObservable();
  isLogged$ = this.user$.pipe(map((l) => !!l));
  private privilegeSubj = new BehaviorSubject<privObj | null>(null);
  privileges$ = this.privilegeSubj.asObservable();
  hasPrivileges$ = this.privileges$.pipe(map((l) => !!l));
  private checkValSub!: Subscription;

  constructor(private http: HttpClient, private router: Router) {}

  checkUserDataValidity(): void {
    let chk: string | null = localStorage.getItem('user');
    let user: IStorageUserData | null = null;

    if (chk) {
      user = JSON.parse(chk);
      this.checkValSub = this.ping(
        user!.username,
        user!.accessToken.slice(0, user!.accessToken.length - 2)
      )
        .pipe(
          catchError((err) => {
            console.log('Mio log custom', err);
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.ok == true) {
            const obj: privObj = {
              isMod: user!.accessToken.endsWith('2b'),
              isAdmin: user!.accessToken.endsWith('9s'),
            };
            this.privilegeSubj.next(obj);
            this.subj.next(user);
          } else {
            console.log('INVALID TOKEN OR SERVER ERROR');
            localStorage.removeItem('user');
            this.router.navigate(['/auth/login/tk']);
          }
          this.checkValSub.unsubscribe();
        });
    } else {
      console.log('NOT LOGGED IN');
      // login again
      //this.login({ username: 'lizzo', password: 'qwerty' }).subscribe();
    }
  }

  ping(username: string, tk: string): Observable<IPingData> {
    return this.http.get<IPingData>(this.apiUrl + '/ping?u=' + username, {
      headers: {
        Authorization: 'Bearer ' + tk,
      },
    });
  }

  login(data: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.apiUrl + '/login', data).pipe(
      take(1),
      tap((res) => {
        console.log(res);
        this.subj.next(res);
        const obj: privObj = {
          isMod: res.isMod,
          isAdmin: res.isAdmin,
        };
        this.privilegeSubj.next(obj);
        localStorage.setItem(
          'user',
          JSON.stringify({
            username: res.username,
            accessToken: res.accessToken,
          })
        );
      })
    );
  }

  register(data: IRegisterData): Observable<IRegisterResponse> {
    return this.http
      .post<IRegisterResponse>(this.apiUrl + '/register', data)
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.subj.next(null);
    this.privilegeSubj.next(null);
  }
}
