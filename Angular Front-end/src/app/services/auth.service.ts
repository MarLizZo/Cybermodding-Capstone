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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILoginData } from '../interfaces/ilogin-data';
import { IRegisterData } from '../interfaces/iregister-data';
import { IRegisterResponse } from '../interfaces/iregister-response';
import { IPingData } from '../interfaces/iping-data';
import { IStorageUserData } from '../interfaces/istorage-user-data';
import { Router } from '@angular/router';
import { IUploadAvRes } from '../interfaces/iupload-av-res';

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
  private checkValSub!: Subscription;
  public user_id: number = 0;
  private initalizedInfo = new BehaviorSubject<boolean>(false);
  intialized$ = this.initalizedInfo.asObservable().pipe(map((init) => init));

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
            this.initalizedInfo.next(true);
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
            this.user_id = user!.user_id;
          } else {
            localStorage.removeItem('user');
            this.router.navigate(['/auth/login/tk']);
          }
          this.initalizedInfo.next(true);
          this.checkValSub.unsubscribe();
        });
    } else {
      this.initalizedInfo.next(true);
    }
  }

  ping(username: string, tk: string): Observable<IPingData> {
    return this.http.get<IPingData>(
      this.apiUrl + '/ping?u=' + username + '&t=' + tk
    );
  }

  login(data: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.apiUrl + '/login', data).pipe(
      take(1),
      tap((res) => {
        // console.log(res);
        this.subj.next(res);
        const obj: privObj = {
          isMod: res.accessToken.endsWith('2b'),
          isAdmin: res.accessToken.endsWith('9s'),
        };
        this.privilegeSubj.next(obj);
        this.user_id = res.user_id;
        localStorage.setItem(
          'user',
          JSON.stringify({
            username: res.username,
            accessToken: res.accessToken,
            user_id: res.user_id,
          })
        );
      })
    );
  }

  register(data: IRegisterData, tmpAvs: string): Observable<IRegisterResponse> {
    const formData = new FormData();
    if (data.avatar) {
      formData.append('avatar', data.avatar as File);
    }
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('description', data.description);
    formData.append('birthdate', data.birthdate.toString());
    formData.append('tmpPaths', tmpAvs);

    let regEP = data.avatar ? '/registerWAv' : '/register';

    return this.http
      .post<IRegisterResponse>(this.apiUrl + regEP, formData)
      .pipe(
        tap((res) => {
          // console.log(res);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.subj.next(null);
    this.privilegeSubj.next(null);
  }

  uploadAvatarTest(file: any): Observable<IUploadAvRes> {
    return this.http.post<IUploadAvRes>(this.apiUrl + '/avatarTest', file);
  }
}
