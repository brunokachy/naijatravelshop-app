import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Service } from '../provider/api.service';
import { LocalAPIService } from '../provider/local.api.service';
import { TravelbetaAPIService } from '../provider/travelbeta.api.service';
import { InitAPIService } from '../provider/init.api.service';
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
import { ProfileComponent } from '../pages/profile/profile.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { UserManagementComponent } from '../pages/user-management/user-management.component';
import { ReservationComponent } from '../pages/reservation/reservation.component';
import { HotelSearchResultComponent } from '../pages/hotel-search-result/hotel-search-result.component';
import { HotelDetailsComponent } from '../pages/hotel-details/hotel-details.component';
import { HotelRoomsComponent } from '../pages/hotel-rooms/hotel-rooms.component';
import { AgmCoreModule } from '@agm/core';
import { SettingsComponent } from '../pages/settings/settings.component';

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
    RegisterComponent,
    ProfileComponent,
    DashboardComponent,
    UserManagementComponent,
    ReservationComponent,
    HotelSearchResultComponent,
    HotelDetailsComponent,
    HotelRoomsComponent,
    SettingsComponent
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
    DataTableModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDQUHkQkHQOd0MDdr_F0C5IFWPeB2CexpA'
    })
  ],
  providers: [Service, AuthGuard, TravelbetaAPIService, LocalAPIService, InitAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
