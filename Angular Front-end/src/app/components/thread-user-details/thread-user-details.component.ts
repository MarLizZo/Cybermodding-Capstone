import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPostData } from 'src/app/interfaces/ipost-data';
import { ICommentData } from 'src/app/interfaces/icomment-data';

@Component({
  selector: 'app-thread-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-user-details.component.html',
  styleUrls: ['./thread-user-details.component.scss'],
})
export class ThreadUserDetailsComponent {
  @Input() postData!: IPostData | null;
  @Input() commentData!: ICommentData | null;

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
}
