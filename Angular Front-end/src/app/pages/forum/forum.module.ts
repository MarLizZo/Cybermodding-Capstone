import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { ChatboxComponent } from 'src/app/components/chatbox/chatbox.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { SectionHeadComponent } from 'src/app/components/section-head/section-head.component';
import { SideblockComponent } from 'src/app/components/sideblock/sideblock.component';
import { ErrorModalComponent } from 'src/app/components/error-modal/error-modal.component';

@NgModule({
  declarations: [ForumComponent],
  imports: [
    CommonModule,
    ForumRoutingModule,
    HeroComponent,
    LoaderComponent,
    ChatboxComponent,
    TopbarComponent,
    SectionHeadComponent,
    SideblockComponent,
    ErrorModalComponent,
  ],
})
export class ForumModule {}
