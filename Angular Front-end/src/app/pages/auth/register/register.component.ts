import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IErrorResponse } from 'src/app/interfaces/ierror-response';
import { IRegisterData } from 'src/app/interfaces/iregister-data';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private svc: AuthService, private router: Router) {}

  isLoadingPage: boolean = true;
  isRegistering: boolean = false;
  isRegisterOperationSuccess: boolean = false;
  isRegisterOperationError: boolean = false;
  errorMessage: string = '';
  regSub!: Subscription;
  regData: IRegisterData = {
    username: '',
    email: '',
    password: '',
    description: '',
    avatar: '',
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
    if (this.regData.avatar != '') {
      if (!RegExp('/.(jpeg|jpg|png|gif|bmp)$/i').test(this.regData.avatar)) {
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

  doRegister() {
    this.resetErrFields();
    if (this.doChecks()) {
      this.isRegisterOperationSuccess = false;
      this.isRegisterOperationError = false;
      this.isRegistering = true;

      this.regSub = this.svc
        .register(this.regData)
        .pipe(
          catchError((err: IErrorResponse) => {
            this.isRegistering = false;
            this.isRegisterOperationError = true;
            this.errorMessage = err.error.message;
            throw err;
          })
        )
        .subscribe((res) => {
          this.isRegistering = false;
          this.isRegisterOperationSuccess = true;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2500);
        });
    }
  }
}
