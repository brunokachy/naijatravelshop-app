import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { Service } from '../../provider/api.service';

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.scss']
})
export class RegisterComponent {

    constructor(private router: Router, private service: Service, private spinnerService: NgxSpinnerService) {

    }

    user = new User();
    cPassword = '';
    alerts: any[] = [];

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

    signup() {
        this.spinnerService.show();
        this.service.callAPII(this.user, this.service.CREATE_ACCOUNT).subscribe(
            data => {
                this.add('success', 'User accounted created successfully.');
                this.service.callAPII(this.user, this.service.LOGIN).subscribe(
                    data => {
                        this.spinnerService.hide();
                        //sessionStorage.setItem('user', JSON.stringify(data.data));
                        //this.router.navigate(['/dashboard']);
                        // window.location.reload();
                    },
                    error => {
                        console.log(error);
                        this.add('danger', error.error.message);
                        this.spinnerService.hide();
                    });
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
                this.spinnerService.hide();
            });
    }


}
