import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContactMessageBody } from 'src/app/interfaces/icontact-message-body';
import { OrangeButtonComponent } from '../../orange-button/orange-button.component';
import { ModerationService } from 'src/app/services/moderation.service';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-contactmsgs',
  standalone: true,
  imports: [CommonModule, OrangeButtonComponent],
  templateUrl: './contactmsgs.component.html',
  styleUrls: ['./contactmsgs.component.scss'],
})
export class ContactmsgsComponent {
  constructor(private svc: ModerationService) {}

  @Input() messages!: IContactMessageBody[];
  previousMessagesLength: number = 0;
  @Output() onArchive = new EventEmitter();
  @Output() onReOpen = new EventEmitter();
  areMessagesOpen: boolean = false;
  areMessagesClosed: boolean = false;
  @Input() error: string | undefined = undefined;

  singleMsg: IContactMessageBody | undefined;
  isSingleMsgView: boolean = false;

  ngOnInit() {
    this.setMessagesType();
  }

  ngDoCheck() {
    if (this.messages.length != this.previousMessagesLength) {
      this.previousMessagesLength = this.messages.length;
      this.setMessagesType();
      this.resetSingleView();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      this.messages = changes['messages'].currentValue;
      this.setMessagesType();
      this.resetSingleView();
    }
    if (changes['error']) {
      this.error = changes['error'].currentValue;
    }
  }

  ngOnDestroy() {
    //
  }

  setMessagesType() {
    if (this.messages && this.messages.length) {
      this.areMessagesOpen = this.messages.every((el) => !el.closed);
      this.areMessagesClosed = !this.areMessagesOpen;
    }
  }

  showMsg(index: number) {
    this.singleMsg = this.messages[index];
    this.isSingleMsgView = true;
  }

  resetSingleView() {
    this.isSingleMsgView = false;
    this.singleMsg = undefined;
  }

  getMsgUsername(): string {
    const name =
      this.singleMsg?.name != ''
        ? this.singleMsg?.name
        : this.singleMsg?.fromUser!.username;
    return name || '';
  }

  archiveMessage() {
    this.onArchive.emit(this.singleMsg!.id);
  }

  reOpenMessage() {
    this.onReOpen.emit(this.singleMsg!.id);
  }
}
