import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
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
  isAllDataLoaded: boolean = false;
  authSub!: Subscription;
  routeSub!: Subscription;
  pmSub!: Subscription;
  userSub!: Subscription;

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
    private u_svc: UserService
  ) {}

  ngOnInit() {
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
                  this.isLoadingPage = false;
                  throw err;
                })
              )
              .subscribe((res) => {
                this.recipient_user = res;
                this.recipient_username = res.username;
                this.isLoadingPage = false;
                setTimeout(() => {
                  this.setInputEvent();
                }, 500);
              });
          } else {
            this.isLoadingPage = false;
            setTimeout(() => {
              this.setInputEvent();
            }, 500);
          }
        });
      } else {
        this.isLoadingPage = false;
      }
    });
  }

  setInputEvent(): void {
    this.recipientInput.nativeElement.addEventListener('input', () => {
      if (this.recipientInput.nativeElement.value.length > 1) {
        this.userSub = this.u_svc
          .getByUsername(this.recipientInput.nativeElement.value)
          .pipe(
            catchError((err) => {
              throw err;
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
      console.log(obj);
      this.pmSub = this.pmSvc.getMessages().subscribe((newpm) => {
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
          }, 3000);
        }
      });
      this.pmSvc.sendMessage(obj);
    }
  }
}
