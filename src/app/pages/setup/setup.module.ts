import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReactiveFormsModule } from '@angular/forms';
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

// import { NgxEchartsModule } from 'ngx-echarts';
// import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { SetupComponent } from './setup.component';
//import { TentangListComponent } from './tentang-list/tentang-list.component';
//import { TentangRoutingModule } from './tentang-routing.module';

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
   // TentangRoutingModule,
    DataTablesModule,
    CKEditorModule,
    ReactiveFormsModule,
    NbBadgeModule,
    NbSpinnerModule,
  ],
  declarations: [
    SetupComponent,
   // TentangListComponent,
  ],
  providers: [
  //  CountryOrdersMapService,
  ],
})
export class SetupModule { }
