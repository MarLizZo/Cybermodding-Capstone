import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISideBlockData } from '../interfaces/iside-block-data';
import { Observable } from 'rxjs';
import { ISectionData } from '../interfaces/isection-data';
import { ISubSectionData } from '../interfaces/isub-section-data';
import { IPostData } from '../interfaces/ipost-data';
import { Ireaction } from '../interfaces/ireaction';
import { ICustomResponse } from '../interfaces/icustom-response';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  sidesApiUrl: string = 'http://localhost:8080/api/sides';
  threadsApiUrl: string = 'http://localhost:8080/api/threads';
  sectionsApiUrl: string = 'http://localhost:8080/api/sections';
  subsectionsApiUrl: string = 'http://localhost:8080/api/subsections';

  constructor(private http: HttpClient) {}

  public getForumSideBlocks(): Observable<ISideBlockData[]> {
    return this.http.get<ISideBlockData[]>(
      this.sidesApiUrl + '?type=BLOCK_FORUM'
    );
  }

  public getForumSections(): Observable<ISectionData[]> {
    return this.http.get<ISectionData[]>(this.sectionsApiUrl + '?ordered=true');
  }

  public getSubSectionsPerSection(p_id: number): Observable<ISubSectionData[]> {
    return this.http.get<ISubSectionData[]>(
      this.subsectionsApiUrl + '?pid=' + p_id
    );
  }

  public getSubSectionById(id: number): Observable<ISubSectionData> {
    return this.http.get<ISubSectionData>(this.subsectionsApiUrl + '/' + id);
  }

  public getPost(id: number): Observable<IPostData> {
    return this.http.get<IPostData>(this.threadsApiUrl + '/' + id);
  }

  public postReaction(reaction: Ireaction): Observable<Ireaction> {
    return this.http.post<Ireaction>(
      this.threadsApiUrl + '/add-react',
      reaction
    );
  }

  public deleteReaction(reaction_id: number): Observable<ICustomResponse> {
    return this.http.get<ICustomResponse>(
      this.threadsApiUrl + '/delete-react/' + reaction_id
    );
  }
}
