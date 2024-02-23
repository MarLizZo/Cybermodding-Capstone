import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { IContactMessageBody } from 'src/app/interfaces/icontact-message-body';
import { AuthService } from 'src/app/services/auth.service';
import { ModerationService } from 'src/app/services/moderation.service';

type CollapseComps = {
  collapsed: boolean;
  subs: {
    [view: string]: boolean;
  };
};

@Component({
  selector: 'app-admincp',
  templateUrl: './admincp.component.html',
  styleUrls: ['./admincp.component.scss'],
})
export class AdmincpComponent {
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private svc: ModerationService
  ) {}

  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isWaitingPanel: boolean = true;
  isErrorPanel: boolean = false;
  isErrorMessagePanel: boolean = false;
  errorPanelMsg: string = '';
  username: string | undefined = '';
  user_id: number | undefined = 0;
  granted: boolean = false;

  contactMessagesArr: IContactMessageBody[] = [];
  openContactMessagesArr: IContactMessageBody[] = [];
  closedContactMessagesArr: IContactMessageBody[] = [];
  contactMessagesErrorString: string | undefined;

  isMessagesCollapsed: CollapseComps = {
    collapsed: false,
    subs: {
      isMsgOpenView: true,
      isMsgClosedView: false,
    },
  };

  isUsersCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isSearchUsersView: false,
      isUsersStatsView: false,
    },
  };

  isQuickBanCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isQuickBanSearchView: false,
    },
  };

  isThreadsModCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isThreadSearchView: false,
      isThreadAllView: false,
      isThreadStatsView: false,
    },
  };

  isSectionsModCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isSectionCreateView: false,
      isSubSectionCreateView: false,
      isSectionAllView: false,
    },
  };

  isBlocksCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isBlockCreateView: false,
      isBlockAllView: false,
    },
  };

  isInfosCollapsed: CollapseComps = {
    collapsed: true,
    subs: {
      isInfoSysView: false,
    },
  };

  getAnySubViewOpen(collapseable: CollapseComps): boolean {
    let result: boolean = false;
    for (let key in collapseable.subs) {
      if (collapseable.subs[key]) result = true;
    }
    return result;
  }

  resetAllSubViews(except: CollapseComps) {
    if (this.isMessagesCollapsed != except) {
      for (let key in this.isMessagesCollapsed.subs) {
        this.isMessagesCollapsed.subs[key] = false;
      }
    }
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
    if (this.isSectionsModCollapsed != except) {
      for (let key in this.isSectionsModCollapsed.subs) {
        this.isSectionsModCollapsed.subs[key] = false;
      }
    }
    if (this.isBlocksCollapsed != except) {
      for (let key in this.isBlocksCollapsed.subs) {
        this.isBlocksCollapsed.subs[key] = false;
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

  initSub!: Subscription;
  authPrivSub!: Subscription;
  authUserSub!: Subscription;
  usersSub!: Subscription;
  searcUserSub!: Subscription;
  moderateUserSub!: Subscription;
  threadSub!: Subscription;
  moderateThreadSub!: Subscription;
  sectionSub!: Subscription;
  subSectionSub!: Subscription;
  subSectionOperationsSub!: Subscription;
  sectionOperationsSub!: Subscription;
  blockOperationsSub!: Subscription;
  contactsOperationsSub!: Subscription;

  archiveMessage(id: number) {
    this.contactMessagesErrorString = undefined;
    let index: number = this.openContactMessagesArr.findIndex(
      (el) => el.id == id
    );

    if (index >= 0) {
      this.svc
        .setMessageClosed(this.openContactMessagesArr[index].id)
        .pipe(
          catchError((err) => {
            this.contactMessagesErrorString = 'Errore catch in console';
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.response.ok) {
            this.openContactMessagesArr[index].closed = true;
            this.closedContactMessagesArr.push(
              this.openContactMessagesArr[index]
            );
            this.openContactMessagesArr.splice(index, 1);
          } else {
            this.contactMessagesErrorString = res.response.message;
          }
        });
    } else {
      this.contactMessagesErrorString =
        'Errore msg not found in filter. Contatta il dev.';
    }
  }

  reOpenMessage(id: number) {
    this.contactMessagesErrorString = undefined;
    let index: number = this.closedContactMessagesArr.findIndex(
      (el) => el.id == id
    );

    if (index >= 0) {
      this.svc
        .setMessageOpen(this.closedContactMessagesArr[index].id)
        .pipe(
          catchError((err) => {
            this.contactMessagesErrorString = 'Errore catch in console';
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.response.ok) {
            this.closedContactMessagesArr[index].closed = false;
            this.openContactMessagesArr.push(
              this.closedContactMessagesArr[index]
            );
            this.closedContactMessagesArr.splice(index, 1);
          } else {
            this.contactMessagesErrorString = res.response.message;
          }
        });
    } else {
      this.contactMessagesErrorString =
        'Errore msg not found in filter. Contatta il dev.';
    }
  }

  ngOnInit() {
    this.authSvc.intialized$.subscribe((init) => {
      if (init) {
        this.authPrivSub = this.authSvc.privileges$.subscribe((res) => {
          if (res?.isAdmin) {
            this.granted = true;

            this.authUserSub = this.authSvc.user$.subscribe((res) => {
              this.username = res?.username;
              this.user_id = res?.user_id;

              this.getContactMessages();
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

    setTimeout(() => {
      this.isWaitingPage = false;
    }, 750);
  }

  ngOnDestroy() {
    if (this.authPrivSub) this.authPrivSub.unsubscribe();
    if (this.authUserSub) this.authUserSub.unsubscribe();
    if (this.usersSub) this.usersSub.unsubscribe();
    if (this.searcUserSub) this.searcUserSub.unsubscribe();
    if (this.moderateUserSub) this.moderateUserSub.unsubscribe();
    if (this.threadSub) this.threadSub.unsubscribe();
    if (this.moderateThreadSub) this.moderateThreadSub.unsubscribe();
    if (this.sectionSub) this.sectionSub.unsubscribe();
    if (this.sectionOperationsSub) this.sectionOperationsSub.unsubscribe();
    if (this.subSectionSub) this.subSectionSub.unsubscribe();
    if (this.subSectionOperationsSub)
      this.subSectionOperationsSub.unsubscribe();
    if (this.blockOperationsSub) this.blockOperationsSub.unsubscribe();
    if (this.initSub) this.initSub.unsubscribe();
    if (this.contactsOperationsSub) this.contactsOperationsSub.unsubscribe();
  }

  getContactMessages() {
    if (this.contactsOperationsSub) this.contactsOperationsSub.unsubscribe();
    this.isWaitingPanel = true;
    this.isErrorPanel = false;
    this.isErrorMessagePanel = false;

    this.contactsOperationsSub = this.svc
      .getAllContactMessages()
      .pipe(
        catchError((err) => {
          this.errorPanelMsg = 'Errore nel caricamento dei messaggi';
          this.isErrorMessagePanel = true;
          this.isWaitingPanel = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.contactMessagesArr = res;
        this.openContactMessagesArr = res.filter((el) => !el.closed);
        this.closedContactMessagesArr = res.filter((el) => el.closed);
        this.isWaitingPanel = false;
      });
  }
}
