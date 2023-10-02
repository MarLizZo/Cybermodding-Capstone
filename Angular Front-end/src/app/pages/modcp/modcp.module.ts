import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModcpRoutingModule } from './modcp-routing.module';
import { ModcpComponent } from './modcp.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';

@NgModule({
  declarations: [ModcpComponent],
  imports: [
    CommonModule,
    ModcpRoutingModule,
    HeroComponent,
    FormsModule,
    NgbCollapseModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
  ],
})
export class ModcpModule {}
