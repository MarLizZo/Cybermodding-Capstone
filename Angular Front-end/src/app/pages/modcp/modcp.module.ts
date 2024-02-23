import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModcpRoutingModule } from './modcp-routing.module';
import { ModcpComponent } from './modcp.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { UsersComponent } from 'src/app/components/cp/users/users.component';
import { BanComponent } from 'src/app/components/cp/ban/ban.component';
import { InfosComponent } from 'src/app/components/cp/infos/infos.component';
import { ThreadsComponent } from 'src/app/components/cp/threads/threads.component';

@NgModule({
  declarations: [ModcpComponent],
  imports: [
    CommonModule,
    ModcpRoutingModule,
    HeroComponent,
    FormsModule,
    NgbCollapseModule,
    OrangeButtonComponent,
    InlineLoaderComponent,
    UsersComponent,
    BanComponent,
    ThreadsComponent,
    InfosComponent,
  ],
})
export class ModcpModule {}
