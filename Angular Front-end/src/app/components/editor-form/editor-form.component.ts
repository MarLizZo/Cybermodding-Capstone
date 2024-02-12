import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from 'src/app/services/forum.service';
import { IQuoteInfo } from 'src/app/interfaces/iquote-info';
import { OrangeButtonComponent } from '../orange-button/orange-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { NgxEditorModule, Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-editor-form',
  standalone: true,
  imports: [
    CommonModule,
    NgxEditorModule,
    OrangeButtonComponent,
    ModalComponent,
    FormsModule,
  ],
  templateUrl: './editor-form.component.html',
  styleUrls: ['./editor-form.component.scss'],
})
export class EditorFormComponent {
  @Input() type!: string;
  @Input() postID!: number;
  @Input() userID!: number;
  @Input() postTitle!: string | undefined;
  @Input() quoted!: IQuoteInfo | undefined;
  @Input() editBody!: string | undefined;
  @Output() submitData = new EventEmitter();
  @Output() submitPost = new EventEmitter();
  postBody!: Record<string, any> | undefined;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  preset_colors = [
    '#dc3545',
    '#ff8c00',
    '#ffc107',
    '#198754',
    '#20c997',
    '#0dcaf0',
    '#0d6efd',
    '#6f42c1',
    '#d3d3d3',
    '#808080',
    '#495057',
    '#000',
  ];

  heightStyle: string = 'min-h-50';

  constructor(private svc: ForumService, private modalSvc: NgbModal) {}

  ngOnInit() {
    this.editor = new Editor();
    if (!this.type) this.type = 'comment';
    if (this.type == 'post') {
      this.heightStyle = 'min-h-90';
    }

    if (this.editBody) {
      this.postBody = toDoc(this.editBody);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['postTitle']) {
      this.postTitle = changes['postTitle'].currentValue;
    }
    if (changes['quoted'] && this.quoted) {
      let changedMsg: IQuoteInfo = changes['quoted'].currentValue;
      let html = `<blockquote><p>${changedMsg.username}:</p><p>${changedMsg.content}</p></blockquote><p"></p>`;
      this.postBody = toDoc(html);
    }
  }

  ngAfterViewInit() {
    const mainElement = document.querySelector('ngx-editor');
    const editorWrapper = mainElement?.querySelector(
      '.NgxEditor'
    ) as HTMLElement;
    const editor = editorWrapper?.querySelector(
      '.NgxEditor__Content'
    ) as HTMLElement;
    editorWrapper.style.minHeight = mainElement!.clientHeight + 'px';
    editor.style.minHeight = mainElement!.clientHeight + 'px';
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  getButtonString(): string {
    switch (this.type) {
      case 'newpm':
        return 'Invia';
      case 'comment':
      case 'pm':
        return 'Rispondi';
      case 'post':
        return 'Posta Thread';
      case 'editpost':
        return 'Modifica Post';
      default:
        return 'Posta Thread';
    }
  }

  previewPost(): void {
    const modal = this.modalSvc.open(ModalComponent, {
      size: 'xl',
      scrollable: true,
    });
    modal.componentInstance.title =
      (this.postTitle != '' && this.postTitle) || 'Preview';
    modal.componentInstance.body = this.postBody;
  }

  doPost(): void {
    const html = toHTML(this.postBody!);
    if (this.type == 'comment') {
      this.svc
        .postComment({
          user_id: this.userID,
          post_id: this.postID!,
          content: html,
        })
        .pipe(
          catchError((err) => {
            throw err;
          })
        )
        .subscribe((res) => {
          this.submitData.emit(res);
          this.postBody = toDoc('');
        });
    } else {
      this.submitPost.emit(html);
      this.postBody = toDoc('');
    }
  }
}
