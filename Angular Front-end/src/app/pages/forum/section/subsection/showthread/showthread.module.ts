import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowthreadRoutingModule } from './showthread-routing.module';
import { ShowthreadComponent } from './showthread.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  declarations: [ShowthreadComponent],
  imports: [
    CommonModule,
    ShowthreadRoutingModule,
    HeroComponent,
    OrangeButtonComponent,
    TopbarComponent,
    LoaderComponent,
  ],
})
export class ShowthreadModule {}
