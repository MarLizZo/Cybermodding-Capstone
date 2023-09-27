import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, catchError } from 'rxjs';
import { IBosses } from 'src/app/interfaces/ibosses';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

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
  userSub!: Subscription;
  bossArr: IBosses | null = null;
  reasonsArr: string[] = [
    "Problemi con l'account",
    'Consigli',
    'Lavora con noi',
    'Altro',
  ];
  reason: string = '-1';
  @ViewChild('reasonP') reasonP!: ElementRef<HTMLElement>;

  constructor(private authSvc: AuthService, private uSvc: UserService) {}

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

    this.userSub = this.uSvc
      .getBosses()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.bossArr = res;
      });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
  }

  sendFormMessage(text: string) {
    this.reasonP.nativeElement.classList.add('d-none');
    if (this.reason == '-1') {
      this.reasonP.nativeElement.classList.remove('d-none');
    } else {
      let obj = {
        reason: this.reason,
        content: text,
      };
      console.log(obj);
    }
  }
}
