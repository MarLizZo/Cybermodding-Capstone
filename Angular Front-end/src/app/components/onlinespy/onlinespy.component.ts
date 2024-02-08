import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOnlineSpy } from 'src/app/interfaces/ionline-spy';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { OnlinespyService } from 'src/app/services/onlinespy.service';

@Component({
  selector: 'app-onlinespy',
  templateUrl: './onlinespy.component.html',
  styleUrls: ['./onlinespy.component.scss'],
})
export class OnlinespyComponent {
  connectSub!: Subscription;
  onlineSessions: IOnlineSpy[] = [];
  onlineUsers: IOnlineSpy[] = [];
  user_id: number = 0;

  constructor(
    private svc: OnlinespyService,
    private auth_svc: AuthService,
    private common: CommonService
  ) {}

  ngOnInit() {
    this.auth_svc.intialized$.subscribe((init) => {
      if (init) {
        if (this.connectSub) this.connectSub.unsubscribe();
        this.connectSub = this.auth_svc.user$.subscribe((res) => {
          if (!OnlinespyService.loggingFlag) {
            if (res?.user_id) {
              this.user_id = res!.user_id;
            } else {
              this.user_id = 0;
            }
            this.svc.getOnlineUsers(this.user_id).subscribe((on) => {
              this.onlineSessions = on;
              this.clearDuplicate();
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
    return this.onlineSessions.every((el) => el.id == 0);
  }

  areSomeGuestsOnline(): boolean {
    return this.onlineSessions.some((el) => el.id == 0);
  }

  guestsOnlineCount(): number {
    return this.onlineSessions.filter((el) => el.id == 0).length;
  }

  goToProfile(id: number, username: string) {
    this.common.goToProfile({ id: id, username: username });
  }

  clearDuplicate() {
    this.onlineSessions.forEach((el) => {
      if (el.id == 0) return;
      if (this.onlineUsers.findIndex((ou) => ou.id == el.id) != -1) return;
      this.onlineUsers.push(el);
    });
  }
}
