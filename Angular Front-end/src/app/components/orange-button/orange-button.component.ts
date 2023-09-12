import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orange-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orange-button.component.html',
  styleUrls: ['./orange-button.component.scss'],
})
export class OrangeButtonComponent {
  @Input() btnTitle!: string;
  @Input() btnTheme!: string;
}
