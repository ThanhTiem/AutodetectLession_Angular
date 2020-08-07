import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
// import { TenantIoComponent } from './tenant/tenant-io/tenant-io.component';
// import { TenantComponent } from './tenant/tenant.component';
import { ClusterComponent } from './cluster/cluster.component';
// import { TenantDetailComponent } from './tenant/tenant-detail/tenant-detail.component';
import { ObjectComponent } from './object/object.component';
import { ServiceListComponent } from './service-list/service-list.component';
import {ClusterIoComponent} from './cluster/cluster-io/cluster-io.component';
import {ClusterServiceComponent} from './cluster/cluster-detail/cluster-service.component';
import {BucketComponent} from './bucket/bucket.component';
import {BucketIoComponent} from './bucket/bucket-io/bucket-io.component';
import {ObjectDetailComponent} from './object/object-detail/object-detail.component';
import {ObjectSearchComponent} from './object/object-search/object-search.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, data: {animation: 'dashboard'}},
  // { path: 'storage/create', component: TenantIoComponent, data: {animation: 'createtenant'} },
  // { path: 'storage', component: TenantComponent, data: {animation: 'tenant'} },
  { path: 'cluster', component: ClusterComponent, data: {animation: 'cluster'} },
  { path: 'cluster/clusterio', component: ClusterIoComponent, data: {animation: 'createcluster'}  },
  // { path: 'storage/detail', component: TenantDetailComponent, data: {animation: 'tenantdetail'} },
  { path: 'storage/object', component: ObjectComponent, data: {animation: 'object'} },
  { path: 'service/list', component: ServiceListComponent, data: {animation: 'service-list'} },
  { path: 'cluster/detail', component: ClusterServiceComponent, data: {animation: 'clusterdetail'} },
  // { path: 'storage/bucket/detail', component: BucketComponent},
  // { path: 'storage/bucket/create', component: BucketIoComponent, data: {animation: 'bucket-io'} },
  // { path: 'storage/object/detail', component: ObjectDetailComponent, data: {animation: 'objectdetail'} },
  // { path: 'storage/object/search', component: ObjectSearchComponent, data: {animation: 'objectsearch'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
