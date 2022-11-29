import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ConsoleComponent } from './console/console.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    TopBarComponent,
    ConsoleComponent
  ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class AdminModule { }
