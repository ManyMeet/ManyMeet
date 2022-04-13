import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon'

const modules: any = [MatButtonModule, MatIconModule, MatDialogModule ]



@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules]
})
export class MaterialDesignModule { }
