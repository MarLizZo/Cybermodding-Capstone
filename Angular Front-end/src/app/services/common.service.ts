import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserData } from '../interfaces/iuser-data';
import { IPostData } from '../interfaces/ipost-data';
import { AuthService } from './auth.service';
import { UserLevel } from '../enums/user-level';
import { ICommentData } from '../interfaces/icomment-data';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router, private auth_svc: AuthService) {}

  getClassName(level: UserLevel | string): string {
    return level.toString() == 'BASE'
      ? 'txt-orange'
      : level.toString() == 'MID'
      ? 'txt-mod'
      : level.toString() == 'BOSS'
      ? 'text-danger'
      : 'txt-ban';
  }

  goToForumPost(post: IPostData) {
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
      .replaceAll('<blockquote>', '')
      .replaceAll('</blockquote>', '')
      .replaceAll('<b>', '')
      .replaceAll('</b>', '')
      .replaceAll('<i>', '')
      .replaceAll('</i>', '')
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .replaceAll('&nbsp;', ' ');
  }

  goToProfile(user: IUserData) {
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
}
