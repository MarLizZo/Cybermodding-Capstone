import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IErrorResponse } from 'src/app/interfaces/ierror-response';
import { ILoginData } from 'src/app/interfaces/ilogin-data';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private acRoute: ActivatedRoute,
    private svc: AuthService
  ) {}

  isLoadingPage: boolean = true;
  isLoggingIn: boolean = false;
  isWaitingLoggingIn: boolean = false;
  isLoginOperationSuccess: boolean = false;
  isLoginOperationError: boolean = false;
  errorMessage: string = '';
  logSub!: Subscription;
  invalidTokenReason: boolean = false;
  loginData: ILoginData = {
    username: '',
    password: '',
  };

  @ViewChild('usernameP') usernameP!: ElementRef<HTMLElement>;
  @ViewChild('passwordP') passwordP!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.invalidTokenReason = !!this.acRoute.snapshot.paramMap.get('reason');
    setTimeout(() => {
      this.isLoadingPage = false;
    }, 500);
  }

  ngOnDestroy() {
    if (this.logSub) this.logSub.unsubscribe();
  }

  resetErrFields(): void {
    this.usernameP.nativeElement.classList.add('d-none');
    this.passwordP.nativeElement.classList.add('d-none');
    this.isLoginOperationSuccess = false;
    this.isLoginOperationError = false;
  }

  doChecks(): boolean {
    let checksResult = true;
    if (this.loginData.username.length < 3) {
      checksResult = false;
      this.usernameP.nativeElement.classList.remove('d-none');
    }
    if (this.loginData.password.length < 8) {
      checksResult = false;
      this.passwordP.nativeElement.classList.remove('d-none');
    }
    return checksResult;
  }

  doLogin(): void {
    this.resetErrFields();

    if (this.doChecks()) {
      this.isLoggingIn = true;
      this.isWaitingLoggingIn = true;

      this.logSub = this.svc
        .login(this.loginData)
        .pipe(
          catchError((err: IErrorResponse) => {
            this.isLoggingIn = false;
            this.isLoginOperationError = true;
            this.isWaitingLoggingIn = false;
            this.errorMessage = err.error.message;
            throw err;
          })
        )
        .subscribe((res) => {
          this.isLoggingIn = false;
          this.isLoginOperationSuccess = true;
          setTimeout(() => {
            this.isWaitingLoggingIn = false;
          }, 800);
          setTimeout(() => {
            this.router.navigate(['/forum']);
          }, 2500);
        });
    }
  }
}
