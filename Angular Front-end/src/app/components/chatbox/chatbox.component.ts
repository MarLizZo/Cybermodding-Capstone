import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { IChatMessage } from 'src/app/interfaces/ichat-message';
import { Subscription, catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserLevel } from 'src/app/enums/user-level';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbCollapseModule],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent {
  messages: IChatMessage[] = [];
  connectSub!: Subscription;
  getSub!: Subscription;
  isChatCollapsed: boolean = false;
  @Input() userLogged!: boolean;
  @Input() userName!: string | undefined;
  @Input() userLevel!: UserLevel | undefined | string;
  @Input() userId!: number | undefined;
  messageData: IChatMessage = {
    username: this.userName,
    user_id: this.userId,
    content: '',
    date: undefined,
    level: this.userLevel,
  };

  constructor(private svc: ChatService) {}

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('iconColl') collapseIcon!: ElementRef<HTMLElement>;
  @ViewChild('msgContainer') chatContainer!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.getSub = this.svc
      .getInitMessages()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.messages = res;
      });
    this.connectSub = this.svc.getMessages()!.subscribe((message) => {
      this.messages.push(message);
    });
  }

  ngOnDestroy() {
    if (this.connectSub) this.connectSub.unsubscribe();
    if (this.getSub) this.getSub.unsubscribe();
  }

  toggleCollapse() {
    this.isChatCollapsed = !this.isChatCollapsed;
    if (this.isChatCollapsed) {
      this.collapseIcon.nativeElement.classList.remove('bi-chevron-bar-up');
      this.collapseIcon.nativeElement.classList.add('bi-chevron-bar-down');
    } else {
      this.collapseIcon.nativeElement.classList.remove('bi-chevron-bar-down');
      this.collapseIcon.nativeElement.classList.add('bi-chevron-bar-up');
    }
  }

  sendMessage(): void {
    if (this.messageData.content != '' && this.userLogged) {
      this.messageData.username = this.userName;
      this.messageData.date = new Date();
      this.messageData.level = this.userLevel;
      this.svc.sendMessage(this.messageData);
      this.messageData.content = '';
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }, 500);
    }
  }
}
