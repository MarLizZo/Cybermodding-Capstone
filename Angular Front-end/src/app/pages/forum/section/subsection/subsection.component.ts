import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { UserLevel } from 'src/app/enums/user-level';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { AuthService } from 'src/app/services/auth.service';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-subsection',
  templateUrl: './subsection.component.html',
  styleUrls: ['./subsection.component.scss'],
})
export class SubsectionComponent {
  ssSub!: Subscription;
  authSub!: Subscription;
  subSData!: ISubSectionData;
  postsArr: IPostData[] = [];
  ssParentTitle: string = '';
  ssParentId: number = 0;
  ssTitle: string = '';
  isAuthenticated: boolean = false;
  newThreadPath: string = '';
  topBObj: any = [];

  constructor(
    private svc: ForumService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  setTopBarObj() {
    this.topBObj = [
      {
        name: 'FORUM',
        url: '/forum',
      },
      {
        name: this.ssParentTitle,
        url:
          '/forum/section/' +
          this.ssParentId +
          '-' +
          this.ssParentTitle
            .replaceAll(' ', '')
            .replaceAll('/', '')
            .toLowerCase(),
      },
      {
        name: this.ssTitle,
        url:
          '/forum/subsection/' +
          this.subSData.id +
          '-' +
          this.ssTitle.replaceAll(' ', '').replaceAll('/', '').toLowerCase(),
      },
    ];
  }

  ngOnInit() {
    let ssId: number = parseInt(
      this.route.snapshot.paramMap.get('hash')!.split('-')[0]
    );
    this.newThreadPath = '/forum/newthread/' + ssId;

    if (!isNaN(ssId) && ssId != null) {
      this.ssSub = this.svc
        .getSubSectionById(ssId)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.subSData = res;
          this.ssParentTitle = res.parent_title;
          this.ssParentId = res.parent_id;
          this.ssTitle = res.title;
          this.postsArr = res.posts;
          this.setTopBarObj();
        });
    }

    this.authSub = this.auth.isLogged$
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.isAuthenticated = res;
      });
  }

  ngOnDestroy() {
    if (this.ssSub) this.ssSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
  }

  getClassName(level: UserLevel): string {
    return level.toString() == 'BASE'
      ? 'txt-orange'
      : level.toString() == 'MID'
      ? 'txt-mod'
      : level.toString() == 'BOSS'
      ? 'text-danger'
      : 'txt-ban';
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

  getCommentLink(index: number): void {
    let baseUrl: string =
      '/forum/showthread/' +
      this.postsArr[index].id +
      '-' +
      this.postsArr[index].title
        .replaceAll(' ', '-')
        .replaceAll('/', '-')
        .replaceAll('.', '')
        .toLowerCase();

    if (this.postsArr[index].comments_count == 0) {
      this.router.navigateByUrl(baseUrl);
    } else if (this.postsArr[index].comments_count! <= 8) {
      sessionStorage.setItem('scrolltocomment', 'true');
      this.router.navigateByUrl(baseUrl + '/1');
    } else {
      let page = Math.ceil(this.postsArr[index].comments_count! / 8);
      sessionStorage.setItem('scrolltocomment', 'true');
      this.router.navigateByUrl(baseUrl + '/' + page);
    }
  }
}
