import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

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
  ],
})
export class ProfileModule {}
