import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IChatMessage } from '../interfaces/ichat-message';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl: string = 'http://localhost:8080/api/chatbox/getmsgs';
  private socket$!: WebSocketSubject<IChatMessage>;

  constructor(private http: HttpClient) {
    this.socket$ = webSocket('ws://localhost:8080/ws/chat');
  }

  sendMessage(data: IChatMessage) {
    this.socket$.next(data);
  }

  getMessages() {
    return this.socket$;
  }

  getInitMessages(): Observable<IChatMessage[]> {
    return this.http.get<IChatMessage[]>(this.apiUrl);
  }
}
