import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userSub!: Subscription;
  userName: string | undefined = '';

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.userSub = this.authSvc.user$.subscribe((res) => {
      this.userName = res?.username;
    });
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
  }
}
