import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent } from './forum.component';

const routes: Routes = [
  { path: '', component: ForumComponent },
  {
    path: 'section/:title',
    loadChildren: () =>
      import('./section/section.module').then((m) => m.SectionModule),
  },
  {
    path: 'subsection/:hash',
    loadChildren: () =>
      import('./section/subsection/subsection.module').then(
        (m) => m.SubsectionModule
      ),
  },
  {
    path: 'showthread/:hash',
    loadChildren: () =>
      import('./section/subsection/showthread/showthread.module').then(
        (m) => m.ShowthreadModule
      ),
  },
  {
    path: 'newthread/:ssid',
    loadChildren: () =>
      import('./newthread/newthread.module').then((m) => m.NewthreadModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumRoutingModule {}
