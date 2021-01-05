import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from './_modal';
/**
 * Here we don't need to import the AuthModule directly
 * from app.module.ts but rather let the app-routing.module.ts
 * do the job by lazy loading the module
 */
// import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { FileSaverModule } from 'ngx-filesaver';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home/home.component';
import { RfqItemsComponent } from './rfq/rfq-items/rfq-items.component';
import { RfqItemDetailComponent } from './rfq/rfq-item-detail/rfq-item-detail.component';
import { RfqHeaderComponent } from './rfq/rfq-header/rfq-header.component';
import { ImgtopdfComponent } from './_helpers/imgtopdf/imgtopdf.component';
import { EsourcingComponent } from './esourcing/esourcing.component';;
import { RfqComponent } from './rfq/rfq.component'
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RfqHeaderComponent,
    RfqItemDetailComponent,
    RfqItemsComponent
,
    ImgtopdfComponent ,
    EsourcingComponent ,
    RfqComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ModalModule,
    FileSaverModule
    // AuthModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
