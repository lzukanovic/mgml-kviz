import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ConsoleComponent } from './console/console.component';



@NgModule({
  declarations: [
    TopBarComponent,
    ConsoleComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdminModule { }
