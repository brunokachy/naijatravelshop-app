import { Component } from '@angular/core';
import { User } from '../model/User';
import { Country } from '../model/Country';
import { InitModel } from '../model/InitModel';
import { InitAPIService } from '../provider/init.api.service';

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
  phoneNumber: string;
  initModel: InitModel = new InitModel();

  constructor(private initService: InitAPIService) {

    this.initService.makeInitCall();

    const interval = setInterval(() => {
      if (JSON.parse(sessionStorage.getItem('initModel')) != null) {
        this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
        clearInterval(interval);
      }
    }, 1000);

    setInterval(() => {
      this.checkUserLogin();
    }, 1000);
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

  signOut() {
    sessionStorage.removeItem('user');
    window.location.reload();
  }

}
