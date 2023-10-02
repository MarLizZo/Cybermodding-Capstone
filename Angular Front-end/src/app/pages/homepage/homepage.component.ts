import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { IPostHomePaged } from 'src/app/interfaces/ipost-home-paged';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  constructor(
    private svc: HomeService,
    private auth_svc: AuthService,
    private router: Router
  ) {}

  newsSub!: Subscription;
  sidesSub!: Subscription;
  sectionsSub!: Subscription;
  postsSub!: Subscription;
  authSub!: Subscription;
  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  selectedSectionIndex: number = 0;
  selectedSectionOrderIndex: number = 0;
  btnSectionsText: string = 'Tutte le sezioni';
  btnSectionsOrderText: string = 'Data pubblicazione';
  sidesArr: ISideBlockData[] = [];
  sectionsArr: ISectionData[] = [];
  selectedSectionData!: ISubSectionData;
  postsData!: IPostHomePaged;
  pagesArr: number[] = [];

  ngOnInit() {
    this.sidesSub = this.svc
      .getForumSideBlocks()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.sidesArr = res;
      });

    this.sectionsSub = this.svc
      .getSections()
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        res.splice(
          res.findIndex((s) => s.id == 1),
          1
        );
        this.sectionsArr = res;
      });

    this.doPostsCall(0, 0, true);

    setTimeout(() => {
      this.isWaitingPage = false;
    }, 1000);
  }

  ngOnDestroy() {
    if (this.newsSub) this.newsSub.unsubscribe();
    if (this.sidesSub) this.sidesSub.unsubscribe();
    if (this.sectionsSub) this.sectionsSub.unsubscribe();
    if (this.postsSub) this.postsSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
  }

  doPostsCall(parent_id: number, page: number, init: boolean) {
    this.postsSub = this.svc
      .getPosts(
        parent_id,
        '?size=6' + '&page=' + page,
        this.selectedSectionOrderIndex
      )
      .pipe(
        catchError((err) => {
          this.isLoadingPage = false;
          throw err;
        })
      )
      .subscribe((res) => {
        this.postsData = res;
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
        this.isLoadingPage = false;

        if (!init) {
          setTimeout(() => {
            document.querySelector('#home-head')?.scrollIntoView();
          }, 100);
        }
      });
  }

  switchSection(index: number) {
    if (index != this.selectedSectionIndex) {
      this.selectedSectionIndex = index;
      if (index == 0) {
        this.btnSectionsText = 'Tutte le sezioni';
        this.doPostsCall(0, 0, false);
      } else {
        this.btnSectionsText = this.sectionsArr[index - 1].title;
        this.doPostsCall(this.sectionsArr[index - 1].id!, 0, false);
      }
    }
  }

  switchOrder(index: number) {
    this.selectedSectionOrderIndex = index;
    switch (index) {
      case 0:
        this.btnSectionsOrderText = 'Data pubblicazione';
        this.postsData.content.sort(function (a, b) {
          return b.id! - a.id!;
        });
        break;
      case 1:
        this.btnSectionsOrderText = 'Numero di commenti';
        this.postsData.content.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        break;
      case 2:
        this.btnSectionsOrderText = 'Numero di reazioni';
        this.postsData.content.sort(function (a, b) {
          return b.reactions.length - a.reactions.length;
        });
        break;
    }
  }

  getClassName(level: string) {
    return level == 'BOSS'
      ? 'text-danger'
      : level == 'MID'
      ? 'text-mod'
      : 'text-orange';
  }

  goToForumPost(post: IPostData) {
    this.router.navigateByUrl(
      `/forum/showthread/${post.id}-${post.title
        .replaceAll(' ', '-')
        .replaceAll('.', '-')
        .replaceAll('/', '-')}`
    );
  }

  goToProfile(user: IUserData) {
    this.authSub = this.auth_svc.user$.subscribe((res) => {
      res?.user_id == user.id
        ? this.router.navigateByUrl('/profile')
        : this.router.navigateByUrl(
            '/users/' +
              user.id +
              '-' +
              user.username.replaceAll(' ', '').replaceAll('.', '')
          );
    });
  }
}
