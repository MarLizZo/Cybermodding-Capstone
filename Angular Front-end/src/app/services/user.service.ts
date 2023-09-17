import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserData } from '../interfaces/iuser-data';
import { IPasswordChange } from '../interfaces/ipassword-change';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  public getProfileData(id: number): Observable<IUserData> {
    return this.http.get<IUserData>(this.apiUrl + '/profile/' + id);
  }

  public updateUser(data: Partial<IUserData>): Observable<IUserData> {
    return this.http.patch<IUserData>(this.apiUrl + '/' + data.id, data);
  }

  public updatePassword(data: IPasswordChange): Observable<IUserData> {
    return this.http.post<IUserData>(this.apiUrl + '/pass/' + data.id, data);
  }
}
