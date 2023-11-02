import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { EditorFormComponent } from 'src/app/components/editor-form/editor-form.component';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';

@NgModule({
  declarations: [ContactsComponent],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    FormsModule,
    HeroComponent,
    EditorFormComponent,
    ErrorModalComponent,
  ],
})
export class ContactsModule {}
