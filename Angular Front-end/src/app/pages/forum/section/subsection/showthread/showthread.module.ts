import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowthreadRoutingModule } from './showthread-routing.module';
import { ShowthreadComponent } from './showthread.component';
import { HeroComponent } from 'src/app/components/hero/hero.component';
import { OrangeButtonComponent } from 'src/app/components/orange-button/orange-button.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { CommentComponent } from 'src/app/components/comment/comment.component';
import { ThreadUserDetailsComponent } from 'src/app/components/thread-user-details/thread-user-details.component';
import { BtnReplyComponent } from 'src/app/components/btn-reply/btn-reply.component';
import { EditorFormComponent } from 'src/app/components/editor-form/editor-form.component';

@NgModule({
  declarations: [ShowthreadComponent],
  imports: [
    CommonModule,
    ShowthreadRoutingModule,
    HeroComponent,
    OrangeButtonComponent,
    TopbarComponent,
    LoaderComponent,
    CommentComponent,
    ThreadUserDetailsComponent,
    BtnReplyComponent,
    EditorFormComponent,
  ],
})
export class ShowthreadModule {}
