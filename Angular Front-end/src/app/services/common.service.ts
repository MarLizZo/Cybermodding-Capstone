import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserData } from '../interfaces/iuser-data';
import { IPostData } from '../interfaces/ipost-data';
import { AuthService } from './auth.service';
import { UserLevel } from '../enums/user-level';
import { ICommentData } from '../interfaces/icomment-data';
import { IPostDataPaged } from '../interfaces/ipost-data-paged';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type minimalUserData = {
  id: number;
  username: string;
};

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private router: Router,
    private auth_svc: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  getClassName(level: UserLevel | string): string {
    return level.toString() == 'BASE'
      ? 'txt-orange'
      : level.toString() == 'MID'
      ? 'txt-mod'
      : level.toString() == 'BOSS'
      ? 'text-danger'
      : 'txt-ban';
  }

  goToForumPost(post: IPostData | IPostDataPaged) {
    this.router.navigateByUrl(
      `/forum/showthread/${post.id}-${post.title
        .replaceAll(' ', '-')
        .replaceAll('.', '-')
        .replaceAll('/', '-')}`
    );
  }

  goToComment(comment: ICommentData) {
    let baseUrl: string =
      '/forum/showthread/' +
      comment.post!.id +
      '-' +
      comment
        .post!.title.replaceAll(' ', '-')
        .replaceAll('/', '-')
        .toLowerCase();

    sessionStorage.setItem('scrolltonumber', comment.id!.toString());
    if (comment.post!.comments_count! <= 8) {
      this.router.navigateByUrl(baseUrl + '/1');
    } else {
      let pageIndex = Math.ceil(comment.post!.comments_count! / 8);
      this.router.navigateByUrl(baseUrl + '/' + pageIndex);
    }
  }

  removeTags(str: string): string {
    return str
      .replaceAll(/<blockquote.*?\>/g, '')
      .replaceAll('</blockquote>', '')
      .replaceAll(/<span.*?\>/g, '')
      .replaceAll('</span>', '')
      .replaceAll(/<p.*?\>/g, '')
      .replaceAll('</p>', ' ')
      .replaceAll(/<a.*?\>/g, '')
      .replaceAll('</a>', '')
      .replaceAll('<strong>', '')
      .replaceAll('</strong>', '')
      .replaceAll('<em>', '')
      .replaceAll('</em>', '')
      .replaceAll('<s>', '')
      .replaceAll('</s>', '')
      .replaceAll('<h1>', '')
      .replaceAll('</h1>', ' ')
      .replaceAll('<h2>', '')
      .replaceAll('</h2>', ' ')
      .replaceAll('<h3>', '')
      .replaceAll('</h3>', ' ')
      .replaceAll('<h4>', '')
      .replaceAll('</h4>', ' ')
      .replaceAll('<h5>', '')
      .replaceAll('</h5>', ' ')
      .replaceAll('<h6>', '')
      .replaceAll('</h6>', ' ')
      .replaceAll('<u>', '')
      .replaceAll('</u>', '')
      .replaceAll('<li>', '')
      .replaceAll('</li>', '')
      .replaceAll('<ol>', '')
      .replaceAll('</ol>', '')
      .replaceAll('<ul>', '')
      .replaceAll('</ul>', '')
      .replaceAll('<code>', '')
      .replaceAll('</code>', '')
      .replaceAll('&nbsp;', ' ');
  }

  goToProfile(user: IUserData | minimalUserData) {
    this.auth_svc.user$.subscribe((res) => {
      if (res?.user_id == user.id) {
        this.router.navigateByUrl('/profile');
      } else {
        this.router.navigateByUrl(
          `/users/${user.id}-${user.username
            .replaceAll(' ', '')
            .replaceAll('.', '')}`
        );
      }
    });
  }

  bypassSec(html: string): SafeHtml {
    let safeHtml = html.replaceAll(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ''
    );
    return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
  }
}
