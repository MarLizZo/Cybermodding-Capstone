import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
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
  subSData!: ISubSectionData;
  postsArr: IPostData[] = [];
  ssParentTitle: string = '';
  ssTitle: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private svc: ForumService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    let ssId: number = parseInt(
      this.route.snapshot.paramMap.get('hash')!.split('-')[0]
    );

    if (!isNaN(ssId)) {
      this.ssSub = this.svc
        .getSubSectionById(ssId)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          console.log(res);
          this.subSData = res;
          this.ssParentTitle = res.parent_title;
          this.ssTitle = res.title;
          this.postsArr = res.posts;
        });
    }
  }

  ngOnDestroy() {
    if (this.ssSub) this.ssSub.unsubscribe();
  }
}
