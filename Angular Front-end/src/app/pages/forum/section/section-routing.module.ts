import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectionComponent } from './section.component';

const routes: Routes = [
  { path: '', component: SectionComponent },
  {
    path: 'sub/:hash',
    loadChildren: () =>
      import('./subsection/subsection.module').then((m) => m.SubsectionModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionRoutingModule {}
