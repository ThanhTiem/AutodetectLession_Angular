import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { TenantComponent } from './tenant/tenant.component';
// import { TenantListComponent } from './tenant/tenant-list/tenant-list.component';
// import { TenantIoComponent } from './tenant/tenant-io/tenant-io.component';
import { ClusterComponent } from './cluster/cluster.component';
// import { TenantDetailComponent } from './tenant/tenant-detail/tenant-detail.component';
// import { ObjectComponent } from './object/object.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { FilterServicePipe } from './shared/pipes/filter-service.pipe';
import {CommonService} from './core/services/common';
import { BucketComponent } from './bucket/bucket.component';
// import { BucketIoComponent } from './bucket/bucket-io/bucket-io.component';
// import { ObjectDetailComponent } from './object/object-detail/object-detail.component';
// import { ObjectSearchComponent } from './object/object-search/object-search.component';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
  declarations: [
    AppComponent,
    ClusterComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    FilterServicePipe,
    BucketComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularCropperjsModule,
    NgbModule,
    DataTablesModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      enableHtml: true,
      }),
    NgxLoadingModule.forRoot({
        animationType: ngxLoadingAnimationTypes.wanderingCubes,
        backdropBackgroundColour: 'rgba(0,0,0,0.1)',
        backdropBorderRadius: '4px',
        primaryColour: '#ffffff',
        secondaryColour: '#ffffff',
        tertiaryColour: '#ffffff'
      }),
    NgxPaginationModule,
    HighchartsChartModule,
    LoadingBarHttpClientModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
