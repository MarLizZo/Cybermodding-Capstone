import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    LoaderComponent,
    InlineLoaderComponent,
  ],
})
export class LoginModule {}
