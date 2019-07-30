import { Component, ViewChild, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { AlertComponent, ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'reservation',
    templateUrl: 'reservation.component.html',
    styleUrls: ['reservation.component.scss']
})
export class ReservationComponent {

    constructor(private modalService: BsModalService, private localAPIService: LocalAPIService) {
        this.searchFlight();
        this.searchHotel();
        this.searchVisa();
        this.isSuperAdmin = JSON.parse(sessionStorage.getItem('isSuperAdmin'));
    }
    isSuperAdmin = false;

    startDateFlight: string;
    endDateFlight: string;
    bookingStatusFlight: string;
    bookingNumberFlight: string;

    startDateVisa: string;
    endDateVisa: string;
    bookingStatusVisa: string;

    startDateHotel: string;
    endDateHotel: string;
    bookingStatusHotel: string;
    bookingNumberHotel: string;

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    flightData: any[];
    flightBookingDetails: any;
    changeStatusField: string;
    visaData: any[];
    selectedVisaData: any;

    alerts: any[] = [];

    modalFlight: BsModalRef;
    modalVisa: BsModalRef;
    config = {
        animated: false,
    };

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

    openFlightModal(template: TemplateRef<any>) {
        this.modalFlight = this.modalService.show(template, this.config);
    }

    openVisaModal(template: TemplateRef<any>) {
        this.modalVisa = this.modalService.show(template, this.config);
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

    searchHotel() {

    }

    searchVisa() {
        let startD = '';
        let endD = '';

        if (this.startDateVisa !== undefined && this.endDateVisa === undefined) {
            alert('Please fill in the end date');
            return;
        }

        if (this.startDateVisa === undefined || this.startDateVisa === '') {

        } else {
            startD = this.formatDate(this.startDateVisa);
            endD = this.formatDate(this.endDateVisa);
        }

        if (this.bookingStatusVisa === 'ALL') {
            this.bookingStatusVisa = '';
        }

        const searchData = {
            startDate: startD, endDate: endD, bookingStatus: this.bookingStatusVisa
        };

        this.localAPIService.postRequest(searchData, this.localAPIService.GET_VISA_REQUEST_BY_SEARCH_TERM).subscribe(
            data => {
                this.visaData = data.data;
                this.startDateVisa = '';
                this.endDateVisa = '';
                this.bookingStatusVisa = '';
            },
            error => {
                console.log(error);
            });
    }

    searchFlight() {
        let startD = '';
        let endD = '';

        if (this.startDateFlight !== undefined && this.endDateFlight === undefined) {
            alert('Please fill in the end date');
            return;
        }

        if (this.startDateFlight === undefined || this.startDateFlight === '') {

        } else {
            startD = this.formatDate(this.startDateFlight);
            endD = this.formatDate(this.endDateFlight);
        }

        if (this.bookingStatusFlight === 'ALL') {
            this.bookingStatusFlight = '';
        }

        const searchData = {
            startDate: startD, endDate: endD, bookingStatus: this.bookingStatusFlight, bookingNo: this.bookingNumberFlight
        };

        this.localAPIService.postRequest(searchData, this.localAPIService.GET_FLIGHT_BOOKINGS_BY_SEARCH_TERM).subscribe(
            data => {
                this.flightData = data.data;
                this.startDateFlight = '';
                this.endDateFlight = '';
                this.bookingStatusFlight = '';
                this.bookingNumberFlight = '';
            },
            error => {
                console.log(error);
            });

    }

    getFlightReservationDetail(bookingNo, template: TemplateRef<any>) {
        const searchData = { bookingNo };
        this.localAPIService.postRequest(searchData, this.localAPIService.GET_FLIGHT_RESERVATION_DETAILS).subscribe(
            data => {
                this.flightBookingDetails = data.data;
                this.openFlightModal(template);
            },
            error => {
                this.add('danger', error.error.message);
                console.log(error);
            });
    }

    getVisaRequestDetail(bookingNo, template: TemplateRef<any>) {
        const visaDataLength = this.visaData.length;
        for (let i = 0; i < visaDataLength; i++) {
            if (this.visaData[i].id === bookingNo) {
                this.selectedVisaData = this.visaData[i];
                this.openVisaModal(template);
                break;
            }
        }
    }

    changeStatus(bookingStatus, bookingNo) {
        const searchData = { bookingStatus, bookingNo };

        this.localAPIService.postRequest(searchData, this.localAPIService.CHANGE_BOOKING_STATUS).subscribe(
            data => {
                const flightDataLength = this.flightData.length;
                for (let i = 0; i < flightDataLength; i++) {
                    if (this.flightData[i].bookingNumber === bookingNo) {
                        this.flightData[i].bookingStatus = bookingStatus;
                        break;
                    }
                }
                this.add('success', data.message);
            },
            error => {
                this.add('danger', error.error.message);
                console.log(error);
            });
    }

    changeVisaStatus(bookingStatus, bookingNo) {
        const searchData = { bookingStatus, bookingNo };

        this.localAPIService.postRequest(searchData, this.localAPIService.CHANGE_VISA_REQUEST_STATUS).subscribe(
            data => {
                const visaDataLength = this.visaData.length;
                for (let i = 0; i < visaDataLength; i++) {
                    if (this.visaData[i].id === bookingNo) {
                        this.visaData[i].bookingStatus = bookingStatus;
                        break;
                    }
                }
                this.add('success', data.message);
            },
            error => {
                this.add('danger', error.error.message);
                console.log(error);
            });
    }

    formatDate(date: string): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('DD/MM/YYYY');
        return d;
    }

}
