import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModcpRoutingModule } from './modcp-routing.module';
import { ModcpComponent } from './modcp.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';

@NgModule({
  declarations: [ModcpComponent],
  imports: [
    CommonModule,
    ModcpRoutingModule,
    HeroComponent,
    FormsModule,
    NgbCollapseModule,
    OrangeButtonComponent,
  ],
})
export class ModcpModule {}
