import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    HeroComponent,
    FormsModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
    NgbCollapseModule,
    ErrorModalComponent,
    ModalComponent,
  ],
})
export class ProfileModule {}
