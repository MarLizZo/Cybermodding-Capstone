import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowthreadComponent } from './showthread.component';

const routes: Routes = [{ path: '', component: ShowthreadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowthreadRoutingModule { }
