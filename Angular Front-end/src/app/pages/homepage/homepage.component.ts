import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  EMPTY,
  Subscription,
  catchError,
  forkJoin,
  from,
  zip,
} from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { IPostHomePaged } from 'src/app/interfaces/ipost-home-paged';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { CommonService } from 'src/app/services/common.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  constructor(
    private svc: HomeService,
    private modalSvc: NgbModal,
    protected common: CommonService
  ) {}

  newsSub!: Subscription;
  sidesSub!: Subscription;
  sectionsSub!: Subscription;
  postsSub!: Subscription;
  authSub!: Subscription;
  subSub!: Subscription;
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
  errorsMsgs: string[] = [];
  subsBoolArr = new BehaviorSubject<boolean[]>([false, false, false]);
  subsArr$ = this.subsBoolArr.asObservable();

  ngOnInit() {
    this.sidesSub = this.svc
      .getForumSideBlocks()
      .pipe(
        catchError((err) => {
          this.errorsMsgs.push(
            'Errore nel caricamento della sidebar laterale.'
          );
          const currentValues = this.subsBoolArr.value;
          currentValues[0] = true;
          this.subsBoolArr.next(currentValues);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.sidesArr = res;
        const currentValues = this.subsBoolArr.value;
        currentValues[0] = true;
        this.subsBoolArr.next(currentValues);
      });

    this.sectionsSub = this.svc
      .getSections()
      .pipe(
        catchError((err) => {
          this.errorsMsgs.push(
            'Errore nel caricamento delle informazioni sulle sezioni.'
          );
          const currentValues = this.subsBoolArr.value;
          currentValues[1] = true;
          this.subsBoolArr.next(currentValues);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        res.splice(
          res.findIndex((s) => s.id == 1),
          1
        );
        this.sectionsArr = res;
        const currentValues = this.subsBoolArr.value;
        currentValues[1] = true;
        this.subsBoolArr.next(currentValues);
      });

    this.doPostsCall(0, 0, true);

    this.subSub = this.subsArr$.subscribe((res) => {
      if (res.every((el) => el == true)) {
        this.isLoadingPage = false;
        if (this.errorsMsgs.length) {
          this.showModal();
        }
      }
    });

    setTimeout(() => {
      this.isWaitingPage = false;
    }, 1000);
  }

  showModal() {
    const modal = this.modalSvc.open(ErrorModalComponent, {
      size: 'xl',
    });
    modal.componentInstance.messages = this.errorsMsgs;
  }

  ngOnDestroy() {
    if (this.newsSub) this.newsSub.unsubscribe();
    if (this.sidesSub) this.sidesSub.unsubscribe();
    if (this.sectionsSub) this.sectionsSub.unsubscribe();
    if (this.postsSub) this.postsSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
    if (this.subSub) this.subSub.unsubscribe();
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
          this.errorsMsgs.push('Errore nel caricamento dei post.');
          const currentValues = this.subsBoolArr.value;
          currentValues[2] = true;
          this.subsBoolArr.next(currentValues);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.postsData = res;
        res.content = res.content.map((el) => {
          el.body = this.common.bypassSec(el.body.toString());
          return el;
        });

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
        const currentValues = this.subsBoolArr.value;
        currentValues[2] = true;
        this.subsBoolArr.next(currentValues);

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
}
