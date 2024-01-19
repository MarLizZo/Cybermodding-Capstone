import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { OrangeButtonComponent } from '../../components/orange-button/orange-button.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    HeroComponent,
    OrangeButtonComponent,
    NgbCollapseModule,
  ],
})
export class SearchModule {}
