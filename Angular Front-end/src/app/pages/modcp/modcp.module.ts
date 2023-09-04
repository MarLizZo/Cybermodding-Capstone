import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModcpRoutingModule } from './modcp-routing.module';
import { ModcpComponent } from './modcp.component';


@NgModule({
  declarations: [
    ModcpComponent
  ],
  imports: [
    CommonModule,
    ModcpRoutingModule
  ]
})
export class ModcpModule { }
