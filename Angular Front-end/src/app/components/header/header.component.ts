import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPMInformer } from 'src/app/interfaces/ipminformer';
import { AuthService } from 'src/app/services/auth.service';
import { PmService } from 'src/app/services/pm.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  nameSub!: Subscription;
  privSub!: Subscription;
  pmSub!: Subscription;
  newPmSub!: Subscription;
  isMenuCollapsed: boolean = true;
  username: string | undefined = undefined;
  usernameColor: string = '';
  isMod: boolean | undefined = false;
  isAdmin: boolean | undefined = false;
  isNewMessage: boolean = false;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private pmSvc: PmService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('newpm')) {
      this.isNewMessage = true;
    }

    this.nameSub = this.authSvc.user$.subscribe((res) => {
      if (res) {
        this.username = res?.username;

        this.newPmSub = this.pmSvc.pmsPresent$.subscribe((pm) => {
          if (pm != null) {
            this.isNewMessage = true;
          } else {
            this.isNewMessage = false;
          }
        });
      }
    });

    this.privSub = this.authSvc.privileges$.subscribe((res) => {
      this.isMod = res?.isMod;
      this.isAdmin = res?.isAdmin;

      this.usernameColor = this.isMod
        ? 'text-green'
        : this.isAdmin
        ? 'text-danger'
        : 'active-link';
    });
  }

  ngOnDestroy() {
    if (this.nameSub) this.nameSub.unsubscribe();
    if (this.privSub) this.privSub.unsubscribe();
    if (this.pmSub) this.pmSub.unsubscribe();
    if (this.newPmSub) this.newPmSub.unsubscribe();
  }

  isHome(): boolean {
    return this.router.url == '/';
  }
  isForum(): boolean {
    return this.router.url.includes('/forum');
  }
  isCommunity(): boolean {
    return this.router.url.includes('/users');
  }
  isContacts(): boolean {
    return this.router.url.includes('/contacts');
  }
  isProfile(): boolean {
    return this.router.url.includes('/profile');
  }
  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
