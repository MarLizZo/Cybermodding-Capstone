import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/homepage/homepage.module').then((m) => m.HomepageModule),
  },
  {
    path: 'forum',
    loadChildren: () =>
      import('./pages/forum/forum.module').then((m) => m.ForumModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admincp/admincp.module').then((m) => m.AdmincpModule),
  },
  {
    path: 'moderator',
    loadChildren: () =>
      import('./pages/modcp/modcp.module').then((m) => m.ModcpModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./pages/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'users/:hash',
    loadChildren: () =>
      import('./pages/users/users.module').then((m) => m.UsersModule),
  },
  { path: 'contacts', loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
