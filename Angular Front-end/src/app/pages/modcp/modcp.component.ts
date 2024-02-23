import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { AuthService } from 'src/app/services/auth.service';
import { ModerationService } from 'src/app/services/moderation.service';

type CollapseComps = {
  collapsed: boolean;
  subs: {
    [view: string]: boolean;
  };
};

@Component({
  selector: 'app-modcp',
  templateUrl: './modcp.component.html',
  styleUrls: ['./modcp.component.scss'],
})
export class ModcpComponent {
  constructor(private authSvc: AuthService, private router: Router) {}

  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isWaitingPanel: boolean = true;
  isErrorPanel: boolean = false;
  errorPanelMsg: string = '';
  username: string | undefined = '';
  user_id: number | undefined = 0;
  classColor: string = '';
  granted: boolean = false;
  initSub!: Subscription;
  authPrivSub!: Subscription;
  authUserSub!: Subscription;

  isUsersCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isSearchUsersView: false,
    },
  };

  isQuickBanCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isQuickBanSearchView: false,
    },
  };

  isThreadsModCollapsed: CollapseComps = {
    collapsed: false,
    subs: {
      isThreadSearchView: true,
      isThreadAllView: false,
    },
  };

  isInfosCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isInfoSysView: false,
    },
  };

  ngOnInit() {
    this.initSub = this.authSvc.intialized$.subscribe((res) => {
      if (res) {
        this.authPrivSub = this.authSvc.privileges$.subscribe((res) => {
          if (res?.isMod || res?.isAdmin) {
            this.granted = true;
            this.classColor = res.isMod ? 'txt-mod' : 'text-danger';

            this.authUserSub = this.authSvc.user$.subscribe((res) => {
              this.username = res!.username;
              this.user_id = res!.user_id;
              this.isLoadingPage = false;
            });
          } else {
            this.isLoadingPage = false;
            this.granted = false;
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 2000);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.authPrivSub) this.authPrivSub.unsubscribe();
    if (this.authUserSub) this.authUserSub.unsubscribe();
    if (this.initSub) this.initSub.unsubscribe();
  }

  getAnySubViewOpen(collapseable: CollapseComps): boolean {
    let result: boolean = false;
    for (let key in collapseable.subs) {
      if (collapseable.subs[key]) result = true;
    }
    return result;
  }

  resetAllSubViews(except: CollapseComps) {
    if (this.isUsersCollapsed != except) {
      for (let key in this.isUsersCollapsed.subs) {
        this.isUsersCollapsed.subs[key] = false;
      }
    }
    if (this.isQuickBanCollapsed != except) {
      for (let key in this.isQuickBanCollapsed.subs) {
        this.isQuickBanCollapsed.subs[key] = false;
      }
    }
    if (this.isThreadsModCollapsed != except) {
      for (let key in this.isThreadsModCollapsed.subs) {
        this.isThreadsModCollapsed.subs[key] = false;
      }
    }
    if (this.isInfosCollapsed != except) {
      for (let key in this.isInfosCollapsed.subs) {
        this.isInfosCollapsed.subs[key] = false;
      }
    }
  }

  setNewView(collapseable: CollapseComps, view: string) {
    this.resetAllSubViews(collapseable);
    for (let key in collapseable.subs) {
      if (key == view) {
        collapseable.subs[key] = true;
      } else {
        collapseable.subs[key] = false;
      }
    }
  }
}
