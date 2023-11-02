import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewpmRoutingModule } from './newpm-routing.module';
import { NewpmComponent } from './newpm.component';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { EditorFormComponent } from 'src/app/components/editor-form/editor-form.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';

@NgModule({
  declarations: [NewpmComponent],
  imports: [
    CommonModule,
    NewpmRoutingModule,
    HeroComponent,
    OrangeButtonComponent,
    EditorFormComponent,
    FormsModule,
    InlineLoaderComponent,
    ErrorModalComponent,
  ],
})
export class NewpmModule {}
