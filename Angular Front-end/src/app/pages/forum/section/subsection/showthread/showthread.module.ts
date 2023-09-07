import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowthreadRoutingModule } from './showthread-routing.module';
import { ShowthreadComponent } from './showthread.component';


@NgModule({
  declarations: [
    ShowthreadComponent
  ],
  imports: [
    CommonModule,
    ShowthreadRoutingModule
  ]
})
export class ShowthreadModule { }
