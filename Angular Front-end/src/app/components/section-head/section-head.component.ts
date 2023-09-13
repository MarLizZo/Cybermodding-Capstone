import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumService } from 'src/app/services/forum.service';
import { Subscription, catchError } from 'rxjs';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { SubsectionBodyComponent } from '../subsection-body/subsection-body.component';

@Component({
  selector: 'app-section-head',
  standalone: true,
  imports: [CommonModule, SubsectionBodyComponent],
  templateUrl: './section-head.component.html',
  styleUrls: ['./section-head.component.scss'],
})
export class SectionHeadComponent {
  constructor(private svc: ForumService) {}

  @Input() sectionName!: string;
  @Input() sectionDescr!: string;
  @Input() sectionId!: number;
  @Input() isLast!: boolean;
  subs!: Subscription;
  subsArr: ISubSectionData[] = [];

  ngOnInit() {
    this.subs = this.svc
      .getSubSectionsPerSection(this.sectionId)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe((res) => {
        this.subsArr = res;
      });
  }

  ngOnDestroy() {
    if (this.subs) this.subs.unsubscribe();
  }
}
