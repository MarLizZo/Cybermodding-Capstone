import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewpmComponent } from './newpm.component';

const routes: Routes = [{ path: '', component: NewpmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewpmRoutingModule { }
