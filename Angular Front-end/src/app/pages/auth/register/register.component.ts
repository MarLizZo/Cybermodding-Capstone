import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { IErrorResponse } from 'src/app/interfaces/ierror-response';
import { IRegisterData } from 'src/app/interfaces/iregister-data';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private svc: AuthService,
    private router: Router,
    private modalSvc: NgbModal
  ) {}

  isLoadingPage: boolean = true;
  isRegistering: boolean = false;
  isRegisterOperationSuccess: boolean = false;
  isRegisterOperationError: boolean = false;
  isWaitingRegistering: boolean = false;
  isTeaserVisible: boolean = false;
  errorMessage: string = '';
  tempAvatarLink: string | null = null;
  tempAvatarBlob: File | null = null;
  regSub!: Subscription;
  avatarSub!: Subscription;
  regData: IRegisterData = {
    username: '',
    email: '',
    password: '',
    description: '',
    avatar: null,
    birthdate: new Date(),
  };

  @ViewChild('usernameP') usernameP!: ElementRef<HTMLElement>;
  @ViewChild('emailP') emailP!: ElementRef<HTMLElement>;
  @ViewChild('passwordP') passwordP!: ElementRef<HTMLElement>;
  @ViewChild('repeatPasswordP') ripetiPasswordP!: ElementRef<HTMLElement>;
  @ViewChild('repeatPasswordInput')
  ripetiPasswordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('descriptionP') descriptionP!: ElementRef<HTMLElement>;
  @ViewChild('avatarP') avatarP!: ElementRef<HTMLElement>;
  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
  @ViewChild('birthdateP') birthdateP!: ElementRef<HTMLElement>;

  ngOnInit() {
    setTimeout(() => {
      this.isLoadingPage = false;
    }, 500);
  }

  ngOnDestroy() {
    if (this.regSub) this.regSub.unsubscribe();
  }

  resetErrFields(): void {
    this.usernameP.nativeElement.classList.add('d-none');
    this.emailP.nativeElement.classList.add('d-none');
    this.passwordP.nativeElement.classList.add('d-none');
    this.ripetiPasswordP.nativeElement.classList.add('d-none');
    this.descriptionP.nativeElement.classList.add('d-none');
    this.avatarP.nativeElement.classList.add('d-none');
    this.birthdateP.nativeElement.classList.add('d-none');
  }

  doChecks(): boolean {
    let checksResult: boolean = true;

    if (this.regData.username.length < 3) {
      checksResult = false;
      this.usernameP.nativeElement.classList.remove('d-none');
    }

    if (
      !RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$').test(
        this.regData.email
      )
    ) {
      checksResult = false;
      this.emailP.nativeElement.classList.remove('d-none');
    }

    if (this.regData.password.length < 8) {
      checksResult = false;
      this.passwordP.nativeElement.classList.remove('d-none');
    }

    if (this.regData.password != this.ripetiPasswordInput.nativeElement.value) {
      checksResult = false;
      this.ripetiPasswordP.nativeElement.classList.remove('d-none');
    }

    if (this.regData.description.length > 20) {
      checksResult = false;
      this.descriptionP.nativeElement.classList.remove('d-none');
    }

    if (this.avatarInput.nativeElement.value != '') {
      if (
        !RegExp('/.(jpeg|jpg|png)$/i').test(
          this.avatarInput.nativeElement.value
        )
      ) {
        checksResult = false;
        this.avatarP.nativeElement.classList.remove('d-none');
      }
    }

    const birth = new Date(this.regData.birthdate.toString());
    if (birth.getFullYear() != undefined || !isNaN(birth.getFullYear())) {
      const year = new Date().getFullYear() - birth.getFullYear();
      if (year < 10) {
        checksResult = false;
        this.birthdateP.nativeElement.classList.remove('d-none');
      }
    }
    return checksResult;
  }

  onAvatarSelect(image: any) {
    this.tempAvatarBlob = image.target.files[0];
  }

  showTeaser() {
    console.log(this.tempAvatarBlob);
    const formData = new FormData();
    formData.append('file', this.tempAvatarBlob!);

    this.avatarSub = this.svc
      .uploadAvatarTest(formData)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.tempAvatarLink = res.link;
        const modal = this.modalSvc.open(ModalComponent, {
          size: 'xl',
        });
        modal.componentInstance.title = 'Anteprima';
        modal.componentInstance.body = `
      <div class="d-flex align-items-center">
        <div>
            <img src="${this.tempAvatarLink}" class="profile-img me-3">
        </div>
        <div>
            <h1 class="mb-0 pb-1 txt-orange">${
              this.regData.username || 'Username'
            }</h1>
            <h6 class="m-0">${this.regData.description || 'Descrizione'}</h6>
        </div>
      </div>
      `;
      });
  }

  doRegister() {
    this.resetErrFields();
    if (this.doChecks()) {
      this.isRegisterOperationSuccess = false;
      this.isRegisterOperationError = false;
      this.isWaitingRegistering = true;
      this.isRegistering = true;

      this.regSub = this.svc
        .register(this.regData)
        .pipe(
          catchError((err: IErrorResponse) => {
            this.isRegistering = false;
            this.isRegisterOperationError = true;
            this.isWaitingRegistering = false;
            this.errorMessage = err.error.message;
            throw err;
          })
        )
        .subscribe((res) => {
          this.isRegistering = false;
          this.isRegisterOperationSuccess = true;
          setTimeout(() => {
            this.isWaitingRegistering = false;
          }, 800);
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2500);
        });
    }
  }
}
