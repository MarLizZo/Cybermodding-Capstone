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
  isSingleMsgView: boolean = false;
  isReplyToMsgView: boolean = false;
  singleMsg: IPrivateMessageData | null = null;
  profileData: IUserData | null = null;
  receivedMessages: IPrivateMessageData[] = [];
  sentMessages: IPrivateMessageData[] = [];
  quotedMessage: IQuoteInfo | undefined;
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean[]>([false, false]);
  subsArr$ = this.subsBoolArr.asObservable();
  errorsMsgs: string[] = [];
  _msgSentCorrectly: boolean = false;

  get msgSentCorrectly(): boolean {
    return this._msgSentCorrectly;
  }
  set msgSentCorrectly(value: boolean) {
    this._msgSentCorrectly = value;
    if (value) {
      setTimeout(() => {
        this._msgSentCorrectly = false;
        this.isReplyToMsgView = false;
        this.isSingleMsgView = false;
        this.singleMsg = null;
        this.isReceivedView = true;
      }, 2500);
    }
  }

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
                let ms = newpm as IPrivateMessageData;

                if (ms.recipient_user?.id == res.user_id) {
                  this.receivedMessages.unshift(ms);
                }
                if (ms.sender_user?.id == res.user_id) {
                  this.sentMessages.unshift(ms);
                  if (this.isReplyToMsgView) {
                    this.msgSentCorrectly = true;
                  }
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
      this.isSingleMsgView = false;
      this.isReplyToMsgView = false;
      this.singleMsg = null;
      this.sentBtn.nativeElement.classList.add('btn-selected');
      this.receivedBtn.nativeElement.classList.remove('btn-selected');
    } else {
      this.isSentView = true;
      this.isReceivedView = false;
      this.isSingleMsgView = false;
      this.isReplyToMsgView = false;
      this.singleMsg = null;
      this.receivedBtn.nativeElement.classList.add('btn-selected');
      this.sentBtn.nativeElement.classList.remove('btn-selected');
    }
  }

  setSingleMsgView(msg: IPrivateMessageData) {
    this.singleMsg = msg;
    this.isReceivedView = false;
    this.isSentView = false;
    this.isSingleMsgView = true;

    if (!msg.viewed) {
      if (this.pmOps) this.pmOps.unsubscribe();

      this.pmOps = this.pmSvc
        .markAsViewed(msg.id)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.viewed) {
            this.singleMsg = res;
            let recIndex = this.receivedMessages.findIndex(
              (el) => el.id == res.id
            );
            if (recIndex != -1) {
              this.receivedMessages[recIndex] = res;
            }
            let pmPresents: IPMInformer[] | null =
              this.pmSvc.newPmsPresent.getValue();
            if (pmPresents != null) {
              if (pmPresents.length == 1) {
                this.pmSvc.newPmsPresent.next(null);
              } else {
                pmPresents.splice(
                  pmPresents.findIndex((pm) => pm.id == res.id),
                  1
                );
                this.pmSvc.newPmsPresent.next(pmPresents);
              }
            }
          }
        });
    }
  }

  resetSingleMsgView() {
    if (this.isReplyToMsgView) {
      this.isReplyToMsgView = false;
      this.isSingleMsgView = true;
      return;
    }
    if (this.singleMsg!.sender_user.id != this.profileData!.id) {
      this.isSingleMsgView = false;
      this.isReceivedView = true;
      this.singleMsg = null;
    } else {
      this.isSingleMsgView = false;
      this.isSentView = true;
      this.singleMsg = null;
    }
  }

  getQuoteMsg(): IQuoteInfo {
    let supportDiv: HTMLDivElement = document.createElement('div');
    supportDiv.innerHTML = this.singleMsg!.content;
    let firstBlockQuote: string | undefined =
      supportDiv.querySelector('blockquote')?.nextElementSibling?.innerHTML;
    let strQuote =
      firstBlockQuote != undefined
        ? firstBlockQuote
        : supportDiv.lastElementChild?.innerHTML;

    return (this.quotedMessage = {
      content: strQuote || 'N.A.',
      username: this.singleMsg!.sender_user!.username,
      user_id: this.singleMsg!.sender_user!.id!,
    });
  }

  doReply(text: string) {
    let supportDiv: HTMLDivElement = document.createElement('div');
    supportDiv.innerHTML = this.singleMsg!.content;
    let firstBlockQuote: string | undefined =
      supportDiv.querySelector('blockquote')?.nextElementSibling?.innerHTML;
    let strQuote =
      firstBlockQuote != undefined
        ? firstBlockQuote
        : supportDiv.lastElementChild?.innerHTML;

    let supportInputDiv: HTMLDivElement = document.createElement('div');
    supportInputDiv.innerHTML = text;
    let inputStr = supportInputDiv.lastElementChild?.innerHTML;

    let finalStr: string = `<blockquote><p class="mb-1">${
      this.singleMsg!.sender_user?.username
    }:</p><p class="mb-1">${strQuote}</p><p class="mb-1"></p></blockquote><p>${inputStr}</p>`;

    this.pmSvc.sendMessage({
      title: this.singleMsg!.title,
      content: finalStr,
      sender_id: this.singleMsg!.recipient_user!.id!,
      recipient_id: this.singleMsg!.sender_user!.id!,
    });
  }
}
