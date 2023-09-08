import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { AuthService } from 'src/app/services/auth.service';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-showthread',
  templateUrl: './showthread.component.html',
  styleUrls: ['./showthread.component.scss'],
})
export class ShowthreadComponent {
  isLogged: boolean = false;
  isLoadingPage: boolean = true;
  isWaitingPage: boolean = true;
  mainSectionTitle: string = '';
  subSectionTitle: string = '';
  authSub!: Subscription;
  postSub!: Subscription;
  postData!: IPostData;
  thumbUp: string = '&#x1F44D;';
  thumbDown: string = '&#x1F44E;';
  heart: string = '&#x2764;';

  constructor(
    private svc: ForumService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let id: number = parseInt(
      this.route.snapshot.paramMap.get('hash')!.split('-')[0]
    );
    if (!isNaN(id) && id != null) {
      this.postSub = this.svc
        .getPost(id)
        .pipe(
          catchError((err) => {
            this.isLoadingPage = false;
            throw err;
          })
        )
        .subscribe((res) => {
          this.postData = res;
          console.log(res);
          this.mainSectionTitle = res.main_section_title!;
          this.subSectionTitle = res.subsection_title!;
          this.isLoadingPage = false;
        });
    }
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 300);
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.postSub) this.postSub.unsubscribe();
  }

  getReactionsCount(flag: number): number {
    return flag == 0
      ? this.postData.reactions.filter((r) => r.type.toString() == 'LIKE')
          .length
      : flag == 1
      ? this.postData.reactions.filter((r) => r.type.toString() == 'THANKS')
          .length
      : this.postData.reactions.filter((r) => r.type.toString() == 'DISLIKE')
          .length;
  }

  goToReply(): void {
    console.log('eeee', this.postData);
  }
}
