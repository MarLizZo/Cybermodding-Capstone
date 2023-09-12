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

@Component({
  selector: 'app-ckeditor',
  standalone: true,
  imports: [CKEditorModule, FormsModule, OrangeButtonComponent],
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
})
export class CkeditorComponent {
  @Input() type: string | undefined;
  @Input() placeholderText!: string;
  @Input() quotedMsg!: IQuoteInfo | undefined;
  @Output() onSubmit = new EventEmitter();
  @ViewChild('editor') editorComponent!: CKEditorComponent;
  finalPlaceholderText: string = '';
  Editor = ClassicEditor;
  editorData: string = '';
  @Input() heightIn!: string;

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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quotedMsg'] && this.quotedMsg != undefined) {
      let changedMsg: IQuoteInfo = changes['quotedMsg'].currentValue;
      this.editorData = `<blockquote>
      <p class="mb-1">${changedMsg.username}:</p>
      <p>${changedMsg.content}</p>
      </blockquote><p></p>
      `;
    }
  }

  emitData(): void {
    this.onSubmit.emit(this.editorData);
    this.quotedMsg = undefined;
    this.editorData = '';
  }

  previewPost(): void {
    console.log('Preview', this.editorData);
  }
}
