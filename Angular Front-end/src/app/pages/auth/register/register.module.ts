import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { InlineLoaderComponent } from 'src/app/components/inline-loader/inline-loader.component';
import { LoaderComponent } from 'src/app/components/loader/loader.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    LoaderComponent,
    InlineLoaderComponent,
  ],
})
export class RegisterModule {}
