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
  private socket$!: WebSocketSubject<IPrivateMessageData | IPrivateMessageDTO>;
  public subj = new BehaviorSubject<
    IPrivateMessageData | IPrivateMessageDTO | null
  >(null);
  public pm$ = this.subj.asObservable();
  public newPmsPresent = new BehaviorSubject<IPMInformer[] | null>(null);
  public pmsPresent$ = this.newPmsPresent.asObservable();

  constructor(private http: HttpClient) {
    if (localStorage.getItem('newpm')) {
      this.newPmsPresent.next(JSON.parse(localStorage.getItem('newpm')!));
    }
  }

  connect(id: number) {
    this.socket$ = webSocket('ws://localhost:8080/ws/pms/' + id);
    return this.socket$;
  }

  getMessages() {
    return this.socket$;
  }

  sendMessage(data: IPrivateMessageDTO) {
    this.socket$.next(data);
  }

  getInitMessages(id: number): Observable<IPrivateMessageData[]> {
    return this.http.get<IPrivateMessageData[]>(this.apiUrl + '/' + id);
  }

  markAsViewed(id: number): Observable<IPrivateMessageData> {
    return this.http.get<IPrivateMessageData>(this.apiUrl + '/viewed/' + id);
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
