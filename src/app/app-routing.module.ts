import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { FlightSearchResultComponent } from '../pages/flight-search-result/flight-search-result.component';
import { AuthGuard } from '../provider/router.service';
import { FlightDetailComponent } from '../pages/flight-detail/flight-detail.component';
import { FlightPaymentComponent } from '../pages/flight-payment/flight-payment.component';
import { PaymentResponseComponent } from '../pages/payment-response/payment-response.component';
import { AboutComponent } from '../pages/about/about.component';
import { ContactusComponent } from '../pages/contactus/contactus.component';
import { LoginRegisterComponent } from '../pages/login-register/login-register.component';
import { RegisterComponent } from '../pages/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'flight_search_result', component: FlightSearchResultComponent, canActivate: [AuthGuard] },
  { path: 'flight_detail', component: FlightDetailComponent, canActivate: [AuthGuard] },
  { path: 'flight_payment', component: FlightPaymentComponent, canActivate: [AuthGuard] },
  { path: 'payment_response', component: PaymentResponseComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent},
  { path: 'contactus', component: ContactusComponent},
  { path: 'login_register', component: LoginRegisterComponent},
  { path: 'register', component: RegisterComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
