import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmincpComponent } from './admincp.component';

const routes: Routes = [{ path: '', component: AdmincpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmincpRoutingModule { }
