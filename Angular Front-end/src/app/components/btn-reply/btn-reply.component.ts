import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-reply',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-reply.component.html',
  styleUrls: ['./btn-reply.component.scss'],
})
export class BtnReplyComponent {
  @Input() text!: string;
  arrowTxt: string = '&nbsp;&nbsp;<i class="bi bi-arrow-bar-right"></i>';

  @Output() emitter = new EventEmitter();

  onBtnClick(): void {
    this.emitter.emit();
  }
}
