import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbInputModule,
  NbListModule,
  NbAlertModule,
  NbBadgeModule,
  NbSpinnerModule,
} from '@nebular/theme';


import { ThemeModule } from '../../@theme/theme.module';
import { BpbComponent } from './bpb.component';
import { CommonModule } from '@angular/common';

 @NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbInputModule,
    NbSelectModule,
    NbListModule,
    NbProgressBarModule,
    NbAlertModule,
    DataTablesModule,
    CKEditorModule,
    ReactiveFormsModule,
    NbBadgeModule,
    NbSpinnerModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    BpbComponent,
   // TentangListComponent,
  ],
  providers: [
  //  CountryOrdersMapService,
  ],
})
export class BpbModule { }
