import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubsectionRoutingModule } from './subsection-routing.module';
import { SubsectionComponent } from './subsection.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';

@NgModule({
  declarations: [SubsectionComponent],
  imports: [
    CommonModule,
    SubsectionRoutingModule,
    HeroComponent,
    TopbarComponent,
    OrangeButtonComponent,
  ],
})
export class SubsectionModule {}
