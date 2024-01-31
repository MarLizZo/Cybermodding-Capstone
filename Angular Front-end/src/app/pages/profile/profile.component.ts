import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { IPasswordChange } from 'src/app/interfaces/ipassword-change';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
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
  avatarSub!: Subscription;
  updateAvatarSub!: Subscription;
  profileData: IUserData | null = null;
  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isSendingData: boolean = false;
  isSendingDataAvatar: boolean = false;
  isSendingDataPass: boolean = false;
  isQuickStatsCollapsed: boolean = false;
  isInfoCollapsed: boolean = true;
  isPassCollapsed: boolean = true;
  tempAvatarLink: string | null = null;
  tempAvatarBlob: File | null = null;
  errorsMsgs: string[] = [];
  isAvatarReady: boolean = false;
  tempAvatarsArr: string[] = [];
  isTempAvatarChanged: boolean = true;
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
  @ViewChild('avatarUpd') avatarUpd!: ElementRef<HTMLElement>;
  @ViewChild('passUpd') passUpd!: ElementRef<HTMLElement>;

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

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
    private modalSvc: NgbModal,
    protected common: CommonService
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
                if (res.response?.ok) {
                  this.profileData = res;
                  this.userObject.id = res.id;
                  this.userObject.username = res.username;
                  this.userObject.email = res.email;
                  this.userObject.description = res.description;
                  this.userObject.avatar = res.avatar;
                  this.userObject.birthdate = res.birthdate;
                } else {
                  this.errorsMsgs.push(res.response!.message);
                }

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
    if (this.avatarSub) this.avatarSub.unsubscribe();
    if (this.updateAvatarSub) this.updateAvatarSub.unsubscribe();
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
    return bool;
  }

  checkAvatarInfo(): boolean {
    let bool = true;
    if (this.tempAvatarBlob) {
      if (!/\.(jpeg|jpg|png)$/i.test(this.tempAvatarBlob.name)) {
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
    this.descriptionP.nativeElement.classList.add('d-none');
    this.birthdateP.nativeElement.classList.add('d-none');
    this.emailP.nativeElement.classList.add('d-none');
    this.usernameP.nativeElement.classList.add('d-none');
  }

  resetUserAvatarFields() {
    this.isSendingData = false;
    this.avatarUpd.nativeElement.innerText = 'Avatar aggiornato con successo!';
    this.avatarP.nativeElement.classList.add('d-none');
  }

  resetUserPassFields() {
    this.passUpd.nativeElement.classList.add('opacity-0');
    this.passUpd.nativeElement.innerText = 'Password aggiornata con successo!';
    this.actualP.nativeElement.classList.add('d-none');
    this.repeatActualP.nativeElement.classList.add('d-none');
    this.newP.nativeElement.classList.add('d-none');
    this.repeatNewP.nativeElement.classList.add('d-none');
  }

  async onAvatarSelect(image: any) {
    if (image.target.files[0]) {
      const resizedImg: File = new File(
        [await this.resizeImage(image.target.files[0])],
        image.target.files[0].name,
        { type: 'image/png' }
      );

      this.tempAvatarBlob = resizedImg;
      this.isAvatarReady = true;
      this.isTempAvatarChanged = true;

      if (this.tempAvatarBlob.name) {
        if (!/\.(jpeg|jpg|png)$/i.test(this.tempAvatarBlob.name)) {
          this.avatarP.nativeElement.classList.remove('d-none');
          this.isAvatarReady = false;
        }
      }
    } else {
      this.isAvatarReady = false;
      this.tempAvatarBlob = null;
    }
  }

  async resizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > 64) {
            height *= 64 / width;
            width = 64;
          }
        } else {
          if (height > 64) {
            width *= 64 / height;
            height = 64;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (resizedImageBlob) => {
            if (resizedImageBlob) {
              resolve(resizedImageBlob);
            } else {
              reject(
                new Error(
                  "Impossibile creare il blob dell'immagine ridimensionata."
                )
              );
            }
          },
          'image/png',
          0.8
        );
      };

      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  openModal(success: boolean) {
    if (success) {
      const modal = this.modalSvc.open(ModalComponent, {
        size: 'lg',
      });
      modal.componentInstance.title = 'Anteprima Avatar';
      modal.componentInstance.body = `
    <div class="d-flex align-items-center">
      <img src="${this.tempAvatarLink}" class="profile-img me-3">
      <div>
        <h1 class="mb-0 pb-1 txt-orange">${
          this.userObject.username || 'Username'
        }</h1>
        <h6 class="m-0">${this.userObject.description || 'Descrizione'}</h6>
      </div>
    </div>
  `;
    } else {
      const modal = this.modalSvc.open(ModalComponent, {
        size: 'lg',
      });
      modal.componentInstance.title = 'Anteprima Avatar';
      modal.componentInstance.body = `
    <h3 class="my-1 text-danger text-center">Errore nel caricamento dell'immagine</h3>
  `;
    }
  }

  showTeaser() {
    if (this.tempAvatarBlob != null) {
      const formData = new FormData();
      formData.append('file', this.tempAvatarBlob!);

      if (this.isTempAvatarChanged) {
        this.avatarSub = this.authSvc
          .uploadAvatarTest(formData)
          .pipe(
            catchError((err) => {
              this.openModal(false);
              return EMPTY;
            })
          )
          .subscribe((res) => {
            if (res.response.ok) {
              this.tempAvatarLink = res.link;
              this.tempAvatarsArr.push(res.link!);
              this.isTempAvatarChanged = false;
              this.openModal(true);
            } else {
              this.openModal(false);
            }
          });
      } else {
        this.openModal(true);
      }
    }
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
          if (res.response?.ok) {
            setTimeout(() => {
              this.isSendingData = false;
              this.userObject = res;
              this.accountUpd.nativeElement.classList.remove('opacity-0');
              setTimeout(() => {
                this.accountUpd.nativeElement.classList.add('opacity-0');
              }, 3500);
            }, 500);
          } else {
            setTimeout(() => {
              this.isSendingData = false;
              this.accountUpd.nativeElement.innerText = res.response!.message;
              this.accountUpd.nativeElement.classList.remove('opacity-0');
            }, 500);
          }
        });
    }
  }

  updateAvatar() {
    this.resetUserAvatarFields();

    if (this.checkAvatarInfo()) {
      const formData = new FormData();
      formData.append('file', this.tempAvatarBlob!);
      if (this.userObject.avatar) {
        this.tempAvatarsArr.push(this.userObject.avatar as string);
      }
      formData.append('tmpPaths', this.tempAvatarsArr.join(','));
      this.isSendingDataAvatar = true;

      this.updateAvatarSub = this.uSvc
        .updateAvatar(this.userObject.id!, formData)
        .pipe(
          catchError((err) => {
            setTimeout(() => {
              this.isSendingDataAvatar = false;
              this.avatarUpd.nativeElement.innerText =
                "Errore nell'aggiornamento dell'account.";
              this.avatarUpd.nativeElement.classList.remove('opacity-0');
            }, 500);
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.response!.ok) {
            setTimeout(() => {
              this.isSendingDataAvatar = false;
              this.userObject = res;
              this.avatarUpd.nativeElement.classList.remove('opacity-0');
              setTimeout(() => {
                this.avatarUpd.nativeElement.classList.add('opacity-0');
              }, 3500);
            }, 500);
          } else {
            setTimeout(() => {
              this.isSendingDataAvatar = false;
              this.avatarUpd.nativeElement.innerText = res.response!.message;
              this.avatarUpd.nativeElement.classList.remove('opacity-0');
            }, 500);
          }
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
          if (res.response?.ok) {
            this.isSendingDataPass = false;
            setTimeout(() => {
              this.isSendingData = false;
              this.passUpd.nativeElement.classList.remove('opacity-0');
              setTimeout(() => {
                this.passUpd.nativeElement.classList.add('opacity-0');
              }, 3500);
            }, 500);
          } else {
            setTimeout(() => {
              this.isSendingData = false;
              this.passUpd.nativeElement.innerText = res.response!.message;
              this.passUpd.nativeElement.classList.remove('opacity-0');
            }, 500);
          }
        });
    }
  }
}
