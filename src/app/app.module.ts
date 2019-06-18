import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Service } from '../provider/api.service';
import { HomeComponent } from '../pages/home/home.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlightSearchResultComponent } from '../pages/flight-search-result/flight-search-result.component';
import { AuthGuard } from '../provider/router.service';
import { FlightDetailComponent } from '../pages/flight-detail/flight-detail.component';
import { FlightPaymentComponent } from '../pages/flight-payment/flight-payment.component';
import { PaymentResponseComponent } from '../pages/payment-response/payment-response.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RatingModule, CarouselModule, AlertModule } from 'ngx-bootstrap';
import { AboutComponent } from '../pages/about/about.component';
import { ContactusComponent } from '../pages/contactus/contactus.component';
import { LoginRegisterComponent } from '../pages/login-register/login-register.component';
import { RegisterComponent } from '../pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FlightSearchResultComponent,
    FlightDetailComponent,
    FlightPaymentComponent,
    PaymentResponseComponent,
    AboutComponent,
    ContactusComponent,
    LoginRegisterComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    AlertModule.forRoot(),
  ],
  providers: [Service, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
