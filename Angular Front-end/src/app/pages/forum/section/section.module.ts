import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionRoutingModule } from './section-routing.module';
import { SectionComponent } from './section.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { SubsectionBodyComponent } from 'src/app/components/subsection-body/subsection-body.component';

@NgModule({
  declarations: [SectionComponent],
  imports: [
    CommonModule,
    SectionRoutingModule,
    HeroComponent,
    TopbarComponent,
    SubsectionBodyComponent,
  ],
})
export class SectionModule {}
