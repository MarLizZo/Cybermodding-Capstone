import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { OrangeButtonComponent } from '../orange-button/orange-button.component';
import { IQuoteInfo } from 'src/app/interfaces/iquote-info';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ckeditor',
  standalone: true,
  imports: [
    CKEditorModule,
    FormsModule,
    OrangeButtonComponent,
    ModalComponent,
    CommonModule,
  ],
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
})
export class CkeditorComponent {
  @Input() type: string | undefined;
  @Input() placeholderText!: string;
  @Input() quotedMsg!: IQuoteInfo | undefined;
  @Input() heightIn!: string;
  @Input() threadTitle!: string | undefined;
  @Input() postBody!: string | undefined;
  @Output() onSubmit = new EventEmitter();
  @ViewChild('editor') editorComponent!: CKEditorComponent;
  btnString: string = '';
  finalPlaceholderText: string = '';
  Editor = ClassicEditor;
  editorData: string = '';
  hasReceivedQuote: boolean = false;
  hasReceivedBody: boolean = false;

  constructor(private modalSvc: NgbModal) {}

  public config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'indent',
      'outdent',
      '|',
      'bold',
      'italic',
      '|',
      'mediaEmbed',
      'link',
      '|',
      'numberedList',
      'bulletedList',
      'blockQuote',
    ],
    placeholder: 'Scrivi qui..',
  };

  ngOnInit() {
    if (this.placeholderText) this.config.placeholder = this.placeholderText;
    if (this.postBody) this.editorData = this.postBody;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['quotedMsg'] &&
      this.quotedMsg != undefined &&
      !this.hasReceivedQuote
    ) {
      let changedMsg: IQuoteInfo = changes['quotedMsg'].currentValue;
      this.editorData = `<blockquote><p class="mb-1">${changedMsg.username}:</p><p class="mb-1">${changedMsg.content}</p></blockquote><p class="mb-1"></p>`;
      this.hasReceivedQuote = true;
    }

    if (changes['threadTitle']) {
      this.threadTitle = changes['threadTitle'].currentValue;
    }

    if (
      changes['postBody'] &&
      this.postBody != undefined &&
      !this.hasReceivedBody
    ) {
      this.editorData = changes['postBody'].currentValue;
      this.hasReceivedBody = true;
    }
  }

  getButtonString(): string {
    switch (this.type) {
      case 'newpm':
        return 'Invia';
      case 'comment':
        return 'Rispondi';
      case 'post':
        return 'Posta Thread';
      case 'editpost':
        return 'Modifica Post';
      default:
        return 'Posta Thread';
    }
  }

  emitData(): void {
    this.onSubmit.emit(this.editorData);
    this.quotedMsg = undefined;
    if (this.type == 'comment') {
      this.editorData = '';
    }
  }

  previewPost(): void {
    const modal = this.modalSvc.open(ModalComponent, {
      size: 'xl',
      scrollable: true,
    });
    modal.componentInstance.title =
      (this.threadTitle != '' && this.threadTitle) || 'Preview';
    modal.componentInstance.body = this.editorData;
  }
}
