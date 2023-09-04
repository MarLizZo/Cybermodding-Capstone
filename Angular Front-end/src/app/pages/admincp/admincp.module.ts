import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmincpRoutingModule } from './admincp-routing.module';
import { AdmincpComponent } from './admincp.component';


@NgModule({
  declarations: [
    AdmincpComponent
  ],
  imports: [
    CommonModule,
    AdmincpRoutingModule
  ]
})
export class AdmincpModule { }
