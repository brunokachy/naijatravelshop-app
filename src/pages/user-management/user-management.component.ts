import { Component } from '@angular/core';
import { AlertComponent } from 'ngx-bootstrap';
import { User } from '../../model/user';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'user_management',
    templateUrl: 'user-management.component.html',
    styleUrls: ['user-management.component.scss']
})
export class UserManagementComponent {

    constructor(private localAPIService: LocalAPIService) {
        this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperAdmin'));
        this.getPortalUsers();
    }

    alerts: any[] = [];
    portalUsers: User[] = [];
    isSuperAdmin = false;

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

    getPortalUsers() {
        this.localAPIService.getRequest(this.localAPIService.GET_PORTAL_USERS).subscribe(
            data => {
                this.portalUsers = data.data;
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });
    }

    activateUser(id) {
        const requestData = { id };
        this.localAPIService.postRequest(requestData, this.localAPIService.ACTIVATE_USER).subscribe(
            data => {
                this.add('success', data.message);
                const portalUserDataLength = this.portalUsers.length;
                for (let i = 0; i < portalUserDataLength; i++) {
                    if (this.portalUsers[i].id === id) {
                        this.portalUsers[i].active = true;
                    }
                }
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });

    }
    deactivateUser(id) {
        const requestData = { id };
        this.localAPIService.postRequest(requestData, this.localAPIService.DEACTIVATE_USER).subscribe(
            data => {
                this.add('success', data.message);
                const portalUserDataLength = this.portalUsers.length;
                for (let i = 0; i < portalUserDataLength; i++) {
                    if (this.portalUsers[i].id === id) {
                        this.portalUsers[i].active = false;
                    }
                }
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });

    }

}
