import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';

@Component({
  selector: 'app-sideblock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sideblock.component.html',
  styleUrls: ['./sideblock.component.scss'],
})
export class SideblockComponent {
  @Input() sideBlockData!: ISideBlockData;

  ngOnInit() {
    //
  }
}
