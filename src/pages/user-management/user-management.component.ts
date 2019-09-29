import { Component, ViewChild, TemplateRef } from '@angular/core';
import { AlertComponent, ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { User } from '../../model/user';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'user_management',
    templateUrl: 'user-management.component.html',
    styleUrls: ['user-management.component.scss']
})
export class UserManagementComponent {

    constructor(private modalService: BsModalService, private localAPIService: LocalAPIService) {
        this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperAdmin'));
        this.getPortalUsers();
        this.getAllRoles();
    }

    alerts: any[] = [];
    portalUsers: User[] = [];
    roleList: string[] = [];
    currentRoles: string[] = [];
    unSelectedRoles: string[] = [];
    isSuperAdmin = false;
    portalUser: User = new User();
    selectedUserEmail = '';

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    modalRoles: BsModalRef;

    openRolesModal(template: TemplateRef<any>) {
        this.modalRoles = this.modalService.show(template);
    }

    showModal(): void {
        this.isModalShown = true;
    }

    hideModal(): void {
        this.autoShownModal.hide();
    }

    onHidden(): void {
        this.isModalShown = false;
    }

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

    removeCurrentRole(role) {
        this.currentRoles = this.currentRoles.filter(e => e !== role);
        this.unSelectedRoles.push(role);
    }

    addCurrentRole(role) {
        this.currentRoles.push(role);
        this.unSelectedRoles = this.unSelectedRoles.filter(e => e !== role);
    }

    updateRoles() {
        const user: User = new User();
        user.email = this.selectedUserEmail;
        user.roles = this.currentRoles;
        this.localAPIService.postRequest(user, this.localAPIService.UPDATE_USER_ROLES).subscribe(
            data => {
                this.getPortalUsers();
                this.modalRoles.hide();
                this.add('success', data.message);
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });
    }

    getUserRoles(user: User, template: TemplateRef<any>) {
        this.currentRoles = [];
        this.unSelectedRoles = [];
        this.selectedUserEmail = user.email;

        for (const role of user.roles) {
            this.currentRoles.push(role);
        }

        for (const role of this.roleList) {
            this.unSelectedRoles.push(role);
        }

        this.unSelectedRoles = this.unSelectedRoles.filter(val => !this.currentRoles.includes(val));
        this.unSelectedRoles = this.unSelectedRoles.filter(e => e !== 'GUEST');
        this.unSelectedRoles = this.unSelectedRoles.filter(e => e !== 'SUPER ADMIN');
        this.currentRoles = this.currentRoles.filter(e => e !== 'PORTAL USER');

        this.openRolesModal(template);
    }

    getAllRoles() {
        this.localAPIService.postRequest({}, this.localAPIService.GET_ALL_ROLES).subscribe(
            data => {
                this.roleList = data.data;
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });
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

    createUser() {
        const roles: string[] = [];
        roles.push('PORTAL_USER');
        this.portalUser.roles = roles;
        this.portalUser.password = 'password';
        this.localAPIService.postRequest(this.portalUser, this.localAPIService.CREATE_ACCOUNT).subscribe(
            data => {
                this.add('success', 'User accounted created successfully.');
                this.getPortalUsers();
            },
            error => {
                console.log(error);
                this.add('danger', error.error.message);
            });
    }

}
