import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, catchError } from 'rxjs';
import { IcontactDto } from 'src/app/interfaces/icontact-dto';
import { AuthService } from 'src/app/services/auth.service';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  isLoadingPage: boolean = true;
  isUserLogged: boolean = false;
  user_id: number = 0;
  authSub!: Subscription;
  contactSub!: Subscription;
  // subSub!: Subscription;
  // subsBoolArr = new BehaviorSubject<boolean>(false);
  // subsArr$ = this.subsBoolArr.asObservable();
  // errorsMsgs: string[] = [];
  reasonsArr: string[] = [
    "Problemi con l'account",
    'Consigli',
    'Lavora con noi',
    'Altro',
  ];
  reason: string = '-1';
  @ViewChild('reasonP') reasonP!: ElementRef<HTMLElement>;
  @ViewChild('nameP') nameP!: ElementRef<HTMLElement>;
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('titleP') titleP!: ElementRef<HTMLElement>;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messageP') messageP!: ElementRef<HTMLElement>;
  @ViewChild('afterMessageDiv') afterMessageDiv!: ElementRef<HTMLElement>;

  constructor(private authSvc: AuthService, private forumSvc: ForumService) {}

  ngOnInit() {
    this.authSub = this.authSvc.user$.subscribe((res) => {
      if (res) {
        this.isUserLogged = true;
        this.user_id = res.user_id;
      } else {
        this.isUserLogged = false;
      }
      this.isLoadingPage = false;
    });

    // this.subSub = this.subsArr$.subscribe((res) => {
    //   if (res == true) {
    //     this.isLoadingPage = false;
    //     if (this.errorsMsgs.length) {
    //       this.showModal();
    //     }
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.contactSub) this.contactSub.unsubscribe();
  }

  sendMessage(text: string) {
    let obj: IcontactDto = {
      user_id: this.user_id,
      name: !this.isUserLogged ? this.nameInput.nativeElement.value : '',
      content: text,
      title: this.titleInput.nativeElement.value,
      type:
        this.reason == "Problemi con l'account"
          ? 'ACCOUNT_ISSUE'
          : this.reason == 'Consigli'
          ? 'TIPS'
          : this.reason == 'Lavora con noi'
          ? 'WORK_WITH_US'
          : 'OTHER',
    };

    this.contactSub = this.forumSvc
      .sendContactMessage(obj)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.afterMessageDiv?.nativeElement.classList.remove('d-none');
        setTimeout(() => {
          this.afterMessageDiv?.nativeElement.scrollIntoView();
        }, 500);
      });
  }

  doChecks(content: string) {
    this.reasonP.nativeElement.classList.add('d-none');
    this.nameP?.nativeElement.classList.add('d-none');
    this.titleP?.nativeElement.classList.add('d-none');
    this.messageP.nativeElement.classList.add('d-none');
    this.afterMessageDiv?.nativeElement.classList.add('d-none');
    let err: boolean = false;

    if (this.reason == '-1') {
      this.reasonP.nativeElement.classList.remove('d-none');
      err = true;
    }

    if (this.titleInput.nativeElement.value.length < 1) {
      this.titleP.nativeElement.classList.remove('d-none');
      err = true;
    }

    if (content.length < 1) {
      this.messageP.nativeElement.classList.remove('d-none');
      err = true;
    }

    if (!this.isUserLogged) {
      if (this.nameInput?.nativeElement.value.length < 1) {
        this.nameP?.nativeElement.classList.remove('d-none');
        err = true;
      }
    }

    if (!err) {
      this.sendMessage(content);
    }
  }
}
