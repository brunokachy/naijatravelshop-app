import { Component } from '@angular/core';
import { User } from '../model/User';
import { Country } from '../model/Country';
import { Service } from '../provider/api.service';
import { ApiResponse } from '../model/ApiResponse';
import { InitModel } from '../model/InitModel';
import { FlwAccountDetails } from '../model/FlwAccountDetail';
import { AfilliateDetails } from '../model/AffiliateDetails';
import { switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'naijatravelshop-app';
  user: User;
  isLogin = false;
  interval: any;
  firstname: string;
  countryCode: string;
  phoneNumber: string;
  countries: Country[] = [];
  initModel: InitModel = new InitModel();

  constructor(private service: Service, private spinner: NgxSpinnerService) {
    this.checkUserLogin();
    this.populateInitModel();
    console.log('url ' + window.location.origin);
  }

  populateInitModel() {
    this.service.makeInitCall()
      .subscribe((data: ApiResponse<Country[]>) => {
        this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
        this.countries = this.initModel.countries;
        this.countryCode = this.initModel.countryCode;
      }, (error: any) => {
        console.log(error);
      });
  }

  signOut() {
    sessionStorage.clear();
    this.user = null;
    this.isLogin = false;
    window.location.reload();
  }

  checkUserLogin() {
    if (JSON.parse(sessionStorage.getItem('user')) == null) {
      this.user = null;
    }
    if (JSON.parse(sessionStorage.getItem('user')) != null) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.firstname = this.user.firstName;
      this.isLogin = true;
    }
  }

  home() {
    window.location.reload();
  }

}
