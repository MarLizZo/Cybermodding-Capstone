import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmComponent } from './pm.component';

const routes: Routes = [
  { path: '', component: PmComponent },
  {
    path: 'newpm',
    loadChildren: () =>
      import('./newpm/newpm.module').then((m) => m.NewpmModule),
  },
  {
    path: 'newpm/:id',
    loadChildren: () =>
      import('./newpm/newpm.module').then((m) => m.NewpmModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmRoutingModule {}
