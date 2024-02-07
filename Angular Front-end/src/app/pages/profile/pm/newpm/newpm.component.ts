import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { IPrivateMessageData } from 'src/app/interfaces/iprivate-message-data';
import { IPrivateMessageDTO } from 'src/app/interfaces/iprivate-message-dto';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { AuthService } from 'src/app/services/auth.service';
import { PmService } from 'src/app/services/pm.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-newpm',
  templateUrl: './newpm.component.html',
  styleUrls: ['./newpm.component.scss'],
})
export class NewpmComponent {
  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isAllDataLoaded: boolean = false;
  initSub!: Subscription;
  authSub!: Subscription;
  routeSub!: Subscription;
  pmSub!: Subscription;
  userSub!: Subscription;
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean>(false);
  subsArr$ = this.subsBoolArr.asObservable();
  errorsMsgs: string[] = [];

  sender_id: number = 0;
  recipient_user: IUserData | null = null;
  recipient_username: string = '';
  pm_title: string = '';

  isMessageTriggered: boolean = false;
  isMessageSent: boolean = false;

  foundUsers: IUserData[] = [];

  @ViewChild('recipientInput') recipientInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authSvc: AuthService,
    private pmSvc: PmService,
    private route: ActivatedRoute,
    private u_svc: UserService,
    private modalSvc: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 500);

    this.initSub = this.authSvc.intialized$.subscribe((init) => {
      if (init) {
        this.authSub = this.authSvc.user$.subscribe((res) => {
          if (res) {
            this.sender_id = res.user_id;
            this.routeSub = this.route.paramMap.subscribe((rt) => {
              let rec_id: number = Number(rt.get('id'));
              if (rec_id && !isNaN(rec_id)) {
                this.userSub = this.u_svc
                  .getById(rec_id)
                  .pipe(
                    catchError((err) => {
                      this.errorsMsgs.push(
                        "Errore nel recupero dei dati dell'utente destinatario."
                      );
                      this.subsBoolArr.next(true);
                      return EMPTY;
                    })
                  )
                  .subscribe((res) => {
                    this.recipient_user = res;
                    this.recipient_username = res.username;
                    this.subsBoolArr.next(true);
                    setTimeout(() => {
                      this.setInputEvent();
                    }, 500);
                  });
              } else {
                this.subsBoolArr.next(true);
                setTimeout(() => {
                  this.setInputEvent();
                }, 500);
              }
            });
          } else {
            this.errorsMsgs.push(
              'Errore nel caricamento dei dati del tuo account.'
            );
            this.subsBoolArr.next(true);
          }
        });
      }
    });

    this.subSub = this.subsBoolArr.subscribe((res) => {
      if (res) {
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

  setInputEvent(): void {
    this.recipientInput.nativeElement.addEventListener('input', () => {
      if (this.recipientInput.nativeElement.value.length > 1) {
        this.userSub = this.u_svc
          .getByUsername(this.recipientInput.nativeElement.value)
          .pipe(
            catchError((err) => {
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.foundUsers = res;
          });
      } else {
        this.foundUsers = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.pmSub) this.pmSub.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
    if (this.initSub) this.initSub.unsubscribe();
  }

  selectUser(index: number) {
    this.recipient_user = this.foundUsers[index];
    this.recipient_username = this.foundUsers[index].username;
    this.foundUsers = [];
  }

  sendMessage(content: string) {
    if (content.length && this.pm_title.length && this.recipient_user != null) {
      this.isMessageSent = false;
      this.isMessageTriggered = true;
      let obj: IPrivateMessageDTO = {
        title: this.pm_title,
        content: content,
        sender_id: this.sender_id,
        recipient_id: this.recipient_user!.id!,
      };

      // console.log(obj);

      this.pmSub = this.pmSvc
        .getMessages()
        .pipe(
          catchError((err) => {
            this.errorsMsgs.push(
              'Errore di connessione al sistema di messaggistica.'
            );
            return EMPTY;
          })
        )
        .subscribe((newpm) => {
          let ms = newpm as IPrivateMessageData;
          if (
            ms.sender_user?.id == this.sender_id &&
            ms.recipient_user?.id == this.recipient_user?.id
          ) {
            this.recipient_user = null;
            this.recipient_username = '';
            this.pm_title = '';
            this.isMessageSent = true;
            setTimeout(() => {
              this.isMessageTriggered = false;
              this.router.navigateByUrl('/profile/pm');
            }, 3000);
          }
        });

      this.pmSvc.sendMessage(obj);
    }
  }
}
