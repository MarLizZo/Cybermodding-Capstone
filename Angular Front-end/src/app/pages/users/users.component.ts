import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { IBosses } from 'src/app/interfaces/ibosses';
import { ICollapseable } from 'src/app/interfaces/icollapseable';
import { IUserData } from 'src/app/interfaces/iuser-data';
import { IUserDataPageable } from 'src/app/interfaces/iuser-data-pageable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
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
  isWaitingPage: boolean = true;
  isLoadingPage: boolean = true;
  isSingleUser: boolean = false;
  isQuickStatsCollapsed: boolean = false;
  isInfosCollapsed: boolean = false;
  pageSize: number = 8;
  pagesArr: number[] = [];
  isBossesCollapsed: boolean = true;
  isCommunityCollapsed: boolean = true;
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean[]>([false, false]);
  subsArr$ = this.subsBoolArr.asObservable();
  errorsMsgs: string[] = [];
  bossesArr: IBosses = {
    response: undefined,
    admins: [],
    mods: [],
  };
  usersArr!: IUserDataPageable;
  @ViewChild('sel') select!: ElementRef<HTMLSelectElement>;

  constructor(
    private u_svc: UserService,
    private route: ActivatedRoute,
    private auth_svc: AuthService,
    private router: Router,
    private modalSvc: NgbModal,
    protected common: CommonService
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
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 500);

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
                this.errorsMsgs.push('Errore nel caricamento degli utenti.');
                const currentValues = this.subsBoolArr.value;
                currentValues[0] = true;
                currentValues[1] = true;
                this.subsBoolArr.next(currentValues);
                return EMPTY;
              })
            )
            .subscribe((res) => {
              this.profileData = res;
              const currentValues = this.subsBoolArr.value;
              currentValues[0] = true;
              currentValues[1] = true;
              this.subsBoolArr.next(currentValues);
            });
        }
      } else {
        this.isSingleUser = false;
        this.bossSub = this.u_svc
          .getBosses()
          .pipe(
            catchError((err) => {
              if (this.errorsMsgs.length == 0) {
                this.errorsMsgs.push('Errore nel caricamento degli utenti.');
              }
              const currentValues = this.subsBoolArr.value;
              currentValues[0] = true;
              this.subsBoolArr.next(currentValues);
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.bossesArr = res;
            const currentValues = this.subsBoolArr.value;
            currentValues[0] = true;
            this.subsBoolArr.next(currentValues);
          });

        this.userSub = this.u_svc
          .getUsersPaged(8, 0)
          .pipe(
            catchError((err) => {
              if (this.errorsMsgs.length == 0) {
                this.errorsMsgs.push('Errore nel caricamento degli utenti.');
              }
              const currentValues = this.subsBoolArr.value;
              currentValues[1] = true;
              this.subsBoolArr.next(currentValues);
              return EMPTY;
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

            const currentValues = this.subsBoolArr.value;
            currentValues[1] = true;
            this.subsBoolArr.next(currentValues);
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

    this.subSub = this.subsArr$.subscribe((res) => {
      if (res.every((el) => el == true)) {
        this.isLoadingPage = false;
        if (this.errorsMsgs.length) {
          this.showModal();
        }
      }
    });
  }

  showModal() {
    const modal = this.modalSvc.open(ErrorModalComponent, {
      size: 'xl',
    });
    modal.componentInstance.messages = this.errorsMsgs;
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.bossSub) this.bossSub.unsubscribe();
    if (this.paramSub) this.paramSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
    if (this.subSub) this.subSub.unsubscribe();
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
