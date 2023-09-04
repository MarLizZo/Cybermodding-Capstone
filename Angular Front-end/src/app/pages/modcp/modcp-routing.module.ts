import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModcpComponent } from './modcp.component';

const routes: Routes = [{ path: '', component: ModcpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModcpRoutingModule { }
