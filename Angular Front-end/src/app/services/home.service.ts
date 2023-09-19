import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISideBlockData } from '../interfaces/iside-block-data';
import { ISectionData } from '../interfaces/isection-data';
import { IPostHomePaged } from '../interfaces/ipost-home-paged';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  sidesApiUrl: string = 'http://localhost:8080/api/sides';
  threadsApiUrl: string = 'http://localhost:8080/api/threads';
  sectionsApiUrl: string = 'http://localhost:8080/api/sections';

  constructor(private http: HttpClient) {}

  public getForumSideBlocks(): Observable<ISideBlockData[]> {
    return this.http.get<ISideBlockData[]>(
      this.sidesApiUrl + '?type=BLOCK_HOME'
    );
  }

  public getSections(): Observable<ISectionData[]> {
    return this.http.get<ISectionData[]>(this.sectionsApiUrl + '?ordered=true');
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
}
