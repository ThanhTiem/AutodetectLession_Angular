import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ClusterComponent } from './cluster/cluster.component';
import {BucketComponent} from './bucket/bucket.component'


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, data: {animation: 'dashboard'}},
  { path: 'cluster', component: ClusterComponent, data: {animation: 'cluster'} },
  { path: 'bucket', component: BucketComponent, data: {animation: 'bucket'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
