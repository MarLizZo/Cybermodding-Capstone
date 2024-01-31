import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ForumService } from '../../services/forum.service';
import { Isearchres } from '../../interfaces/isearchres';
import { AuthService } from '../../services/auth.service';
import { ICommentData } from '../../interfaces/icomment-data';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  isError: boolean = false;
  isNotValidString: boolean = false;
  inputString: string | null = null;
  isUsersCollapsed: boolean = false;
  isPostsCollapsed: boolean = true;
  isCommentsCollapsed: boolean = true;
  userPagesArr: number[] = [];
  postsPagesArr: number[] = [];
  commentsPagesArr: number[] = [];
  routeSub!: Subscription;
  searchSub!: Subscription;
  customSearchSub!: Subscription;
  authSub!: Subscription;
  pageResult: Isearchres | undefined;

  @ViewChild('collapseUser') collapseUserDiv!: ElementRef<HTMLElement>;
  @ViewChild('collapsePost') collapsePostDiv!: ElementRef<HTMLElement>;
  @ViewChild('collapseComment') collapseCommentDiv!: ElementRef<HTMLElement>;

  constructor(
    private route: ActivatedRoute,
    private svc: ForumService,
    private router: Router,
    private auth_svc: AuthService,
    protected common: CommonService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 1000);

    this.routeSub = this.route.paramMap.subscribe((res) => {
      this.inputString = res.get('input');

      if (this.inputString && this.inputString != 'noinput') {
        this.searchSub = this.svc
          .searchStringInit(this.inputString)
          .pipe(
            catchError((err) => {
              this.isLoadingPage = false;
              this.isError = true;
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.pageResult = res;
            this.fixPagination(this.pageResult.users, 0);
            this.fixPagination(this.pageResult.posts, 1);
            this.fixPagination(this.pageResult.comments, 2);
            this.isError = false;
            this.isLoadingPage = false;
          });
      } else {
        this.isLoadingPage = false;
        this.isNotValidString = true;
      }
    });
  }

  fixPagination(pageable: any, arr: number) {
    let tempArr: number[] = [];
    if (pageable.number + 1 <= 3) {
      for (let i = 0; i < pageable.totalPages; i++) {
        i < 5 || i > pageable.totalPages - 3 ? tempArr.push(i + 1) : null;
      }
    } else if (pageable.number + 1 >= pageable.totalPages - 2) {
      for (let i = 0; i < pageable.totalPages; i++) {
        i < 2 || i > pageable.totalPages - 6 ? tempArr.push(i + 1) : null;
      }
    } else {
      tempArr.push(1);
      for (let i = pageable.number - 2; i < pageable.number + 3; i++) {
        tempArr.push(i + 1);
      }
      tempArr.push(pageable.totalPages);
    }

    if (arr == 0) this.userPagesArr = tempArr;
    else if (arr == 1) this.postsPagesArr = tempArr;
    else if (arr == 2) this.commentsPagesArr = tempArr;
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.searchSub) this.searchSub.unsubscribe();
    if (this.customSearchSub) this.customSearchSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
  }

  searchCustomPage(by: number, index: number) {
    if (this.customSearchSub) this.customSearchSub.unsubscribe();
    switch (by) {
      case 0:
        // users call
        this.customSearchSub = this.svc
          .searchStringCustom('users', this.inputString!, index)
          .pipe(
            catchError((err) => {
              this.isError = true;
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.pageResult!.users = res;
            this.fixPagination(this.pageResult!.users, 0);
          });
        break;
      case 1:
        // posts call
        this.customSearchSub = this.svc
          .searchStringCustom('posts', this.inputString!, index)
          .pipe(
            catchError((err) => {
              this.isError = true;
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.pageResult!.posts = res;
            this.fixPagination(this.pageResult!.posts, 1);
          });
        break;
      case 2:
        // comments call
        this.customSearchSub = this.svc
          .searchStringCustom('comments', this.inputString!, index)
          .pipe(
            catchError((err) => {
              this.isError = true;
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.pageResult!.comments = res;
            this.fixPagination(this.pageResult!.comments, 2);
          });
        break;
    }
  }

  collapseOption(type: number) {
    switch (type) {
      case 0:
        if (this.isUsersCollapsed) {
          this.isPostsCollapsed = true;
          this.isCommentsCollapsed = true;
        }
        setTimeout(
          () => {
            this.isUsersCollapsed = !this.isUsersCollapsed;
          },
          this.isUsersCollapsed ? 500 : 50
        );
        break;
      case 1:
        if (this.isPostsCollapsed) {
          this.isUsersCollapsed = true;
          this.isCommentsCollapsed = true;
        }
        setTimeout(
          () => {
            this.isPostsCollapsed = !this.isPostsCollapsed;
          },
          this.isPostsCollapsed ? 500 : 50
        );
        break;
      case 2:
        if (this.isCommentsCollapsed) {
          this.isUsersCollapsed = true;
          this.isPostsCollapsed = true;
        }
        setTimeout(
          () => {
            this.isCommentsCollapsed = !this.isCommentsCollapsed;
          },
          this.isCommentsCollapsed ? 500 : 50
        );
        break;
    }
  }

  goToUser(id: number, username: string): void {
    this.authSub = this.auth_svc.user$.subscribe((res) => {
      res?.user_id == id
        ? this.router.navigateByUrl('/profile')
        : this.router.navigateByUrl(
            '/users/' +
              id +
              '-' +
              username.replaceAll(' ', '').replaceAll('.', '')
          );
    });
  }
}
