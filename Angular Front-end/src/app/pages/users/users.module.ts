import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import {
  NgbCollapseModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CommunityMemberComponent } from 'src/app/components/community-member/community-member.component';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    HeroComponent,
    NgbDropdownModule,
    CommunityMemberComponent,
    NgbCollapseModule,
    OrangeButtonComponent,
  ],
})
export class UsersModule {}
