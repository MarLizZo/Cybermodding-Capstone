import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumService } from 'src/app/services/forum.service';
import { Subscription, catchError } from 'rxjs';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { SubsectionBodyComponent } from '../subsection-body/subsection-body.component';
import { Router } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

type secConf = [
  {
    id: number;
    collapsed: boolean;
  }
];

@Component({
  selector: 'app-section-head',
  standalone: true,
  imports: [CommonModule, SubsectionBodyComponent, NgbCollapseModule],
  templateUrl: './section-head.component.html',
  styleUrls: ['./section-head.component.scss'],
})
export class SectionHeadComponent {
  constructor(private svc: ForumService, private router: Router) {}

  @Input() sectionName!: string;
  @Input() sectionDescr!: string;
  @Input() sectionId!: number;
  @Input() isLast!: boolean;
  isSectionCollapsed: boolean = false;
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

    if (localStorage.getItem('sections-config')) {
      let config: secConf = JSON.parse(
        localStorage.getItem('sections-config')!
      );
      let sec = config.findIndex((el) => el.id == this.sectionId);
      if (sec != -1) this.isSectionCollapsed = config[sec].collapsed;
    }
  }

  ngOnDestroy() {
    if (this.subs) this.subs.unsubscribe();
  }

  goToPage(): void {
    sessionStorage.setItem(
      'secData',
      JSON.stringify({
        sectionId: this.sectionId,
        sectionName: this.sectionName,
        subs: this.subsArr,
      })
    );
    this.router.navigateByUrl(
      `/forum/section/${this.sectionId}-${this.sectionName
        .replaceAll(' ', '-')
        .replaceAll('/', '-')
        .toLowerCase()}`
    );
  }

  setConfig() {
    this.isSectionCollapsed = !this.isSectionCollapsed;
    if (localStorage.getItem('sections-config')) {
      let config: secConf = JSON.parse(
        localStorage.getItem('sections-config')!
      );
      let sec = config.findIndex((el) => el.id == this.sectionId);
      if (sec != -1) {
        config[sec].collapsed = this.isSectionCollapsed;
      } else {
        config.push({ id: this.sectionId, collapsed: this.isSectionCollapsed });
      }
      localStorage.setItem('sections-config', JSON.stringify(config));
    } else {
      localStorage.setItem(
        'sections-config',
        JSON.stringify([
          { id: this.sectionId, collapsed: this.isSectionCollapsed },
        ])
      );
    }
  }
}
