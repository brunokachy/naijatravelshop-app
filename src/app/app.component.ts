import { Component } from '@angular/core';
import { User } from '../model/User';
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

  constructor(private initService: InitAPIService) {
    this.initService.makeInitCall();

    setInterval(() => {
      this.checkUserLogin();
    }, 1000);
  }

  checkUserLogin() {
    if (JSON.parse(localStorage.getItem('user')) == null) {
      this.user = null;
      this.isLogin = false;
    }
    if (JSON.parse(localStorage.getItem('user')) != null) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.firstname = this.user.firstName;
      this.isLogin = true;
    }
  }

  signOut() {
    localStorage.removeItem('user');
    window.location.reload();
  }

}
