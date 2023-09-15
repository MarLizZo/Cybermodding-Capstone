import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, HeroComponent],
})
export class ProfileModule {}
