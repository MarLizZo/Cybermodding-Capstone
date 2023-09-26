import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmRoutingModule } from './pm-routing.module';
import { PmComponent } from './pm.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { EditorFormComponent } from 'src/app/components/editor-form/editor-form.component';

@NgModule({
  declarations: [PmComponent],
  imports: [
    CommonModule,
    PmRoutingModule,
    HeroComponent,
    NgbCollapseModule,
    OrangeButtonComponent,
    EditorFormComponent,
  ],
})
export class PmModule {}
