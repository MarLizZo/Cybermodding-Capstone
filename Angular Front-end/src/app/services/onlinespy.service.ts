import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { IOnlineSpy } from '../interfaces/ionline-spy';

@Injectable({
  providedIn: 'root',
})
export class OnlinespyService {
  private socket$!: WebSocketSubject<any>;
  public static loggingFlag: boolean = false; // not used atm

  constructor() {}

  getOnlineUsers(userId: number): WebSocketSubject<IOnlineSpy[]> {
    this.socket$ = webSocket('ws://localhost:8080/ws/online/' + userId);
    return this.socket$;
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  sendDisconnectInfo(action: string): void {
    if (this.socket$) {
      this.socket$.next(action);
    }
  }
}
