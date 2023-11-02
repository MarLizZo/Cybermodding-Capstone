import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewthreadRoutingModule } from './newthread-routing.module';
import { NewthreadComponent } from './newthread.component';
import { EditorFormComponent } from 'src/app/components/editor-form/editor-form.component';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';

@NgModule({
  declarations: [NewthreadComponent],
  imports: [
    CommonModule,
    NewthreadRoutingModule,
    EditorFormComponent,
    OrangeButtonComponent,
    InlineLoaderComponent,
    FormsModule,
    HeroComponent,
    TopbarComponent,
    NgbDropdownModule,
    ErrorModalComponent,
  ],
})
export class NewthreadModule {}
