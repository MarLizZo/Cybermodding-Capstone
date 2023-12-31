import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { ICommentData } from 'src/app/interfaces/icomment-data';
import { IPostDataPaged } from 'src/app/interfaces/ipost-data-paged';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-user-details.component.html',
  styleUrls: ['./thread-user-details.component.scss'],
})
export class ThreadUserDetailsComponent {
  @Input() postData!: IPostData | IPostDataPaged | null;
  @Input() commentData!: ICommentData | null;
  authSub!: Subscription;

  constructor(private router: Router, private authSvc: AuthService) {}

  getImgLink(): string {
    if (this.postData != null) {
      return this.postData.user_level!.toString() == 'BASE'
        ? 'assets/rank/user.png'
        : this.postData.user_level!.toString() == 'MID'
        ? 'assets/rank/mod.png'
        : this.postData.user_level!.toString() == 'BOSS'
        ? 'assets/rank/admin.png'
        : 'assets/rank/banned.png';
    } else {
      return this.commentData!.user_level!.toString() == 'BASE'
        ? 'assets/rank/user.png'
        : this.commentData!.user_level!.toString() == 'MID'
        ? 'assets/rank/mod.png'
        : this.commentData!.user_level!.toString() == 'BOSS'
        ? 'assets/rank/admin.png'
        : 'assets/rank/banned.png';
    }
  }

  getNameClass(): string {
    if (this.postData != null) {
      return this.postData.user_level!.toString() == 'BASE'
        ? 'txt-orange'
        : this.postData.user_level!.toString() == 'MID'
        ? 'txt-mod'
        : this.postData.user_level!.toString() == 'BOSS'
        ? 'text-danger'
        : 'txt-ban';
    } else {
      return this.commentData!.user_level!.toString() == 'BASE'
        ? 'txt-orange'
        : this.commentData!.user_level!.toString() == 'MID'
        ? 'txt-mod'
        : this.commentData!.user_level!.toString() == 'BOSS'
        ? 'text-danger'
        : 'txt-ban';
    }
  }

  getRegDate(): Date {
    return this.postData != null
      ? this.postData.author.registrationDate
      : this.commentData!.user.registrationDate;
  }

  getDescr(): string {
    const actualDescr: string =
      this.postData != null
        ? this.postData.author.description
        : this.commentData!.user.description;
    return '<i>' + actualDescr + '</i>';
  }

  goToProfile() {
    this.authSub = this.authSvc.user$.subscribe((res) => {
      if (this.postData != null) {
        if (res?.user_id == this.postData?.author.id) {
          this.router.navigateByUrl('/profile');
        } else {
          this.router.navigateByUrl(
            `/users/${this.postData?.author.id}-${this.postData?.author.username
              .replaceAll(' ', '')
              .replaceAll('.', '')}`
          );
        }
      } else {
        if (res?.user_id == this.commentData?.user.id) {
          this.router.navigateByUrl('/profile');
        } else {
          this.router.navigateByUrl(
            `/users/${
              this.commentData?.user.id
            }-${this.commentData?.user.username
              .replaceAll(' ', '')
              .replaceAll('.', '')}`
          );
        }
      }
    });
  }
}
