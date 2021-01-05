import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ImgtopdfComponent } from './_helpers/imgtopdf/imgtopdf.component';
import { AuthGuard } from './_helpers';
import { EsourcingComponent } from './esourcing/esourcing.component';
import { RfqComponent } from './rfq/rfq.component';
import { RfqHeaderComponent } from './rfq/rfq-header/rfq-header.component';
import { RfqItemsComponent } from './rfq/rfq-items/rfq-items.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'esourcing', component: EsourcingComponent, canActivate: [AuthGuard] },
  { path: 'esourcing/rfq', component: RfqComponent, canActivate: [AuthGuard] },
  { path: 'esourcing/rfqheader', component: RfqHeaderComponent, canActivate: [AuthGuard] },
  { path: 'esourcing/rfqtender', component: RfqItemsComponent, canActivate: [AuthGuard] },
  { path: 'topdf', component: ImgtopdfComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
  // Here we load the module only when
  // the user access to login or register pages
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
