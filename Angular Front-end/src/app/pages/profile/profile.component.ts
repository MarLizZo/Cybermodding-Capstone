import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { IPasswordChange } from 'src/app/interfaces/ipassword-change';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  initSub!: Subscription;
  userSub!: Subscription;
  profileSub!: Subscription;
  updateSub!: Subscription;
  updatePassSub!: Subscription;
  profileData: IUserData | null = null;
  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isSendingData: boolean = false;
  isSendingDataPass: boolean = false;
  isQuickStatsCollapsed: boolean = false;
  isInfoCollapsed: boolean = true;
  isPassCollapsed: boolean = true;
  errorsMsgs: string[] = [];
  @ViewChild('fInfo') formInfo!: NgForm;
  @ViewChild('fPass') formPass!: NgForm;
  @ViewChild('usernameP') usernameP!: ElementRef<HTMLElement>;
  @ViewChild('emailP') emailP!: ElementRef<HTMLElement>;
  @ViewChild('descriptionP') descriptionP!: ElementRef<HTMLElement>;
  @ViewChild('avatarP') avatarP!: ElementRef<HTMLElement>;
  @ViewChild('birthdateP') birthdateP!: ElementRef<HTMLElement>;

  @ViewChild('actualP') actualP!: ElementRef<HTMLElement>;
  @ViewChild('repeatActualP') repeatActualP!: ElementRef<HTMLElement>;
  @ViewChild('newP') newP!: ElementRef<HTMLElement>;
  @ViewChild('repeatNewP') repeatNewP!: ElementRef<HTMLElement>;

  @ViewChild('accountUpd') accountUpd!: ElementRef<HTMLElement>;
  @ViewChild('passUpd') passUpd!: ElementRef<HTMLElement>;

  userObject: Partial<IUserData> = {
    id: 0,
    username: '',
    email: '',
    description: '',
    birthdate: new Date(),
    avatar: '',
  };
  userPassObject: IPasswordChange = {
    id: 0,
    username: '',
    actual: '',
    repeatActual: '',
    newPassword: '',
    repeatNewPassword: '',
  };

  constructor(
    private authSvc: AuthService,
    private uSvc: UserService,
    private router: Router,
    private modalSvc: NgbModal
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 500);

    this.initSub = this.authSvc.intialized$.subscribe((init) => {
      if (init) {
        this.userSub = this.authSvc.user$.subscribe((res) => {
          if (res != null) {
            this.profileSub = this.uSvc
              .getProfileData(res.user_id)
              .pipe(
                catchError((err) => {
                  this.errorsMsgs.push(
                    'Errore nel caricamento dei dati del profilo.'
                  );
                  this.isLoadingPage = false;
                  this.showModal();
                  return EMPTY;
                })
              )
              .subscribe((res) => {
                this.profileData = res;
                this.userObject.id = res.id;
                this.userObject.username = res.username;
                this.userObject.email = res.email;
                this.userObject.description = res.description;
                this.userObject.avatar = res.avatar;
                this.userObject.birthdate = res.birthdate;
                this.isLoadingPage = false;
              });
          } else {
            this.isLoadingPage = false;
            this.errorsMsgs.push('Errore nel caricamento della pagina.');
          }
        });
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
    if (this.userSub) this.userSub.unsubscribe();
    if (this.profileSub) this.profileSub.unsubscribe();
    if (this.updateSub) this.updateSub.unsubscribe();
    if (this.updatePassSub) this.updatePassSub.unsubscribe();
    if (this.initSub) this.initSub.unsubscribe();
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

  goToPost() {
    if (this.profileData?.last_post) {
      this.router.navigateByUrl(
        '/forum/showthread/' +
          this.profileData.last_post.id +
          '-' +
          this.profileData.last_post.title
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase()
      );
    }
  }

  goToComment() {
    if (this.profileData?.last_comment) {
      let baseUrl: string =
        '/forum/showthread/' +
        this.profileData.last_comment.post?.id +
        '-' +
        this.profileData.last_comment.post?.title
          .replaceAll(' ', '-')
          .replaceAll('/', '-')
          .toLowerCase();

      sessionStorage.setItem(
        'scrolltonumber',
        this.profileData.last_comment.id!.toString()
      );
      if (this.profileData.last_comment.post!.comments_count! <= 8) {
        this.router.navigateByUrl(baseUrl + '/1');
      } else {
        let pageIndex = Math.ceil(
          this.profileData.last_comment.post!.comments_count! / 8
        );
        this.router.navigateByUrl(baseUrl + '/' + pageIndex);
      }
    }
  }

  removeTags(str: string): string {
    return str
      .replaceAll('<blockquote>', '')
      .replaceAll('</blockquote>', '')
      .replaceAll('<b>', '')
      .replaceAll('</b>', '')
      .replaceAll('<i>', '')
      .replaceAll('</i>', '')
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('&nbsp;', ' ');
  }

  checkInputInfos(): boolean {
    let bool: boolean = true;

    if (this.formInfo.controls['username'].value.length < 3) {
      bool = false;
      this.usernameP.nativeElement.classList.remove('d-none');
    }
    if (
      !RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$').test(
        this.formInfo.controls['email'].value
      )
    ) {
      bool = false;
      this.emailP.nativeElement.classList.remove('d-none');
    }
    const birth = new Date(this.formInfo.controls['birthdate'].value);
    if (birth.getFullYear() != undefined || !isNaN(birth.getFullYear())) {
      const year = new Date().getFullYear() - birth.getFullYear();
      if (year < 10) {
        bool = false;
        this.birthdateP.nativeElement.classList.remove('d-none');
      }
    }
    if (this.formInfo.controls['descr'].value.length > 20) {
      bool = false;
      this.descriptionP.nativeElement.classList.remove('d-none');
    }
    if (
      this.formInfo.controls['avatar'].value != null &&
      this.formInfo.controls['avatar'].value != ''
    ) {
      if (
        !RegExp('/.(jpeg|jpg|png|gif|bmp)$/i').test(
          this.formInfo.controls['avatar'].value
        )
      ) {
        bool = false;
        this.avatarP.nativeElement.classList.remove('d-none');
      }
    }
    return bool;
  }

  checkUserPassInputs(): boolean {
    let bool: boolean = true;
    if (this.formPass.controls['pass-1'].value.length < 8) {
      bool = false;
      this.actualP.nativeElement.classList.remove('d-none');
    }
    if (this.formPass.controls['pass-2'].value.length < 8) {
      bool = false;
      this.repeatActualP.nativeElement.classList.remove('d-none');
    }
    if (this.formPass.controls['newpass-1'].value.length < 8) {
      bool = false;
      this.newP.nativeElement.classList.remove('d-none');
    }
    if (this.formPass.controls['newpass-2'].value.length < 8) {
      bool = false;
      this.repeatNewP.nativeElement.classList.remove('d-none');
    }
    return bool;
  }

  resetUserInfoFields() {
    this.accountUpd.nativeElement.innerText =
      'Account aggiornato con successo!';
    this.accountUpd.nativeElement.classList.add('opacity-0');
    this.avatarP.nativeElement.classList.add('d-none');
    this.descriptionP.nativeElement.classList.add('d-none');
    this.birthdateP.nativeElement.classList.add('d-none');
    this.emailP.nativeElement.classList.add('d-none');
    this.usernameP.nativeElement.classList.add('d-none');
  }

  resetUserPassFields() {
    this.passUpd.nativeElement.classList.add('opacity-0');
    this.passUpd.nativeElement.innerText = 'Password aggiornata con successo!';
    this.actualP.nativeElement.classList.add('d-none');
    this.repeatActualP.nativeElement.classList.add('d-none');
    this.newP.nativeElement.classList.add('d-none');
    this.repeatNewP.nativeElement.classList.add('d-none');
  }

  updateUserInfo() {
    this.resetUserInfoFields();

    if (this.checkInputInfos()) {
      this.isSendingData = true;
      this.updateSub = this.uSvc
        .updateUser(this.userObject)
        .pipe(
          catchError((err) => {
            setTimeout(() => {
              this.isSendingData = false;
              this.accountUpd.nativeElement.innerText =
                "Errore nell'aggiornamento dell'account.";
              this.accountUpd.nativeElement.classList.remove('opacity-0');
            }, 500);
            return EMPTY;
          })
        )
        .subscribe((res) => {
          setTimeout(() => {
            this.isSendingData = false;
            this.accountUpd.nativeElement.classList.remove('opacity-0');
            setTimeout(() => {
              this.accountUpd.nativeElement.classList.add('opacity-0');
            }, 3500);
          }, 500);
        });
    }
  }

  updatePass() {
    this.resetUserPassFields();

    if (this.checkUserPassInputs()) {
      this.isSendingDataPass = true;
      this.userPassObject.id = this.profileData?.id;
      this.userPassObject.username = this.profileData?.username;
      this.updatePassSub = this.uSvc
        .updatePassword(this.userPassObject)
        .pipe(
          catchError((err) => {
            this.isSendingDataPass = false;
            setTimeout(() => {
              this.isSendingData = false;
              this.passUpd.nativeElement.innerText =
                "Errore nell'aggiornamento della password.";
              this.passUpd.nativeElement.classList.remove('opacity-0');
            }, 500);
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.isSendingDataPass = false;
          setTimeout(() => {
            this.isSendingData = false;
            this.passUpd.nativeElement.classList.remove('opacity-0');
            setTimeout(() => {
              this.passUpd.nativeElement.classList.add('opacity-0');
            }, 3500);
          }, 500);
        });
    }
  }
}
