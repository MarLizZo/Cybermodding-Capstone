import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CkeditorComponent } from '../ckeditor/ckeditor.component';
import { ForumService } from 'src/app/services/forum.service';
import { catchError } from 'rxjs';
import { IQuoteInfo } from 'src/app/interfaces/iquote-info';

@Component({
  selector: 'app-editor-form',
  standalone: true,
  imports: [CommonModule, CkeditorComponent],
  templateUrl: './editor-form.component.html',
  styleUrls: ['./editor-form.component.scss'],
})
export class EditorFormComponent {
  @Input() type!: string;
  @Input() postID!: number;
  @Input() userID!: number;
  @Input() postTitle!: string | undefined;
  @Input() quoted!: IQuoteInfo | undefined;
  @Output() submitData = new EventEmitter();
  @Output() submitPost = new EventEmitter();

  heightStyle: string = 'min-height: 45vh';

  constructor(private svc: ForumService) {}

  ngOnInit() {
    if (!this.type) this.type = 'comment';
    if (this.type != 'comment') {
      this.heightStyle = 'min-height: 85vh';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quoted']) {
      this.quoted = changes['quoted'].currentValue;
    }
    if (changes['postTitle']) {
      this.postTitle = changes['postTitle'].currentValue;
    }
  }

  ngOnDestroy() {
    //
  }

  doPost(data: string): void {
    if (this.type == 'comment') {
      this.svc
        .postComment({
          user_id: this.userID,
          post_id: this.postID!,
          content: data,
        })
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.submitData.emit(res);
        });
    } else {
      this.submitPost.emit(data);
    }
  }
}
