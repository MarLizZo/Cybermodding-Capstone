import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    LoaderComponent,
    HeroComponent,
  ],
})
export class HomepageModule {}
