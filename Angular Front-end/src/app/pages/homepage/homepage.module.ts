import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { SideblockComponent } from 'src/app/components/sideblock/sideblock.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    LoaderComponent,
    HeroComponent,
    SideblockComponent,
    NgbDropdownModule,
    OrangeButtonComponent,
    ErrorModalComponent,
  ],
})
export class HomepageModule {}
