import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserData } from '../interfaces/iuser-data';
import { Observable } from 'rxjs';
import { IUserDataPageable } from '../interfaces/iuser-data-pageable';
import { IUpdatePostDTO } from '../interfaces/iupdate-post-dto';
import { IPostData } from '../interfaces/ipost-data';
import { IPostHomePaged } from '../interfaces/ipost-home-paged';
import { ISideBlockData } from '../interfaces/iside-block-data';
import { ISectionData } from '../interfaces/isection-data';
import { ISubSectionData } from '../interfaces/isub-section-data';
import { ICustomResponse } from '../interfaces/icustom-response';
import { IContactMessageBody } from '../interfaces/icontact-message-body';
import { IContactMessage } from '../interfaces/icontact-message-res';

@Injectable({
  providedIn: 'root',
})
export class ModerationService {
  usersApiUrl: string = 'http://localhost:8080/api/users';
  sidesApiUrl: string = 'http://localhost:8080/api/sides';
  threadsApiUrl: string = 'http://localhost:8080/api/threads';
  contactsApiUrl: string = 'http://localhost:8080/api/contacts';
  sectionsApiUrl: string = 'http://localhost:8080/api/sections';
  subsectionsApiUrl: string = 'http://localhost:8080/api/subsections';

  constructor(private http: HttpClient) {}

  public moderate(
    id: number,
    data: Partial<IUserData>
  ): Observable<Partial<IUserData>> {
    return this.http.post<Partial<IUserData>>(
      this.usersApiUrl + '/moderate/' + id,
      data
    );
  }

  public getUsersFromName(
    name: string,
    page: number = 0
  ): Observable<IUserDataPageable> {
    let params: string = `&size=8&page=${page}`;
    return this.http.get<IUserDataPageable>(
      this.usersApiUrl + '/name?u=' + name + params
    );
  }

  public getRegUsersStatsInfo(year: number): Observable<string[]> {
    return this.http.get<string[]>(this.usersApiUrl + '/usersRegStats/' + year);
  }

  public updatePost(
    user_id: number,
    data: Partial<IUpdatePostDTO>
  ): Observable<IPostData> {
    return this.http.put<IPostData>(
      this.threadsApiUrl + '/' + user_id + '?mod=true',
      data
    );
  }

  public getPosts(
    parent_s_id: number,
    qs: string,
    order: number
  ): Observable<IPostHomePaged> {
    let query: string =
      order == 1
        ? qs.concat('&orderBy=comments')
        : order == 2
        ? qs.concat('&orderBy=react')
        : qs;
    return this.http.get<IPostHomePaged>(
      this.threadsApiUrl + '/home/' + parent_s_id + query
    );
  }

  public getPostPaged(q: string): Observable<IPostHomePaged> {
    return this.http.get<IPostHomePaged>(this.threadsApiUrl + '/paged?' + q);
  }

  public getSideBlocks(): Observable<ISideBlockData[]> {
    return this.http.get<ISideBlockData[]>(
      this.sidesApiUrl + '?type=BLOCK_ALL'
    );
  }

  public getSections(): Observable<ISectionData[]> {
    return this.http.get<ISectionData[]>(
      this.sectionsApiUrl + '?ordered=true&sub=true'
    );
  }

  public getSubSectionsPerSection(
    p_id: number | null
  ): Observable<ISubSectionData[]> {
    return p_id != null
      ? this.http.get<ISubSectionData[]>(
          this.subsectionsApiUrl + '?pid=' + p_id
        )
      : this.http.get<ISubSectionData[]>(this.subsectionsApiUrl);
  }

  public updateSection(
    id: number,
    data: ISectionData
  ): Observable<ISectionData> {
    return this.http.put<ISectionData>(this.sectionsApiUrl + '/' + id, data);
  }

  public updateSubSection(
    id: number,
    data: Partial<ISubSectionData>
  ): Observable<ISubSectionData> {
    return this.http.put<ISubSectionData>(
      this.subsectionsApiUrl + '/' + id,
      data
    );
  }

  public createSection(data: Partial<ISectionData>): Observable<ISectionData> {
    return this.http.post<ISectionData>(this.sectionsApiUrl + '/new', data);
  }

  public deleteSection(id: number): Observable<ICustomResponse> {
    return this.http.delete<ICustomResponse>(this.sectionsApiUrl + '/' + id);
  }

  public deleteSubSection(id: number): Observable<ICustomResponse> {
    return this.http.delete<ICustomResponse>(this.subsectionsApiUrl + '/' + id);
  }

  public createSubSection(
    data: Partial<ISubSectionData>
  ): Observable<ISubSectionData> {
    return this.http.post<ISubSectionData>(
      this.subsectionsApiUrl + '/new',
      data
    );
  }

  public createBlock(
    data: Partial<ISideBlockData>
  ): Observable<ISideBlockData> {
    {
      return this.http.post<ISideBlockData>(this.sidesApiUrl + '/new', data);
    }
  }

  public getBlocks(): Observable<ISideBlockData[]> {
    return this.http.get<ISideBlockData[]>(this.sidesApiUrl);
  }

  public updateBlock(id: number, data: ISideBlockData) {
    return this.http.put<ISideBlockData>(this.sidesApiUrl + '/' + id, data);
  }

  public getAllContactMessages(): Observable<IContactMessageBody[]> {
    return this.http.get<IContactMessageBody[]>(this.contactsApiUrl);
  }

  public setMessageClosed(id: number): Observable<IContactMessage> {
    return this.http.get<IContactMessage>(this.contactsApiUrl + '/close/' + id);
  }

  public setMessageOpen(id: number): Observable<IContactMessage> {
    return this.http.get<IContactMessage>(
      this.contactsApiUrl + '/reopen/' + id
    );
  }
}
