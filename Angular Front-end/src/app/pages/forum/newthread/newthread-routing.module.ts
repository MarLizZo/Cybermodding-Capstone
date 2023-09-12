import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewthreadComponent } from './newthread.component';

const routes: Routes = [{ path: '', component: NewthreadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewthreadRoutingModule { }
