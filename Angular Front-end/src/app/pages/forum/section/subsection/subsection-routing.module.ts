import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubsectionComponent } from './subsection.component';

const routes: Routes = [{ path: '', component: SubsectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubsectionRoutingModule {}
