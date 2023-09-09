import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { ReactionType } from 'src/app/enums/reaction-type';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { Ireaction } from 'src/app/interfaces/ireaction';
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
  reactSub!: Subscription;
  postData!: IPostData;
  thumbUp: string = '&#x1F44D;';
  thumbDown: string = '&#x1F44E;';
  heart: string = '&#x2764;';
  hasUserLike: boolean = false;
  hasUserThanks: boolean = false;
  hasUserDislike: boolean = false;
  likeCount: number = 0;
  thanksCount: number = 0;
  dislikeCount: number = 0;
  userID: number | undefined;

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
          console.log(res);
          this.postData = res;
          this.mainSectionTitle = res.main_section_title!;
          this.subSectionTitle = res.subsection_title!;
          this.getReactionsCount();
          this.hasUserReaction();
          this.isLoadingPage = false;
        });

      this.authSub = this.auth.user$.subscribe((res) => {
        this.userID = res?.user_id;
        console.log(res?.user_id);
      });
    }
    setTimeout(() => {
      this.isWaitingPage = false;
    }, 400);
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.postSub) this.postSub.unsubscribe();
    if (this.reactSub) this.reactSub.unsubscribe();
  }

  getReactionsCount(): void {
    this.likeCount = this.postData.reactions.filter(
      (r) => r.type.toString() == 'LIKE'
    ).length;
    this.thanksCount = this.postData.reactions.filter(
      (r) => r.type.toString() == 'THANKS'
    ).length;
    this.dislikeCount = this.postData.reactions.filter(
      (r) => r.type.toString() == 'DISLIKE'
    ).length;
  }

  goToReply(): void {
    console.log('eeee', this.postData);
  }

  addReaction(re_type: number): void {
    let like_check: boolean = re_type == 0 && this.hasUserLike;
    let thanks_check: boolean = re_type == 1 && this.hasUserThanks;
    let dislike_check: boolean = re_type == 2 && this.hasUserDislike;

    if (!like_check && !thanks_check && !dislike_check) {
      let react_type: ReactionType =
        re_type == 0
          ? ReactionType.LIKE
          : re_type == 1
          ? ReactionType.THANKS
          : ReactionType.DISLIKE;

      let reaction: Ireaction = {
        user_id: this.userID!,
        post_id: this.postData.id!,
        type: ReactionType[react_type],
      };

      this.reactSub = this.svc
        .postReaction(reaction)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          if (re_type == 0) {
            this.hasUserLike = true;
            this.likeCount++;
            if (this.hasUserThanks) {
              this.thanksCount--;
              this.hasUserThanks = false;
            }
            if (this.hasUserDislike) {
              this.dislikeCount--;
              this.hasUserDislike = false;
            }
          } else if (re_type == 1) {
            this.hasUserThanks = true;
            this.thanksCount++;
            if (this.hasUserLike) {
              this.likeCount--;
              this.hasUserLike = false;
            }
            if (this.hasUserDislike) {
              this.dislikeCount--;
              this.hasUserDislike = false;
            }
          } else {
            this.hasUserDislike = true;
            this.dislikeCount++;
            if (this.hasUserLike) {
              this.likeCount--;
              this.hasUserLike = false;
            }
            if (this.hasUserThanks) {
              this.thanksCount--;
              this.hasUserThanks = false;
            }
          }
        });
    }
  }

  hasUserReaction(): void {
    this.hasUserLike =
      this.postData.reactions.findIndex(
        (r) => r.type.toString() == 'LIKE' && r.user?.id == this.userID
      ) != -1;
    this.hasUserThanks =
      this.postData.reactions.findIndex(
        (r) => r.type.toString() == 'THANKS' && r.user?.id == this.userID
      ) != -1;
    this.hasUserDislike =
      this.postData.reactions.findIndex(
        (r) => r.type.toString() == 'DISLIKE' && r.user?.id == this.userID
      ) != -1;
  }
}
