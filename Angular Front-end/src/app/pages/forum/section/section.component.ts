import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  isWaitingPage: boolean = true;
  isLoadingPage: boolean = true;
  sectionData!: ISectionData;
  subsData: ISubSectionData[] = [];
  sectionId: number = 0;
  sectionName: string = '';
  sectionSub!: Subscription;
  subsSuscription!: Subscription;
  errorsMsgs: string[] = [];
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean[]>([false, false]);
  subsArr$ = this.subsBoolArr.asObservable();
  topBObj: any = [];

  constructor(
    private route: ActivatedRoute,
    private svc: ForumService,
    private modalSvc: NgbModal
  ) {}

  setTopBarObject() {
    this.topBObj = [
      {
        name: 'FORUM',
        url: '/forum',
      },
      {
        name: this.sectionName,
        url:
          '/forum/section/' +
          this.sectionId +
          '-' +
          this.sectionName
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 350);

    this.sectionId = parseInt(
      this.route.snapshot.paramMap.get('hash')!.split('-')[0]
    );

    this.sectionSub = this.svc
      .getSectionById(this.sectionId)
      .pipe(
        catchError((err) => {
          this.errorsMsgs.push('Errore nel caricamento della sezione.');
          const currentValues = this.subsBoolArr.value;
          currentValues[0] = true;
          this.subsBoolArr.next(currentValues);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.sectionData = res;
        this.sectionName = res.title;
        this.setTopBarObject();
        const currentValues = this.subsBoolArr.value;
        currentValues[0] = true;
        this.subsBoolArr.next(currentValues);
      });

    this.subsSuscription = this.svc
      .getSubSectionsPerSection(this.sectionId)
      .pipe(
        catchError((err) => {
          this.errorsMsgs.push(
            'Errore nel caricamento delle info sulle sotto-sezioni.'
          );
          const currentValues = this.subsBoolArr.value;
          currentValues[1] = true;
          this.subsBoolArr.next(currentValues);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.subsData = res;
        const currentValues = this.subsBoolArr.value;
        currentValues[1] = true;
        this.subsBoolArr.next(currentValues);
      });

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
    if (!this.isLoadingPage) {
      const modal = this.modalSvc.open(ErrorModalComponent, {
        size: 'xl',
      });
      modal.componentInstance.messages = this.errorsMsgs;
    }
  }

  ngOnDestroy() {
    if (this.sectionSub) this.sectionSub.unsubscribe();
    if (this.subsSuscription) this.subsSuscription.unsubscribe();
    if (this.subSub) this.subSub.unsubscribe();
  }
}
