import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPrivateMessageData } from '../interfaces/iprivate-message-data';
import { IPrivateMessageDTO } from '../interfaces/iprivate-message-dto';
import { IPMInformer } from '../interfaces/ipminformer';

@Injectable({
  providedIn: 'root',
})
export class PmService {
  private apiUrl: string = 'http://localhost:8080/api/pms';
  private socket$!: WebSocketSubject<
    IPrivateMessageData | IPrivateMessageDTO | IPMInformer
  >;
  public subj = new BehaviorSubject<
    IPrivateMessageData | IPrivateMessageDTO | null
  >(null);
  public pm$ = this.subj.asObservable();
  public newPmsPresent = new BehaviorSubject<IPMInformer[] | null>(null);
  public pmsPresent$ = this.newPmsPresent.asObservable();

  constructor(private http: HttpClient) {
    this.socket$ = webSocket('ws://localhost:8080/ws/pms');
    if (localStorage.getItem('newpm')) {
      this.newPmsPresent.next(JSON.parse(localStorage.getItem('newpm')!));
    }
  }

  sendMessage(data: IPrivateMessageDTO) {
    this.socket$.next(data);
  }

  getMessages() {
    return this.socket$;
  }

  getInitMessages(id: number): Observable<IPrivateMessageData[]> {
    return this.http.get<IPrivateMessageData[]>(this.apiUrl + '/' + id);
  }

  markAsViewed(id: number): Observable<IPrivateMessageData> {
    return this.http.get<IPrivateMessageData>(this.apiUrl + '/viewed/' + id);
  }
}
