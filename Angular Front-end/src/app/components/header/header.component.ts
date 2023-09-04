import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  nameSub!: Subscription;
  privSub!: Subscription;
  isMenuCollapsed: boolean = true;
  username: string | undefined = undefined;
  usernameColor: string = '';
  isMod: boolean | undefined = false;
  isAdmin: boolean | undefined = false;

  constructor(private router: Router, private authSvc: AuthService) {}

  ngOnInit() {
    this.nameSub = this.authSvc.user$.subscribe((res) => {
      this.username = res?.username;
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
  }

  isHome(): boolean {
    return this.router.url == '/';
  }
  isForum(): boolean {
    return this.router.url == '/forum';
  }
}
