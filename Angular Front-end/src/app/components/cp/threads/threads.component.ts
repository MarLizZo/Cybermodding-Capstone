import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from 'src/app/services/moderation.service';
import { FormsModule, NgForm } from '@angular/forms';
import { OrangeButtonComponent } from '../../orange-button/orange-button.component';
import { InlineLoaderComponent } from '../../inline-loader/inline-loader.component';
import { IPostHomePaged } from 'src/app/interfaces/ipost-home-paged';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { IUpdatePostDTO } from 'src/app/interfaces/iupdate-post-dto';
import { ThreadStatsComponent } from './thread-stats/thread-stats.component';

type CustomPArr = {
  id: number;
  title: string;
};

@Component({
  selector: 'app-threads',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
    ThreadStatsComponent,
  ],
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent {
  constructor(private svc: ModerationService) {}

  @Input() user_id: number | undefined;
  @Input() isSearchThreadView: boolean = true;
  @Input() isAllThreadView: boolean = false;
  @Input() isStatsThreadView: boolean = false;
  @Input() classColor: string | undefined = undefined;
  isSingleThreadView: boolean = false;
  singleThread: IPostData | undefined;
  inputSearchThread: string = '';
  threadSearchCriteria: number = 0;
  threadsFound!: IPostHomePaged;
  threadsAllFound!: IPostHomePaged;
  startDateThread: string = '2023/1/1';
  endDateThread: string = '2023/12/1';
  threadTitleArr: CustomPArr[] = [];
  threadPagesArr: number[] = [];
  threadAllTitleArr: CustomPArr[] = [];
  threadAllPagesArr: number[] = [];
  isError: boolean = false;
  errorMsg: string = '';
  isAllError: boolean = false;
  errorAllMsg: string = '';
  isOpThread: boolean = false;
  isErrorModerate: boolean = false;

  threadSub!: Subscription;
  moderateThreadSub!: Subscription;

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    if (this.threadSub) this.threadSub.unsubscribe();
    if (this.moderateThreadSub) this.moderateThreadSub.unsubscribe();
  }

  setSingleThread(thread: IPostData) {
    this.singleThread = thread;
    this.isSingleThreadView = true;
  }

  resetSingleThread() {
    this.isSingleThreadView = false;
    this.singleThread = undefined;
  }

  doThreadSearch(page: number) {
    this.isError = false;
    this.isSingleThreadView = false;
    this.singleThread = undefined;
    this.errorMsg = '';

    if (this.threadSub) this.threadSub.unsubscribe();

    let searchBy = '';
    if (this.threadSearchCriteria == 0) {
      searchBy = '&by=title&param=' + this.inputSearchThread;
    } else if (this.threadSearchCriteria == 1) {
      searchBy = '&by=user&param=' + this.inputSearchThread;
    } else {
      searchBy =
        '&by=date&param=' +
        this.startDateThread +
        '&paramtwo=' +
        this.endDateThread;
    }
    let params: string = 'size=6&page=' + page + searchBy;

    this.threadSub = this.svc
      .getPostPaged(params)
      .pipe(
        catchError((err) => {
          this.errorMsg = 'Errore nel caricamento dei post.';
          this.isError = true;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.threadTitleArr = [];
        this.threadPagesArr = [];

        if (page + 1 <= 3) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 5 || i > res.totalPages - 3
              ? this.threadPagesArr.push(i + 1)
              : null;
          }
        } else if (page + 1 >= res.totalPages - 2) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 2 || i > res.totalPages - 6
              ? this.threadPagesArr.push(i + 1)
              : null;
          }
        } else {
          this.threadPagesArr.push(1);
          for (let i = page - 2; i < page + 3; i++) {
            this.threadPagesArr.push(i + 1);
          }
          this.threadPagesArr.push(res.totalPages);
        }

        for (let i = 0; i < res.numberOfElements; i++) {
          this.threadTitleArr.push({
            id: res.content[i].id!,
            title: res.content[i].title,
          });
        }

        this.threadsFound = res;
      });
  }

  doThreadSearchAll(page: number) {
    this.isAllError = false;
    this.isSingleThreadView = false;
    this.singleThread = undefined;
    this.errorAllMsg = '';

    this.threadSub = this.svc
      .getPosts(0, '?size=6' + '&page=' + page, 0)
      .pipe(
        catchError((err) => {
          this.errorAllMsg = 'Errore nel caricamento dei post.';
          this.isAllError = true;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.threadAllTitleArr = [];
        this.threadAllPagesArr = [];

        if (page + 1 <= 3) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 5 || i > res.totalPages - 3
              ? this.threadAllPagesArr.push(i + 1)
              : null;
          }
        } else if (page + 1 >= res.totalPages - 2) {
          for (let i = 0; i < res.totalPages; i++) {
            i < 2 || i > res.totalPages - 6
              ? this.threadAllPagesArr.push(i + 1)
              : null;
          }
        } else {
          this.threadAllPagesArr.push(1);
          for (let i = page - 2; i < page + 3; i++) {
            this.threadAllPagesArr.push(i + 1);
          }
          this.threadAllPagesArr.push(res.totalPages);
        }

        for (let i = 0; i < res.numberOfElements; i++) {
          this.threadAllTitleArr.push({
            id: res.content[i].id!,
            title: res.content[i].title,
          });
        }

        this.threadsAllFound = res;
      });
  }

  doPostModerate(data: NgForm): void {
    this.isOpThread = true;
    let obj: Partial<IUpdatePostDTO> = {
      id: data.controls['tid'].value,
      title: data.controls['title'].value,
    };
    this.moderateThreadSub = this.svc
      .updatePost(this.user_id!, obj)
      .pipe(
        catchError((err) => {
          this.isOpThread = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        const indexS = this.threadTitleArr.findIndex((el) => el.id == obj.id);
        const indexA = this.threadAllTitleArr.findIndex(
          (el) => el.id == obj.id
        );
        if (indexS != -1) {
          this.threadTitleArr[indexS].title = res.title;
        }
        if (indexA != -1) {
          this.threadAllTitleArr[indexA].title = res.title;
        }
        setTimeout(() => {
          this.isOpThread = false;
          document
            .querySelector('#threadParagMod')
            ?.classList.remove('opacity-0');
          setTimeout(() => {
            document
              .querySelector('#threadParagMod')
              ?.classList.add('opacity-0');
          }, 3000);
        }, 1000);
      });
  }

  canModerate(): boolean {
    if (!this.classColor) {
      // sono un admin
      if (this.user_id == 1 || this.user_id == 87) return true; // sono super admin
      return this.singleThread?.user_level == 'BOSS' ? false : true;
    } else {
      // sono un moderatore
      return this.singleThread?.user_level == 'BOSS' ||
        this.singleThread?.user_level == 'MID'
        ? false
        : true;
    }
  }
}
