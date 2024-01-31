import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
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
  initSub!: Subscription;
  authSub!: Subscription;
  userSub!: Subscription;
  pmSub!: Subscription;
  pmOps!: Subscription;
  pmSocket!: Subscription;
  retrievePmSub!: Subscription;
  isOpPending: boolean = false;
  isWaitingPage: boolean = true;
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
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean[]>([false, false]);
  subsArr$ = this.subsBoolArr.asObservable();
  errorsMsgs: string[] = [];

  @ViewChild('sentBtn') sentBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('receivedBtn') receivedBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private pmSvc: PmService,
    private modalSvc: NgbModal
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 500);

    this.initSub = this.authSvc.intialized$.subscribe((init) => {
      if (init) {
        this.authSub = this.authSvc.user$.subscribe((res) => {
          if (res) {
            this.userSub = this.userSvc
              .getProfileData(res.user_id)
              .pipe(
                catchError((err) => {
                  const currentValues = this.subsBoolArr.value;
                  currentValues[0] = true;
                  this.subsBoolArr.next(currentValues);
                  this.errorsMsgs.push(
                    'Errore nel caricamento dei dati del profilo'
                  );
                  return EMPTY;
                })
              )
              .subscribe((res) => {
                if (res.response?.ok) {
                  this.profileData = res;
                } else {
                  this.errorsMsgs.push(res.response!.message);
                }

                const currentValues = this.subsBoolArr.value;
                currentValues[0] = true;
                this.subsBoolArr.next(currentValues);
              });

            this.pmSub = this.pmSvc
              .getInitMessages(res.user_id)
              .pipe(
                catchError((err) => {
                  const currentValues = this.subsBoolArr.value;
                  currentValues[1] = true;
                  this.subsBoolArr.next(currentValues);
                  this.errorsMsgs.push(
                    "Errore nel caricamento dei messaggi dell'utente."
                  );
                  return EMPTY;
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

                const currentValues = this.subsBoolArr.value;
                currentValues[1] = true;
                this.subsBoolArr.next(currentValues);
              });

            this.pmSocket = this.pmSvc
              .getMessages()
              .pipe(
                catchError((err) => {
                  this.errorsMsgs.push(
                    'Errore di connessione o nel sistema di messaggistica.'
                  );
                  const currentValues = this.subsBoolArr.value;
                  currentValues[2] = true;
                  this.subsBoolArr.next(currentValues);
                  return EMPTY;
                })
              )
              .subscribe((newpm) => {
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
                    localStorage.setItem(
                      'newpm',
                      JSON.stringify(Array.of(obj))
                    );
                    this.pmSvc.newPmsPresent.next(Array.of(obj));
                  }
                }
                if (ms.sender_user?.id == res.user_id) {
                  this.collapseableSArr.unshift(true);
                  this.sentMessages.unshift(ms);
                }
                const currentValues = this.subsBoolArr.value;
                currentValues[2] = true;
                this.subsBoolArr.next(currentValues);
              });
          } else {
            this.errorsMsgs.push(
              "Errore nel caricamento dei dati dell'utente."
            );
            const currentValues = this.subsBoolArr.value;
            currentValues[0] = true;
            currentValues[1] = true;
            this.subsBoolArr.next(currentValues);
          }
        });
      }
    });

    this.subSub = this.subsArr$.subscribe((res) => {
      if (res.every((el) => el == true)) {
        this.isLoadingPage = false;
        if (this.errorsMsgs.length) {
          this.showModal();
        }
      }
    });
  }

  showModal() {
    const modal = this.modalSvc.open(ErrorModalComponent, {
      size: 'xl',
    });
    modal.componentInstance.messages = this.errorsMsgs;
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
    if (this.pmSub) this.pmSub.unsubscribe();
    if (this.pmOps) this.pmOps.unsubscribe();
    if (this.pmSocket) this.pmSocket.unsubscribe();
    if (this.initSub) this.initSub.unsubscribe();
    if (this.subSub) this.subSub.unsubscribe();
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
