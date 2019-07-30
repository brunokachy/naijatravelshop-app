import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'login_register',
    templateUrl: 'login-register.component.html',
    styleUrls: ['login-register.component.scss']
})
export class LoginRegisterComponent {
    constructor(private router: Router, private localAPIService: LocalAPIService, private spinnerService: NgxSpinnerService) {

    }
    user = new User();
    newPassword: string;
    alerts: any[] = [];
    forgotPassword = false;

    add(type, message): void {
        this.alerts.push({
            type,
            msg: message,
            timeout: 5000
        });
    }

    onClosed(dismissedAlert: AlertComponent): void {
        this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    }

    resetPassword() {
        this.forgotPassword = true;
    }

    signin() {
        this.forgotPassword = false;
    }

    login() {
        this.spinnerService.show();

        if (this.forgotPassword) {
            this.localAPIService.postRequest(this.user, this.localAPIService.RESET_PASSWORD).subscribe(
                data => {
                    this.add('success', 'Check your email for your default password.');
                    this.user = new User();
                    this.spinnerService.hide();
                },
                error => {
                    console.log(error);
                    this.add('danger', error.error.message);
                    this.spinnerService.hide();
                });
        }

        if (!this.forgotPassword) {
            this.localAPIService.postRequest(this.user, this.localAPIService.LOGIN).subscribe(
                data => {
                    this.spinnerService.hide();
                    sessionStorage.setItem('user', JSON.stringify(data.data));

                    const user: User = JSON.parse(sessionStorage.getItem('user'));
                    if (user.roles.includes('SUPER ADMIN')) {
                        sessionStorage.setItem('isSuperAdmin', 'true');
                    } else {
                        sessionStorage.setItem('isSuperAdmin', 'false');
                    }
                    this.router.navigate(['/reservation']);

                    // window.location.reload();
                },
                error => {
                    console.log(error);
                    this.add('danger', error.error.message);
                    this.spinnerService.hide();
                });
        }

    }


}
