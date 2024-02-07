import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOnlineSpy } from 'src/app/interfaces/ionline-spy';
import { AuthService } from 'src/app/services/auth.service';
import { OnlinespyService } from 'src/app/services/onlinespy.service';

@Component({
  selector: 'app-onlinespy',
  templateUrl: './onlinespy.component.html',
  styleUrls: ['./onlinespy.component.scss'],
})
export class OnlinespyComponent {
  connectSub!: Subscription;
  onlineUsers: IOnlineSpy[] = [];
  user_id: number = 0;

  constructor(private svc: OnlinespyService, private auth_svc: AuthService) {}

  ngOnInit() {
    this.auth_svc.intialized$.subscribe((init) => {
      if (init) {
        console.log('initialized');
        if (this.connectSub) this.connectSub.unsubscribe();
        this.connectSub = this.auth_svc.user$.subscribe((res) => {
          if (!OnlinespyService.loggingFlag) {
            if (res?.user_id) {
              this.user_id = res!.user_id;
            } else {
              this.user_id = 0;
            }
            this.svc.getOnlineUsers(this.user_id).subscribe((on) => {
              this.onlineUsers = on;
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    OnlinespyService.loggingFlag = true;
    this.svc.disconnect();
    if (this.connectSub) this.connectSub.unsubscribe();
  }

  areAllGuests(): boolean {
    return this.onlineUsers.every((el) => el.id == 0);
  }
}
