import { Component } from '@angular/core';
import { Subscription, catchError, map } from 'rxjs';
import { UserLevel } from 'src/app/enums/user-level';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';
import { AuthService } from 'src/app/services/auth.service';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class ForumComponent {
  isLoadingPage: boolean = true;
  username: string | undefined;
  user_id: number | undefined;
  userlevel: UserLevel | undefined;
  logSub!: Subscription;
  userDataSub!: Subscription;
  privSub!: Subscription;
  sidesSub!: Subscription;
  forumSub!: Subscription;
  isUserLogged: boolean = false;
  sectionsArr: ISectionData[] = [];
  sidesArr: ISideBlockData[] = [];

  constructor(private authSvc: AuthService, private fSvc: ForumService) {}

  ngOnInit() {
    this.logSub = this.authSvc.isLogged$.subscribe((res) => {
      this.isUserLogged = res;
    });

    this.userDataSub = this.authSvc.user$.subscribe((res) => {
      this.username = res?.username;
      this.user_id = res?.user_id;
    });

    this.privSub = this.authSvc.privileges$.subscribe((res) => {
      this.userlevel = res?.isAdmin
        ? UserLevel.BOSS
        : res?.isMod
        ? UserLevel.MID
        : UserLevel.BASE;
    });

    this.sidesSub = this.fSvc
      .getForumSideBlocks()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.sidesArr = res;
      });

    this.forumSub = this.fSvc
      .getForumSections()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.sectionsArr = res;
      });

    setTimeout(() => {
      this.isLoadingPage = false;
    }, 1500);
  }

  ngOnDestroy() {
    if (this.logSub) this.logSub.unsubscribe();
    if (this.userDataSub) this.userDataSub.unsubscribe();
    if (this.privSub) this.privSub.unsubscribe();
    if (this.sidesSub) this.sidesSub.unsubscribe();
    if (this.forumSub) this.forumSub.unsubscribe();
  }
}
