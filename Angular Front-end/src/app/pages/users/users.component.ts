import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IBosses } from 'src/app/interfaces/ibosses';
import { ICollapseable } from 'src/app/interfaces/icollapseable';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  bossSub!: Subscription;
  userSub!: Subscription;
  paramSub!: Subscription;
  authSub!: Subscription;
  profileData!: IUserData;
  isLoadingPage: boolean = true;
  isSingleUser: boolean = false;
  isQuickStatsCollapsed: boolean = false;
  isInfosCollapsed: boolean = false;
  pageSize: number = 8;
  pagesArr: number[] = [];
  isBossesCollapsed: boolean = true;
  isCommunityCollapsed: boolean = true;
  bossesArr: IBosses = {
    admins: [],
    mods: [],
  };
  usersArr!: IUserDataPageable;
  @ViewChild('sel') select!: ElementRef<HTMLSelectElement>;

  constructor(
    private u_svc: UserService,
    private route: ActivatedRoute,
    private auth_svc: AuthService,
    private router: Router
  ) {}

  doCall(page: number) {
    this.userSub = this.u_svc
      .getUsersPaged(this.pageSize, page)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.usersArr = res;
        this.pagesArr = [];
        if (page + 1 <= 3) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 5 || i > res.totalPages - 3 ? this.pagesArr.push(i + 1) : null;
          }
        } else if (page + 1 >= res.totalPages - 2) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 2 || i > res.totalPages - 6 ? this.pagesArr.push(i + 1) : null;
          }
        } else {
          this.pagesArr.push(1);
          for (let i = page - 2; i < page + 3; i++) {
            this.pagesArr.push(i + 1);
          }
          this.pagesArr.push(res.totalPages);
        }
        setTimeout(() => {
          document.querySelector('#users')?.scrollIntoView();
        }, 200);
      });
  }

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe((res) => {
      if (res.get('hash')) {
        this.isSingleUser = true;
        let userId: number = parseInt(res.get('hash')!.split('-')[0]);
        if (!isNaN(userId) && userId != null) {
          this.authSub = this.auth_svc.user$.subscribe((res) => {
            if (res?.user_id == userId) {
              this.router.navigateByUrl('/profile');
              return;
            }
          });
          this.userSub = this.u_svc
            .getProfileData(userId)
            .pipe(
              catchError((err) => {
                throw err;
              })
            )
            .subscribe((res) => {
              this.profileData = res;
              this.isLoadingPage = false;
            });
        }
      } else {
        this.isLoadingPage = false;
        this.isSingleUser = false;
        this.bossSub = this.u_svc
          .getBosses()
          .pipe(
            catchError((err) => {
              throw err;
            })
          )
          .subscribe((res) => {
            this.bossesArr = res;
          });

        this.userSub = this.u_svc
          .getUsersPaged(8, 0)
          .pipe(
            catchError((err) => {
              throw err;
            })
          )
          .subscribe((res) => {
            if (res.totalPages > 6) {
              for (let i = 0; i < res.totalPages; i++) {
                i < 5 || i > res.totalPages - 3
                  ? this.pagesArr.push(i + 1)
                  : null;
              }
            } else {
              for (let i = 0; i < res.totalPages; i++) {
                this.pagesArr.push(i + 1);
              }
            }

            this.usersArr = res;
            console.log(res);
          });
      }
    });

    if (!this.isSingleUser) {
      if (localStorage.getItem('usersConfig')) {
        let fromStorage: ICollapseable[] = JSON.parse(
          localStorage.getItem('usersConfig')!
        );
        let bosses = fromStorage.findIndex((el) => el.id == 0);
        let users = fromStorage.findIndex((el) => el.id == 1);
        if (bosses != -1) {
          this.isBossesCollapsed = fromStorage[bosses].collapsed;
        }
        if (users != -1) {
          this.isCommunityCollapsed = fromStorage[users].collapsed;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.bossSub) this.bossSub.unsubscribe();
    if (this.paramSub) this.paramSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
  }

  getClassColor() {
    return this.profileData?.level == 'BOSS'
      ? 'text-danger'
      : this.profileData?.level == 'MID'
      ? 'txt-mod'
      : this.profileData?.level == 'BASE'
      ? 'txt-orange'
      : '';
  }

  goToPost() {
    if (this.profileData?.last_post) {
      this.router.navigateByUrl(
        '/forum/showthread/' +
          this.profileData.last_post.id +
          '-' +
          this.profileData.last_post.title
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase()
      );
    }
  }

  goToComment() {
    if (this.profileData?.last_comment) {
      let baseUrl: string =
        '/forum/showthread/' +
        this.profileData.last_comment.post?.id +
        '-' +
        this.profileData.last_comment.post?.title
          .replaceAll(' ', '-')
          .replaceAll('/', '-')
          .toLowerCase();

      sessionStorage.setItem(
        'scrolltonumber',
        this.profileData.last_comment.id!.toString()
      );
      if (this.profileData.last_comment.post!.comments_count! <= 8) {
        this.router.navigateByUrl(baseUrl + '/1');
      } else {
        let pageIndex = Math.ceil(
          this.profileData.last_comment.post!.comments_count! / 8
        );
        this.router.navigateByUrl(baseUrl + '/' + pageIndex);
      }
    }
  }

  removeTags(str: string): string {
    return str
      .replaceAll('<blockquote>', '')
      .replaceAll('</blockquote>', '')
      .replaceAll('<b>', '')
      .replaceAll('</b>', '')
      .replaceAll('<i>', '')
      .replaceAll('</i>', '')
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('&nbsp;', ' ');
  }

  goToMessage() {
    //
  }

  doCollapse(index: number) {
    let fromStorage: ICollapseable[] | null = null;
    if (localStorage.getItem('usersConfig')) {
      fromStorage = JSON.parse(localStorage.getItem('usersConfig')!);
    }

    if (index == 0) {
      this.isBossesCollapsed = !this.isBossesCollapsed;
    } else {
      this.isCommunityCollapsed = !this.isCommunityCollapsed;
    }

    let copy: boolean =
      index == 0 ? this.isBossesCollapsed : this.isCommunityCollapsed;

    if (fromStorage == null) {
      localStorage.setItem(
        'usersConfig',
        JSON.stringify([
          {
            id: index,
            collapsed: copy,
          },
        ])
      );
    } else {
      let ind: number = fromStorage.findIndex((el) => el.id == index);
      if (ind != -1) {
        fromStorage[ind].collapsed = copy;
      } else {
        fromStorage.push({ id: index, collapsed: copy });
      }
      localStorage.setItem('usersConfig', JSON.stringify(fromStorage));
    }
  }
}
