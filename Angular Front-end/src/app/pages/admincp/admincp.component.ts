import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IPostHomePaged } from 'src/app/interfaces/ipost-home-paged';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { AuthService } from 'src/app/services/auth.service';
import { ForumService } from 'src/app/services/forum.service';
import { HomeService } from 'src/app/services/home.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admincp',
  templateUrl: './admincp.component.html',
  styleUrls: ['./admincp.component.scss'],
})
export class AdmincpComponent {
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private user_svc: UserService,
    private f_svc: ForumService,
    private h_svc: HomeService
  ) {}

  isLoadingPage: boolean = true;
  username: string = '';
  user_id: number = 0;
  granted: boolean = false;

  isUsersModeration: boolean = true;
  isThreadsModeration: boolean = false;
  isSectionsModeration: boolean = false;
  isBlocksModeration: boolean = false;
  isThreadViewSearch: boolean = true;
  isThreadViewAll: boolean = false;

  authPrivSub!: Subscription;
  authUserSub!: Subscription;
  usersSub!: Subscription;
  searcUserSub!: Subscription;
  moderateUserSub!: Subscription;
  threadSub!: Subscription;
  moderateThreadSub!: Subscription;

  inputSearchUser: string = '';
  usersFound!: IUserDataPageable;
  collapseableArr: boolean[] = [true, true, true, true, true, true, true, true];
  userNamesArr: string[] = [];
  userPagesArr: number[] = [];

  inputSearchThread: string = '';
  threadSearchCriteria: number = 0;
  threadsFound!: IPostHomePaged;
  collapseableTArr: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  threadsCustomFound!: IPostHomePaged;
  collapseableTCArr: boolean[] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  startDateThread: string = '2023/1/1';
  endDateThread: string = '2023/12/1';
  threadTitleArr: string[] = [];
  threadPagesArr: number[] = [];
  threadTitleCustomArr: string[] = [];
  threadPagesCustomArr: number[] = [];

  @ViewChild('userMod') usersBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadMod') threadsBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('sectionMod') sectionsBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('blockMod') blocksBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadViewSearch')
  threadViewSearchBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('threadViewAll') threadViewAllBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('selectCriteria')
  threadCriteriaSelect!: ElementRef<HTMLSelectElement>;

  ngOnInit() {
    this.authPrivSub = this.authSvc.privileges$.subscribe((res) => {
      if (res?.isAdmin) {
        this.granted = true;

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

  ngOnDestroy() {
    if (this.authPrivSub) this.authPrivSub.unsubscribe();
    if (this.authUserSub) this.authUserSub.unsubscribe();
    if (this.usersSub) this.usersSub.unsubscribe();
    if (this.searcUserSub) this.searcUserSub.unsubscribe();
    if (this.moderateUserSub) this.moderateUserSub.unsubscribe();
    if (this.threadSub) this.threadSub.unsubscribe();
    if (this.moderateThreadSub) this.moderateThreadSub.unsubscribe();
  }

  switchModeration(flag: number): void {
    if (flag == 0) {
      if (!this.isUsersModeration) {
        this.isUsersModeration = true;
        this.isThreadsModeration = false;
        this.isSectionsModeration = false;
        this.isBlocksModeration = false;
        this.usersBtn.nativeElement.classList.add('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 1) {
      if (!this.isThreadsModeration) {
        this.isThreadsModeration = true;
        this.isUsersModeration = false;
        this.isSectionsModeration = false;
        this.isBlocksModeration = false;
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.add('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 2) {
      if (!this.isSectionsModeration) {
        this.isSectionsModeration = true;
        this.isUsersModeration = false;
        this.isThreadsModeration = false;
        this.isBlocksModeration = false;
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.add('btn-selected');
        this.blocksBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 3) {
      if (!this.isBlocksModeration) {
        this.isBlocksModeration = true;
        this.isUsersModeration = false;
        this.isThreadsModeration = false;
        this.isSectionsModeration = false;
        this.usersBtn.nativeElement.classList.remove('btn-selected');
        this.threadsBtn.nativeElement.classList.remove('btn-selected');
        this.sectionsBtn.nativeElement.classList.remove('btn-selected');
        this.blocksBtn.nativeElement.classList.add('btn-selected');
      }
    }
  }

  switchThreadView(flag: number): void {
    if (flag == 0) {
      if (!this.isThreadViewSearch) {
        this.isThreadViewSearch = true;
        this.isThreadViewAll = false;
        this.threadViewSearchBtn.nativeElement.classList.add('btn-selected');
        this.threadViewAllBtn.nativeElement.classList.remove('btn-selected');
      }
    } else if (flag == 1) {
      if (!this.isThreadViewAll) {
        this.isThreadViewSearch = false;
        this.isThreadViewAll = true;
        this.threadViewSearchBtn.nativeElement.classList.remove('btn-selected');
        this.threadViewAllBtn.nativeElement.classList.add('btn-selected');
      }
    }
  }

  searchUsers(page: number): void {
    this.searcUserSub = this.user_svc
      .getUsersFromName(this.inputSearchUser, page)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.userNamesArr = [];
        this.userPagesArr = [];

        if (page + 1 <= 3) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 5 || i > res.totalPages - 3
              ? this.userPagesArr.push(i + 1)
              : null;
          }
        } else if (page + 1 >= res.totalPages - 2) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 2 || i > res.totalPages - 6
              ? this.userPagesArr.push(i + 1)
              : null;
          }
        } else {
          this.userPagesArr.push(1);
          for (let i = page - 2; i < page + 3; i++) {
            this.userPagesArr.push(i + 1);
          }
          this.userPagesArr.push(res.totalPages);
        }

        for (let i = 0; i < res.numberOfElements; i++) {
          this.userNamesArr[i] = res.content[i].username;
        }

        for (let i = 0; i < this.collapseableArr.length; i++) {
          this.collapseableArr[i] = true;
        }

        this.usersFound = res;

        setTimeout(() => {
          document.getElementById('top-user')?.scrollIntoView();
        }, 200);
      });
  }

  resetUsersFields(num: number): void {
    let usernameP: HTMLElement | null = document.getElementById(
      'err-us-' + num
    );
    let emailP: HTMLElement | null = document.getElementById('err-em-' + num);
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-de-' + num
    );
    usernameP!.classList.add('d-none');
    descriptionP?.classList.add('d-none');
    emailP?.classList.add('d-none');
  }

  doChecksUser(form: NgForm, num: number): boolean {
    let bool: boolean = true;
    let usernameP: HTMLElement | null = document.getElementById(
      'err-us-' + num
    );
    let emailP: HTMLElement | null = document.getElementById('err-em-' + num);
    let descriptionP: HTMLElement | null = document.getElementById(
      'err-de-' + num
    );

    if (form.controls['username'].value.length < 3) {
      bool = false;
      usernameP!.classList.remove('d-none');
      usernameP!.innerText = 'Min 3 chars';
    } else if (form.controls['username'].value.length > 30) {
      bool = false;
      usernameP!.classList.remove('d-none');
      usernameP!.innerText = 'Max 30 chars';
    }

    if (form.controls['description'].value.length > 25) {
      bool = false;
      descriptionP?.classList.remove('d-none');
    }

    if (
      !RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$').test(
        form.controls['email'].value
      )
    ) {
      bool = false;
      emailP?.classList.remove('d-none');
    }

    return bool;
  }

  doUserModerate(data: NgForm, index: number): void {
    this.resetUsersFields(index);

    if (this.doChecksUser(data, index)) {
      let outData: Partial<IUserData> = {
        id: data.controls['uid'].value,
        username: data.controls['username'].value,
        email: data.controls['email'].value,
        description: data.controls['description'].value,
        roles:
          data.controls['role'].value == 4
            ? [{ id: 4, roleName: 'ROLE_BANNED' }]
            : data.controls['role'].value == 2
            ? [{ id: 2, roleName: 'ROLE_MODERATOR' }]
            : data.controls['role'].value == 3
            ? [{ id: 2, roleName: 'ROLE_ADMIN' }]
            : [{ id: 1, roleName: 'ROLE_USER' }],
      };

      this.moderateUserSub = this.user_svc
        .moderate(this.user_id, outData)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          console.log(res);
          this.userNamesArr[index] = res.username!;
        });
    }
  }

  doPostModerate(data: NgForm, index: number): void {
    let obj = {
      id: this.isThreadViewAll
        ? data.controls['tid'].value
        : data.controls['tidc'].value,
      title: this.isThreadViewAll
        ? data.controls['title'].value
        : data.controls['titlec'].value,
    };
    this.moderateThreadSub = this.f_svc
      .updatePost(obj)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.isThreadViewAll
          ? (this.threadTitleArr[index] = res.title)
          : (this.threadTitleCustomArr[index] = res.title);
      });
  }

  doThreadSearch(page: number) {
    if (this.threadSub) this.threadSub.unsubscribe();

    if (this.isThreadViewAll) {
      this.threadSub = this.h_svc
        .getPosts(0, '?size=6' + '&page=' + page, 0)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.threadTitleArr = [];
          this.threadPagesArr = [];

          if (page + 1 <= 3) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 5 || i > res.totalPages - 3
                ? this.threadPagesArr.push(i + 1)
                : null;
            }
          } else if (page + 1 >= res.totalPages - 2) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 2 || i > res.totalPages - 6
                ? this.threadPagesArr.push(i + 1)
                : null;
            }
          } else {
            this.threadPagesArr.push(1);
            for (let i = page - 2; i < page + 3; i++) {
              this.threadPagesArr.push(i + 1);
            }
            this.threadPagesArr.push(res.totalPages);
          }

          for (let i = 0; i < res.numberOfElements; i++) {
            this.threadTitleArr[i] = res.content[i].title;
          }

          for (let i = 0; i < this.collapseableTArr.length; i++) {
            this.collapseableTArr[i] = true;
          }
          this.threadsFound = res;
        });
    } else {
      let searchBy = '';
      if (this.threadSearchCriteria == 0) {
        searchBy = '&by=title&param=' + this.inputSearchThread;
      } else if (this.threadSearchCriteria == 1) {
        searchBy = '&by=user&param=' + this.inputSearchThread;
      } else {
        searchBy =
          '&by=date&param=' +
          this.startDateThread +
          '&paramtwo=' +
          this.endDateThread;
      }
      let params: string = 'size=6&page=' + page + searchBy;

      this.threadSub = this.f_svc
        .getPostPaged(params)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.threadTitleCustomArr = [];
          this.threadPagesCustomArr = [];

          if (page + 1 <= 3) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 5 || i > res.totalPages - 3
                ? this.threadPagesCustomArr.push(i + 1)
                : null;
            }
          } else if (page + 1 >= res.totalPages - 2) {
            for (let i = 0; i < res.totalPages; i++) {
              i < 2 || i > res.totalPages - 6
                ? this.threadPagesCustomArr.push(i + 1)
                : null;
            }
          } else {
            this.threadPagesCustomArr.push(1);
            for (let i = page - 2; i < page + 3; i++) {
              this.threadPagesCustomArr.push(i + 1);
            }
            this.threadPagesCustomArr.push(res.totalPages);
          }

          for (let i = 0; i < res.numberOfElements; i++) {
            this.threadTitleCustomArr[i] = res.content[i].title;
          }

          for (let i = 0; i < this.collapseableTCArr.length; i++) {
            this.collapseableTCArr[i] = true;
          }

          this.threadsCustomFound = res;
        });
    }
  }
}
