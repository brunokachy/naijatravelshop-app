import { Component } from '@angular/core';
import { User } from '../model/User';
import { Country } from '../model/Country';
import { Service } from '../provider/api.service';
import { ApiResponse } from '../model/ApiResponse';
import { InitModel } from '../model/InitModel';
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

    this.populateInitModel();
    console.log('url ' + window.location.origin);

    const interval = setInterval(() => {
      if (JSON.parse(sessionStorage.getItem('initModel')) != null) {
        this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
        this.countries = this.initModel.countries;
        this.countryCode = this.initModel.countryCode;
        clearInterval(interval);
      }
    }, 1000);

    setInterval(() => {
      this.checkUserLogin();
    }, 1000);
  }

  populateInitModel() {
    this.service.makeInitCall()
      .subscribe((data: ApiResponse<Country[]>) => {
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
      this.isLogin = false;
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
