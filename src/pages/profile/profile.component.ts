import { Component } from '@angular/core';
import { User } from '../../model/user';
import { AlertComponent } from 'ngx-bootstrap';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent {
    constructor(private localAPIService: LocalAPIService) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.isSuperAdmin = JSON.parse(sessionStorage.getItem('isSuperAdmin'));
        this.profileUser = this.user;
    }

    user: User;
    profileUser: User;
    isSuperAdmin = false;

    newPassword: string;
    oldPassword: string;

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

    updateProfile() {
        this.localAPIService.postRequest(this.profileUser, this.localAPIService.UPDATE_PROFILE).subscribe(
            data => {
                this.add('success', 'User accounted updated successfully.');
                this.user = data.data;
                this.profileUser = this.user;
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });
    }

    changePassword() {
        const requestData = { userId: this.profileUser.id, oldPassword: this.oldPassword, newPassword: this.newPassword };
        this.localAPIService.postRequest(requestData, this.localAPIService.CHANGE_PASSWORD).subscribe(
            data => {
                this.add('success', 'User password updated successfully.');
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });
    }
}
