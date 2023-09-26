import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, catchError, last } from 'rxjs';
import { IPMInformer } from 'src/app/interfaces/ipminformer';
import { IPrivateMessageData } from 'src/app/interfaces/iprivate-message-data';
import { IQuoteInfo } from 'src/app/interfaces/iquote-info';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { AuthService } from 'src/app/services/auth.service';
import { PmService } from 'src/app/services/pm.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pm',
  templateUrl: './pm.component.html',
  styleUrls: ['./pm.component.scss'],
})
export class PmComponent {
  authSub!: Subscription;
  userSub!: Subscription;
  pmSub!: Subscription;
  pmOps!: Subscription;
  pmSocket!: Subscription;
  retrievePmSub!: Subscription;
  isOpPending: boolean = false;
  isLoadingPage: boolean = true;
  isReceivedView: boolean = true;
  isSentView: boolean = false;
  profileData: IUserData | null = null;
  receivedMessages: IPrivateMessageData[] = [];
  sentMessages: IPrivateMessageData[] = [];
  collapseableRArr: boolean[] = [];
  collapseableSArr: boolean[] = [];
  replyArr: boolean[] = [];
  quotedMessage: IQuoteInfo | undefined;

  @ViewChild('sentBtn') sentBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('receivedBtn') receivedBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private pmSvc: PmService
  ) {}

  ngOnInit() {
    this.authSub = this.authSvc.user$.subscribe((res) => {
      if (res) {
        this.userSub = this.userSvc
          .getProfileData(res.user_id)
          .pipe(
            catchError((err) => {
              this.isLoadingPage = false;
              throw err;
            })
          )
          .subscribe((res) => {
            this.profileData = res;
            this.isLoadingPage = false;
          });

        this.pmSub = this.pmSvc
          .getInitMessages(res.user_id)
          .pipe(
            catchError((err) => {
              throw err;
            })
          )
          .subscribe((msgs) => {
            this.receivedMessages = msgs.filter(
              (el) => el.recipient_user!.id == res.user_id
            );
            this.sentMessages = msgs.filter(
              (el) => el.sender_user!.id == res.user_id
            );

            for (let i = 0; i < this.receivedMessages.length; i++) {
              this.collapseableRArr.push(true);
              this.replyArr.push(false);
            }

            for (let i = 0; i < this.sentMessages.length; i++) {
              this.collapseableSArr.push(true);
            }
          });

        this.pmSocket = this.pmSvc.getMessages().subscribe((newpm) => {
          for (let i = 0; i < this.collapseableRArr.length; i++) {
            this.collapseableRArr[i] = true;
            this.replyArr[i] = false;
          }

          let ms = newpm as IPrivateMessageData;

          if (ms.recipient_user?.id == res.user_id) {
            let obj: IPMInformer = {
              id: ms.id!,
              sender_id: ms.sender_user!.id!,
              recipient_id: ms.recipient_user!.id!,
            };

            this.collapseableRArr.unshift(true);
            this.receivedMessages.unshift(ms);

            if (localStorage.getItem('newpm')) {
              let fromLS: IPMInformer[] = JSON.parse(
                localStorage.getItem('newpm')!
              );
              fromLS.push(obj);
              localStorage.setItem('newpm', JSON.stringify(obj));
              this.pmSvc.newPmsPresent.next(fromLS);
            } else {
              localStorage.setItem('newpm', JSON.stringify(Array.of(obj)));
              this.pmSvc.newPmsPresent.next(Array.of(obj));
            }
          }
          if (ms.sender_user?.id == res.user_id) {
            this.collapseableSArr.unshift(true);
            this.sentMessages.unshift(ms);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
    if (this.pmSub) this.pmSub.unsubscribe();
    if (this.pmOps) this.pmOps.unsubscribe();
    if (this.pmSocket) this.pmSocket.unsubscribe();
  }

  getClassColor() {
    return this.profileData?.level == 'BOSS'
      ? 'text-danger'
      : this.profileData?.level == 'MID'
      ? 'txt-mod'
      : this.profileData?.level == 'BASE'
      ? 'txt-orange'
      : '';
  }

  switchView(flag: number) {
    if (flag == 0) {
      this.isReceivedView = true;
      this.isSentView = false;
      this.sentBtn.nativeElement.classList.add('btn-selected');
      this.receivedBtn.nativeElement.classList.remove('btn-selected');
    } else {
      this.isSentView = true;
      this.isReceivedView = false;
      this.receivedBtn.nativeElement.classList.add('btn-selected');
      this.sentBtn.nativeElement.classList.remove('btn-selected');
    }
  }

  replyClick(index: number) {
    this.replyArr[index] = true;
  }

  collapseMark(index: number) {
    this.collapseableRArr[index] = !this.collapseableRArr[index];
    if (this.collapseableRArr[index]) {
      this.replyArr[index] = false;
    }
    if (!this.receivedMessages[index].viewed && !this.isOpPending) {
      this.isOpPending = true;
      this.pmOps = this.pmSvc
        .markAsViewed(this.receivedMessages[index].id!)
        .pipe(
          catchError((err) => {
            this.isOpPending = false;
            throw err;
          })
        )
        .subscribe((res) => {
          this.isOpPending = false;
          this.receivedMessages[index] = res;

          if (localStorage.getItem('newpm')) {
            let fromLS: IPMInformer[] = JSON.parse(
              localStorage.getItem('newpm')!
            );
            if (fromLS.length == 1) {
              localStorage.removeItem('newpm');
              this.pmSvc.newPmsPresent.next(null);
            } else {
              let foundIndex: number = fromLS.findIndex(
                (el) => el.id == res.id
              );
              if (foundIndex != -1) {
                fromLS.splice(foundIndex, 1);
              }
              localStorage.setItem('newpm', JSON.stringify(fromLS));
              this.pmSvc.newPmsPresent.next(fromLS);
            }
          }
        });
    }
  }

  getQuoteMsg(index: number): IQuoteInfo {
    let supportDiv: HTMLDivElement = document.createElement('div');
    supportDiv.innerHTML = this.receivedMessages[index].content;
    let firstBlockQuote: string | undefined =
      supportDiv.querySelector('blockquote')?.nextElementSibling?.innerHTML;
    let strQuote =
      firstBlockQuote != undefined
        ? firstBlockQuote
        : supportDiv.lastElementChild?.innerHTML;

    return (this.quotedMessage = {
      content: strQuote || 'N.A.',
      username: this.receivedMessages[index].sender_user!.username,
      user_id: this.receivedMessages[index].sender_user!.id!,
    });
  }

  doReply(text: string, index: number) {
    let supportDiv: HTMLDivElement = document.createElement('div');
    supportDiv.innerHTML = this.receivedMessages[index].content;
    let firstBlockQuote: string | undefined =
      supportDiv.querySelector('blockquote')?.nextElementSibling?.innerHTML;
    let strQuote =
      firstBlockQuote != undefined
        ? firstBlockQuote
        : supportDiv.lastElementChild?.innerHTML;

    let supportInputDiv: HTMLDivElement = document.createElement('div');
    supportInputDiv.innerHTML = text;
    let inputStr = supportInputDiv.lastElementChild?.innerHTML;

    let finalStr: string = `<blockquote><p class="mb-1">${this.receivedMessages[index].sender_user?.username}:</p><p class="mb-1">${strQuote}</p><p class="mb-1"></p></blockquote><p>${inputStr}</p>`;

    console.log(finalStr);

    this.pmSvc.sendMessage({
      title: this.receivedMessages[index].title,
      content: finalStr,
      sender_id: this.receivedMessages[index].recipient_user!.id!,
      recipient_id: this.receivedMessages[index].sender_user!.id!,
    });
  }
}
