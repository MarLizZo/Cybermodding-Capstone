import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-subsection',
  templateUrl: './subsection.component.html',
  styleUrls: ['./subsection.component.scss'],
})
export class SubsectionComponent {
  isWaitingPage: boolean = true;
  isLoadingPage: boolean = true;
  ssSub!: Subscription;
  authSub!: Subscription;
  routeSub!: Subscription;
  subSData!: ISubSectionData;
  postsArr: IPostData[] = [];
  ssParentTitle: string = '';
  ssParentId: number = 0;
  ssTitle: string = '';
  isAuthenticated: boolean = false;
  newThreadPath: string = '';
  topBObj: any = [];
  errorsMsgs: string[] = [];
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean>(false);
  subsArr$ = this.subsBoolArr.asObservable();

  constructor(
    private svc: ForumService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private modalSvc: NgbModal,
    protected common: CommonService
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
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 350);

    this.routeSub = this.route.paramMap.subscribe((res) => {
      let ssId: number = parseInt(res.get('hash')!.split('-')[0]);
      this.newThreadPath = '/forum/newthread/' + ssId;

      if (!isNaN(ssId) && ssId != null) {
        this.ssSub = this.svc
          .getSubSectionById(ssId)
          .pipe(
            catchError((err) => {
              this.errorsMsgs.push('Errore nel caricamento della sezione.');
              this.subsBoolArr.next(true);
              return EMPTY;
            })
          )
          .subscribe((res) => {
            this.subSData = res;
            this.ssParentTitle = res.parent_title;
            this.ssParentId = res.parent_id;
            this.ssTitle = res.title;
            this.postsArr = res.posts;
            this.setTopBarObj();
            this.subsBoolArr.next(true);
          });
      }

      this.authSub = this.auth.isLogged$
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.isAuthenticated = res;
        });
    });

    this.subSub = this.subsArr$.subscribe((res) => {
      if (res == true) {
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
    if (this.ssSub) this.ssSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
    if (this.subSub) this.subSub.unsubscribe();
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
