import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISubSectionData } from 'src/app/interfaces/isub-section-data';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subsection-body',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subsection-body.component.html',
  styleUrls: ['./subsection-body.component.scss'],
})
export class SubsectionBodyComponent {
  @Input() subSection!: ISubSectionData;
  @Input() margin!: boolean;
}
