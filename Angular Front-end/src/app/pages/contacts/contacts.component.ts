import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
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
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean>(false);
  subsArr$ = this.subsBoolArr.asObservable();
  errorsMsgs: string[] = [];
  reasonsArr: string[] = [
    "Problemi con l'account",
    'Consigli',
    'Lavora con noi',
    'Altro',
  ];
  reason: string = '-1';
  @ViewChild('reasonP') reasonP!: ElementRef<HTMLElement>;

  constructor(
    private authSvc: AuthService,
    private uSvc: UserService,
    private modalSvc: NgbModal
  ) {}

  ngOnInit() {
    this.authSub = this.authSvc.user$.subscribe((res) => {
      if (res) {
        this.isUserLogged = true;
        this.user_id = res.user_id;
      } else {
        this.isUserLogged = false;
      }
    });

    this.userSub = this.uSvc
      .getBosses()
      .pipe(
        catchError((err) => {
          this.errorsMsgs.push('Errore nel caricamento degli utenti.');
          this.subsBoolArr.next(true);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.bossArr = res;
        this.subsBoolArr.next(true);
      });

    this.subSub = this.subsArr$.subscribe((res) => {
      if (res == true) {
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
    if (this.subSub) this.subSub.unsubscribe();
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
