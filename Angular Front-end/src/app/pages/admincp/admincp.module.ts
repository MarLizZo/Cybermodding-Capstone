import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmincpRoutingModule } from './admincp-routing.module';
import { AdmincpComponent } from './admincp.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { BanComponent } from 'src/app/components/cp/ban/ban.component';
import { BlocksComponent } from 'src/app/components/cp/blocks/blocks.component';
import { ContactmsgsComponent } from 'src/app/components/cp/contactmsgs/contactmsgs.component';
import { InfosComponent } from 'src/app/components/cp/infos/infos.component';
import { SectionsComponent } from 'src/app/components/cp/sections/sections.component';
import { ThreadsComponent } from 'src/app/components/cp/threads/threads.component';
import { UsersComponent } from 'src/app/components/cp/users/users.component';

@NgModule({
  declarations: [AdmincpComponent],
  imports: [
    CommonModule,
    AdmincpRoutingModule,
    HeroComponent,
    FormsModule,
    OrangeButtonComponent,
    NgbCollapseModule,
    ModalComponent,
    InlineLoaderComponent,
    BanComponent,
    BlocksComponent,
    ContactmsgsComponent,
    InfosComponent,
    SectionsComponent,
    ThreadsComponent,
    UsersComponent,
  ],
})
export class AdmincpModule {}
