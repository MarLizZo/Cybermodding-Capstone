import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
  @ViewChild('bgContainer') bgContainer!: ElementRef<HTMLDivElement>;
  ngAfterViewInit() {
    this.bgContainer.nativeElement.style.backgroundSize = `${window.innerWidth}px 224px`;
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1200)
        this.bgContainer.nativeElement.style.backgroundSize = 'cover';
      else
        this.bgContainer.nativeElement.style.backgroundSize = `${window.innerWidth}px 224px`;
    });
  }
}
