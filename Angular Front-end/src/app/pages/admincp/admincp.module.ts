import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmincpRoutingModule } from './admincp-routing.module';
import { AdmincpComponent } from './admincp.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';

@NgModule({
  declarations: [AdmincpComponent],
  imports: [
    CommonModule,
    AdmincpRoutingModule,
    HeroComponent,
    FormsModule,
    OrangeButtonComponent,
    NgbCollapseModule,
    ModalComponent,
    InlineLoaderComponent,
  ],
})
export class AdmincpModule {}
