import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PopupComponent} from './popup.component'
import {FlexModule} from '@angular/flex-layout'
import {MatDialogModule} from '@angular/material/dialog'
import {MatCardModule} from '@angular/material/card'
import {MatButtonModule} from '@angular/material/button'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FlexModule,
        ReactiveFormsModule,
    ],
  declarations: [PopupComponent],
  exports: [PopupComponent],
  entryComponents: [PopupComponent]
})
export class PopupModule { }
