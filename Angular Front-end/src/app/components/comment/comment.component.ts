import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICommentData } from 'src/app/interfaces/icomment-data';
import { ThreadUserDetailsComponent } from '../thread-user-details/thread-user-details.component';
import { BtnReplyComponent } from '../btn-reply/btn-reply.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, ThreadUserDetailsComponent, BtnReplyComponent],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {
  @Input() commentData!: ICommentData;
  @Input() commentIndex!: number;

  @Output() onReply = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  constructor() {}

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  goToReply(): void {
    this.onReply.emit(this.commentData);
  }

  sendDelete(): void {
    this.onDelete.emit(this.commentData);
  }
}
