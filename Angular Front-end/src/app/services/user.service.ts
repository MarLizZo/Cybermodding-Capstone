import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserData } from '../interfaces/iuser-data';
import { IPasswordChange } from '../interfaces/ipassword-change';
import { IBosses } from '../interfaces/ibosses';
import { IUserDataPageable } from '../interfaces/iuser-data-pageable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  public getProfileData(id: number): Observable<IUserData> {
    return this.http.get<IUserData>(this.apiUrl + '/profile/' + id);
  }

  public getUsersFromName(
    name: string,
    page: number = 0
  ): Observable<IUserDataPageable> {
    let params: string = `&size=8&page=${page}`;
    return this.http.get<IUserDataPageable>(
      this.apiUrl + '/name?u=' + name + params
    );
  }

  public updateUser(data: Partial<IUserData>): Observable<IUserData> {
    return this.http.patch<IUserData>(this.apiUrl + '/' + data.id, data);
  }

  public updatePassword(data: IPasswordChange): Observable<IUserData> {
    return this.http.post<IUserData>(this.apiUrl + '/pass/' + data.id, data);
  }

  public getBosses(): Observable<IBosses> {
    return this.http.get<IBosses>(this.apiUrl + '/bosses');
  }

  public moderate(
    id: number,
    data: Partial<IUserData>
  ): Observable<Partial<IUserData>> {
    return this.http.post<Partial<IUserData>>(
      this.apiUrl + '/moderate/' + id,
      data
    );
  }

  public getUsersPaged(
    size: number,
    page: number
  ): Observable<IUserDataPageable> {
    return this.http.get<IUserDataPageable>(
      this.apiUrl + `?size=${size}&page=${page}`
    );
  }
}
