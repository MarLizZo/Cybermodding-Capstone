import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISideBlockData } from '../interfaces/iside-block-data';
import { Observable } from 'rxjs';
import { ISectionData } from '../interfaces/isection-data';
import { ISubSectionData } from '../interfaces/isub-section-data';
import { IPostData } from '../interfaces/ipost-data';
import { Ireaction } from '../interfaces/ireaction';
import { ICustomResponse } from '../interfaces/icustom-response';
import { ICommentDTO } from '../interfaces/icomment-dto';
import { ICommentData } from '../interfaces/icomment-data';
import { IPostDTO } from '../interfaces/ipost-dto';
import { IPostHomePaged } from '../interfaces/ipost-home-paged';
import { IUpdatePostDTO } from '../interfaces/iupdate-post-dto';
import { IPostDataPaged } from '../interfaces/ipost-data-paged';

type paramsPage = {
  size: number;
  page: number;
};

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  sidesApiUrl: string = 'http://localhost:8080/api/sides';
  threadsApiUrl: string = 'http://localhost:8080/api/threads';
  sectionsApiUrl: string = 'http://localhost:8080/api/sections';
  subsectionsApiUrl: string = 'http://localhost:8080/api/subsections';

  constructor(private http: HttpClient) {}

  public getSinglePost(id: number): Observable<IPostData> {
    return this.http.get<IPostData>(this.threadsApiUrl + '/single/' + id);
  }

  public getForumSideBlocks(): Observable<ISideBlockData[]> {
    return this.http.get<ISideBlockData[]>(
      this.sidesApiUrl + '?type=BLOCK_FORUM'
    );
  }

  public getForumSections(): Observable<ISectionData[]> {
    return this.http.get<ISectionData[]>(this.sectionsApiUrl + '?ordered=true');
  }

  public getSectionById(id: number): Observable<ISectionData> {
    return this.http.get<ISectionData>(this.sectionsApiUrl + '/' + id);
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

  public getPost(id: number, params: paramsPage): Observable<IPostDataPaged> {
    return this.http.get<IPostDataPaged>(this.threadsApiUrl + '/' + id, {
      params: {
        size: params.size,
        page: params.page,
      },
    });
  }

  public getSubSectionById(id: number): Observable<ISubSectionData> {
    return this.http.get<ISubSectionData>(this.subsectionsApiUrl + '/' + id);
  }

  public getPostPaged(q: string): Observable<IPostHomePaged> {
    return this.http.get<IPostHomePaged>(this.threadsApiUrl + '/paged?' + q);
  }

  public updatePost(
    user_id: number,
    data: IUpdatePostDTO
  ): Observable<IPostData> {
    return this.http.put<IPostData>(this.threadsApiUrl + '/' + user_id, data);
  }

  public postReaction(reaction: Ireaction): Observable<Ireaction> {
    return this.http.post<Ireaction>(this.threadsApiUrl + '/react', reaction);
  }

  public deleteReaction(reaction_id: number): Observable<ICustomResponse> {
    return this.http.delete<ICustomResponse>(
      this.threadsApiUrl + '/react/' + reaction_id
    );
  }

  public postComment(data: ICommentDTO): Observable<ICommentData> {
    return this.http.post<ICommentData>(this.threadsApiUrl + '/reply', data);
  }

  public postNewThread(data: IPostDTO): Observable<IPostData> {
    return this.http.post<IPostData>(this.threadsApiUrl, data);
  }
}
