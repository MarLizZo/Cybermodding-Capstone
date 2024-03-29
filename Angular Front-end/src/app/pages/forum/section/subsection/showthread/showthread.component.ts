import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, EMPTY, Subscription, catchError } from 'rxjs';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { ReactionType } from 'src/app/enums/reaction-type';
import { ICommentData } from 'src/app/interfaces/icomment-data';
import { IPostDataPaged } from 'src/app/interfaces/ipost-data-paged';
import { IQuoteInfo } from 'src/app/interfaces/iquote-info';
import { Ireaction } from 'src/app/interfaces/ireaction';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
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
  privSub!: Subscription;
  postSub!: Subscription;
  delSub!: Subscription;
  delCommSub!: Subscription;
  reactSub!: Subscription;
  postData!: IPostDataPaged;
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
  sentReactionID: number | undefined;
  quotedMessage: IQuoteInfo | undefined;
  pagesArr: number[] = [];
  postId: number = 0;
  topBObj: any = [];
  canEdit: boolean | undefined = false;
  isMod: boolean | undefined = false;
  subSub!: Subscription;
  subsBoolArr = new BehaviorSubject<boolean>(false);
  subsArr$ = this.subsBoolArr.asObservable();
  errorsMsgs: string[] = [];

  @ViewChild('editorForm') editorForm!: ElementRef<HTMLElement>;

  constructor(
    private svc: ForumService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalSvc: NgbModal,
    private common: CommonService
  ) {}

  setTopBarObj() {
    this.topBObj = [
      {
        name: 'FORUM',
        url: '/forum',
      },
      {
        name: this.mainSectionTitle,
        url:
          '/forum/section/' +
          this.postData.main_section_id +
          '-' +
          this.mainSectionTitle
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
      {
        name: this.subSectionTitle,
        url:
          '/forum/subsection/' +
          this.postData.subsection_id +
          '-' +
          this.subSectionTitle
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
      {
        name: this.postData.title,
        url:
          '/forum/showthread/' +
          this.postData.id +
          '-' +
          this.postData.title
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
    ];
  }

  doCall(page: number, refreshPage: boolean) {
    if (this.postData == null || page != this.postData.comments.number) {
      this.postSub = this.svc
        .getPost(this.postId, {
          size: 8,
          page: page,
        })
        .pipe(
          catchError((err) => {
            this.errorsMsgs.push('Errore nel caricamento del post.');
            let currentValues = this.subsBoolArr.value;
            currentValues = true;
            this.subsBoolArr.next(currentValues);
            return EMPTY;
          })
        )
        .subscribe((res) => {
          if (res.response.ok) {
            this.postData = res;
            this.postData.body = this.common.bypassSec(
              this.postData.body.toString()
            );
            this.mainSectionTitle = res.main_section_title!;
            this.subSectionTitle = res.subsection_title!;
            this.getReactionsCount();
            this.hasUserReaction();
            this.pagesArr = [];
            this.setTopBarObj();

            if (page + 1 <= 3) {
              for (let i = 0; i < res.comments.totalPages; i++) {
                i < 5 || i > res.comments.totalPages - 3
                  ? this.pagesArr.push(i + 1)
                  : null;
              }
            } else if (page + 1 >= res.comments.totalPages - 2) {
              for (let i = 0; i < res.comments.totalPages; i++) {
                i < 2 || i > res.comments.totalPages - 6
                  ? this.pagesArr.push(i + 1)
                  : null;
              }
            } else {
              this.pagesArr.push(1);
              for (let i = page - 2; i < page + 3; i++) {
                this.pagesArr.push(i + 1);
              }
              this.pagesArr.push(res.comments.totalPages);
            }
            if (refreshPage) {
              this.router.navigateByUrl(
                '/forum/showthread/' +
                  this.route.snapshot.paramMap.get('hash')! +
                  '/' +
                  (page + 1)
              );
            }
            if (sessionStorage.getItem('scrolltocomment')) {
              sessionStorage.removeItem('scrolltocomment');
              setTimeout(() => {
                document
                  .querySelector('app-comment:last-of-type')
                  ?.scrollIntoView();
              }, 1000);
            } else if (sessionStorage.getItem('scrolltonumber')) {
              let commentIndex: number = parseInt(
                sessionStorage.getItem('scrolltonumber')!
              );
              sessionStorage.removeItem('scrolltonumber');

              let toIndex: number = this.postData.comments.content.findIndex(
                (el) => el.id == commentIndex
              );
              setTimeout(() => {
                document
                  .querySelector(`app-comment:nth-of-type(${toIndex + 1})`)
                  ?.scrollIntoView();
              }, 1000);
            } else if (refreshPage) {
              setTimeout(() => {
                document.querySelector('app-comment')?.scrollIntoView();
              }, 1000);
            }
          } else {
            this.errorsMsgs.push(res.response.message);
          }

          let currentValues = this.subsBoolArr.value;
          currentValues = true;
          this.subsBoolArr.next(currentValues);
        });
    }
  }

  ngOnInit() {
    this.postId = parseInt(
      this.route.snapshot.paramMap.get('hash')!.split('-')[0]
    );
    if (!isNaN(this.postId) && this.postId != null) {
      if (this.route.snapshot.paramMap.get('page') == null) {
        // initial call - page 0 default
        this.doCall(0, false);
      } else {
        // call with specific page
        let id: number = parseInt(this.route.snapshot.paramMap.get('page')!);
        this.doCall(id - 1, false);
      }

      this.authSub = this.auth.user$.subscribe((res) => {
        this.userID = res?.user_id;
      });

      this.privSub = this.auth.privileges$.subscribe((res) => {
        this.canEdit = res?.isAdmin || res?.isMod;
        this.isMod = res?.isMod ? true : false;
      });
    }

    this.subSub = this.subsArr$.subscribe((res) => {
      if (res == true) {
        this.isLoadingPage = false;
        if (this.errorsMsgs.length) {
          this.showModal();
        }
      }
    });

    setTimeout(() => {
      this.isWaitingPage = false;
    }, 400);
  }

  showModal() {
    const modal = this.modalSvc.open(ErrorModalComponent, {
      size: 'xl',
    });
    modal.componentInstance.messages = this.errorsMsgs;
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.postSub) this.postSub.unsubscribe();
    if (this.delSub) this.delSub.unsubscribe();
    if (this.delCommSub) this.delCommSub.unsubscribe();
    if (this.reactSub) this.reactSub.unsubscribe();
    if (this.subSub) this.subSub.unsubscribe();
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

  goToReply(comm?: ICommentData): void {
    this.editorForm.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (comm) {
      this.quotedMessage = {
        content: comm.content,
        username: comm.user.username,
        user_id: comm.user.id!,
        user_level: comm.user_level!,
      };
    } else {
      this.quotedMessage = {
        content: this.postData.body as string,
        user_id: this.postData.author.id!,
        username: this.postData.author.username,
        user_level: this.postData.user_level!,
      };
    }
  }

  addReaction(re_type: number): void {
    let like_check: boolean = re_type == 0 && this.hasUserLike;
    let thanks_check: boolean = re_type == 1 && this.hasUserThanks;
    let dislike_check: boolean = re_type == 2 && this.hasUserDislike;
    if (this.reactSub) this.reactSub.unsubscribe();

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
          this.sentReactionID = res.id;
          this.fixCount(re_type);
        });
    } else if (like_check) {
      let id: number | undefined = this.postData.reactions.find(
        (r) =>
          r.type == ReactionType[ReactionType.LIKE] && r.user?.id == this.userID
      )?.id;
      this.reactSub = this.svc
        .deleteReaction(
          this.sentReactionID != undefined ? this.sentReactionID : id!
        )
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.sentReactionID = undefined;
          this.hasUserLike = false;
          this.likeCount--;
        });
    } else if (thanks_check) {
      let id: number | undefined = this.postData.reactions.find(
        (r) =>
          r.type == ReactionType[ReactionType.THANKS] &&
          r.user?.id == this.userID
      )?.id;
      this.reactSub = this.svc
        .deleteReaction(
          this.sentReactionID != undefined ? this.sentReactionID : id!
        )
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.sentReactionID = undefined;
          this.hasUserThanks = false;
          this.thanksCount--;
        });
    } else if (dislike_check) {
      let id: number | undefined = this.postData.reactions.find(
        (r) =>
          r.type == ReactionType[ReactionType.DISLIKE] &&
          r.user?.id == this.userID
      )?.id;
      this.reactSub = this.svc
        .deleteReaction(
          this.sentReactionID != undefined ? this.sentReactionID : id!
        )
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.sentReactionID = undefined;
          this.hasUserDislike = false;
          this.dislikeCount--;
        });
    }
  }

  fixCount(type: number): void {
    if (type == 0) {
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
    } else if (type == 1) {
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

  onNewComment(comment: ICommentData) {
    if (comment.content.length) {
      this.postData.comments.content.push(comment);
    }
    if (this.postData.comments.totalElements == 0) {
      this.postData.comments.number = 0;
      this.pagesArr = [1];
    }
    this.postData.comments.numberOfElements += 1;
  }

  getCommentNumber(index: number): number {
    if (this.postData.comments.number == 0) {
      return index;
    } else {
      return 8 * this.postData.comments.number + index;
    }
  }

  goToEdit(): void {
    localStorage.setItem('post-id', this.postData.id.toString());
    let tb = [
      {
        name: 'FORUM',
        url: '/forum',
      },
      {
        name: this.mainSectionTitle,
        url:
          '/forum/section/' +
          this.postData.main_section_id +
          '-' +
          this.mainSectionTitle
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
      {
        name: this.subSectionTitle,
        url:
          '/forum/subsection/' +
          this.postData.subsection_id +
          '-' +
          this.subSectionTitle
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
      {
        name: this.postData.title,
        url:
          '/forum/showthread/' +
          this.postData.id +
          '-' +
          this.postData.title
            .replaceAll(' ', '-')
            .replaceAll('/', '-')
            .toLowerCase(),
      },
      {
        name: 'Modifica post',
        url: '/forum/newthread/' + this.postData.subsection_id,
      },
    ];
    localStorage.setItem('topbar-editp', JSON.stringify(tb));
    this.router.navigateByUrl(
      '/forum/newthread/' + this.postData.subsection_id
    );
  }

  canDelete(): boolean {
    if (!this.canEdit) {
      return this.postData.author.id == this.userID ? true : false;
    }

    if (this.isMod) {
      return this.postData.user_level!.toString() == 'BOSS' ? false : true;
    }

    return true;
  }

  deletePost() {
    if (this.canDelete()) {
      let ssLink =
        'forum/subsection/' +
        this.postData.subsection_id +
        '-' +
        this.postData.subsection_title
          ?.toLowerCase()
          .replaceAll(' ', '-')
          .replaceAll('/', '-');
      this.delSub = this.svc
        .deleteThread(this.postData.id)
        .pipe(
          catchError((err) => {
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.router.navigate([ssLink]);
        });
    }
  }

  deleteComment(comment: ICommentData) {
    this.delCommSub = this.svc
      .deleteComment(comment.id!)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe((res) => {
        let index = this.postData.comments.content.findIndex(
          (el) => el.id == comment.id
        );
        let arr = this.postData.comments.content.splice(index, 1);
        if (arr.length) {
          if (this.postData.comments.number != 0) {
            if (this.postData.comments.numberOfElements <= 1) {
              this.common.goToForumPost(this.postData);
            }
          } else {
            if (this.postData.comments.numberOfElements <= 1) {
              this.pagesArr = [];
            }
          }
          if (this.postData.comments.numberOfElements > 0) {
            this.postData.comments.numberOfElements--;
          }
        }
      });
  }
}
