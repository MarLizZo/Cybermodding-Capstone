import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OnlinespyService } from 'src/app/services/onlinespy.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(
    private svc: AuthService,
    private router: Router,
    private wsSpy: OnlinespyService
  ) {}

  isLoadingPage: boolean = true;
  username: string | undefined = undefined;
  usernameColor: string = '';
  userSub!: Subscription;
  privSub!: Subscription;
  timer: any;

  ngOnInit() {
    this.userSub = this.svc.user$.subscribe((res) => {
      if (!this.username) this.username = res?.username;
    });

    this.privSub = this.svc.privileges$.subscribe((res) => {
      if (this.usernameColor == '') {
        this.usernameColor = res?.isAdmin
          ? 'text-danger'
          : res?.isMod
          ? 'text-green'
          : '';
      }
    });

    setTimeout(() => {
      this.isLoadingPage = false;
      this.timer = setTimeout(() => {
        this.router.navigate(['']);
      }, 3500);
    }, 500);
  }

  ngAfterViewInit() {
    this.wsSpy.sendDisconnectInfo('remove');
    setTimeout(() => {
      this.svc.logout();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.privSub) this.privSub.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
  }
}
