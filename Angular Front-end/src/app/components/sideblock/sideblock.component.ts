import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISideBlockData } from 'src/app/interfaces/iside-block-data';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sideblock',
  standalone: true,
  imports: [CommonModule, NgbCollapseModule],
  templateUrl: './sideblock.component.html',
  styleUrls: ['./sideblock.component.scss'],
})
export class SideblockComponent {
  @Input() sideBlockData!: ISideBlockData;
  isCollapsed: boolean = false;

  @Input() collapseDefault!: boolean;

  ngOnInit() {
    if (this.collapseDefault) this.isCollapsed = true;
  }
}
