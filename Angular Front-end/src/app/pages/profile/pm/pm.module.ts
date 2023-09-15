import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmRoutingModule } from './pm-routing.module';
import { PmComponent } from './pm.component';


@NgModule({
  declarations: [
    PmComponent
  ],
  imports: [
    CommonModule,
    PmRoutingModule
  ]
})
export class PmModule { }
