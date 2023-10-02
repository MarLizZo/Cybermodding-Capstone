import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError } from 'rxjs';
import { PostType } from 'src/app/enums/post-type';
import { IPostDTO } from 'src/app/interfaces/ipost-dto';
import { IUpdatePostDTO } from 'src/app/interfaces/iupdate-post-dto';
import { AuthService } from 'src/app/services/auth.service';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-newthread',
  templateUrl: './newthread.component.html',
  styleUrls: ['./newthread.component.scss'],
})
export class NewthreadComponent {
  getPostSub!: Subscription;
  postSub!: Subscription;
  authSub!: Subscription;
  ssInfoSub!: Subscription;
  user_id: number | undefined = 0;
  ssParentTitle: string = '';
  ssParentId: number = 0;
  ssTitle: string = '';
  ssId: number = 0;
  typeString: string = 'Type General';
  typeOfThread: PostType = PostType.GENERAL;
  topBObj: any = [];
  threadTitle = '';
  editPostId: number = 0;
  editPostInitBody: string = '';
  @ViewChild('generalBtn') generalBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('newsBtn') newsBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('guideBtn') guideBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('questionBtn') questionBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  constructor(
    private svc: ForumService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private router: Router
  ) {}

  setTopBarObj() {
    if (this.editPostId == 0) {
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
              .replaceAll(' ', '-')
              .replaceAll('/', '')
              .toLowerCase(),
        },
        {
          name: this.ssTitle,
          url:
            '/forum/subsection/' +
            this.ssId +
            '-' +
            this.ssTitle.replaceAll(' ', '-').replaceAll('/', '').toLowerCase(),
        },
        {
          name: 'Nuovo Post',
          url: '/forum/newthread/' + this.ssId,
        },
      ];
    } else {
      if (localStorage.getItem('topbar-editp')) {
        this.topBObj = JSON.parse(localStorage.getItem('topbar-editp')!);
      }
    }
  }

  ngOnInit() {
    if (localStorage.getItem('post-id')) {
      this.editPostId = Number(localStorage.getItem('post-id'));
      this.setTopBarObj();
      this.getPostSub = this.svc
        .getSinglePost(this.editPostId)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.threadTitle = res.title;
          this.editPostInitBody = res.body;
        });
    } else {
      this.ssId = parseInt(this.route.snapshot.paramMap.get('id')!);
      this.ssInfoSub = this.svc
        .getSubSectionById(this.ssId)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.ssParentTitle = res.parent_title;
          this.ssParentId = res.parent_id;
          this.ssTitle = res.title;
          this.setTopBarObj();
        });
    }

    this.authSub = this.authSvc.user$.subscribe((res) => {
      this.user_id = res?.user_id;
    });
  }

  ngOnDestroy() {
    if (this.getPostSub) this.getPostSub.unsubscribe();
    if (this.postSub) this.postSub.unsubscribe();
    if (this.ssInfoSub) this.ssInfoSub.unsubscribe();
    if (this.authSub) this.authSub.unsubscribe();
    localStorage.removeItem('post-id');
    localStorage.removeItem('topbar-editp');
  }

  switchType(type: string) {
    this.generalBtn.nativeElement.classList.remove('txt-orange');
    this.newsBtn.nativeElement.classList.remove('txt-orange');
    this.guideBtn.nativeElement.classList.remove('txt-orange');
    this.questionBtn.nativeElement.classList.remove('txt-orange');
    switch (type) {
      case 'General':
        this.generalBtn.nativeElement.classList.add('txt-orange');
        this.typeOfThread = PostType.GENERAL;
        break;
      case 'News':
        this.newsBtn.nativeElement.classList.add('txt-orange');
        this.typeOfThread = PostType.NEWS;
        break;
      case 'Guide':
        this.guideBtn.nativeElement.classList.add('txt-orange');
        this.typeOfThread = PostType.GUIDE;
        break;
      case 'Question':
        this.questionBtn.nativeElement.classList.add('txt-orange');
        this.typeOfThread = PostType.QUESTION;
        break;
    }
    this.typeString = 'Type ' + type;
  }

  postThread(data: string): void {
    if (this.editPostId == 0) {
      const postData: IPostDTO = {
        title: this.titleInput.nativeElement.value,
        body: data,
        user_id: this.user_id!,
        subSection_id: this.ssId,
        type: PostType[this.typeOfThread],
      };
      this.postSub = this.svc
        .postNewThread(postData)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          setTimeout(() => {
            this.router.navigate([
              '/forum/showthread/' +
                res.id +
                '-' +
                res.title.replaceAll(' ', '-').replaceAll('/', '-'),
            ]);
          }, 1500);
        });
    } else {
      const postData: IUpdatePostDTO = {
        id: this.editPostId,
        title: this.titleInput.nativeElement.value,
        active: true,
        body: data,
        type: PostType[this.typeOfThread],
      };
      this.postSub = this.svc
        .updatePost(this.user_id!, postData)
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.router.navigateByUrl(
            '/forum/showthread/' +
              res.id +
              '-' +
              res.title
                .replaceAll(' ', '-')
                .replaceAll('/', '-')
                .replaceAll('.', '-')
          );
        });
    }
  }
}
