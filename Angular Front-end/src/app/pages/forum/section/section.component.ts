import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { ISectionData } from 'src/app/interfaces/isection-data';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  sectionData!: ISectionData;
  subsData: ISubSectionData[] = [];
  sectionId: number = 0;
  sectionName: string = '';
  sectionSub!: Subscription;
  subsSuscription!: Subscription;
  topBObj: any = [];

  constructor(private route: ActivatedRoute, private svc: ForumService) {}

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
    this.sectionId = parseInt(
      this.route.snapshot.paramMap.get('hash')!.split('-')[0]
    );
    this.sectionSub = this.svc
      .getSectionById(this.sectionId)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.sectionData = res;
        this.sectionName = res.title;
        this.setTopBarObject();
      });

    this.subsSuscription = this.svc
      .getSubSectionsPerSection(this.sectionId)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.subsData = res;
      });
  }

  ngOnDestroy() {
    if (this.sectionSub) this.sectionSub.unsubscribe();
    if (this.subsSuscription) this.subsSuscription.unsubscribe();
  }
}
