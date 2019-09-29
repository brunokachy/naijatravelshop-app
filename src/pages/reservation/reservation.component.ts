import { Component, ViewChild, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { AlertComponent, ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LocalAPIService } from '../../provider/local.api.service';
import { User } from '../../model/user';

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
        this.getSubscribedEmails();
        this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperAdmin'));
        this.isPortalUser = JSON.parse(localStorage.getItem('isPortalUser'));
        this.isGuest = JSON.parse(localStorage.getItem('isGuest'));
        this.user = JSON.parse(localStorage.getItem('user'));
    }
    isSuperAdmin = false;
    isPortalUser = false;
    isGuest = false;
    user = new User();

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

    flightData: any[] = [];
    flightBookingDetails: any;
    hotelBookingDetails: any;
    changeStatusField: string;
    visaData: any[] = [];
    selectedVisaData: any;
    hotelData: any[] = [];
    subscribedEmails: any[] = [];

    alerts: any[] = [];

    modalFlight: BsModalRef;
    modalVisa: BsModalRef;
    modalHotel: BsModalRef;
    // config = {
    //     animated: false,
    // };

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
        this.modalFlight = this.modalService.show(template);
    }

    openHotelModal(template: TemplateRef<any>) {
        this.modalHotel = this.modalService.show(template);
    }

    openVisaModal(template: TemplateRef<any>) {
        this.modalVisa = this.modalService.show(template);
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

    getSubscribedEmails() {
        this.subscribedEmails = [];
        this.localAPIService.postRequest({}, this.localAPIService.GET_SUBSCRIBED_EMAIL).subscribe(
            data => {
                this.subscribedEmails = data.data;
            },
            error => {
                console.log(error);
            });
    }

    searchHotel() {
        let startD = '';
        let endD = '';

        if (this.startDateHotel !== undefined && this.endDateHotel === undefined) {
            alert('Please fill in the end date');
            return;
        }

        if (this.startDateHotel === undefined || this.startDateHotel === '') {

        } else {
            startD = this.formatDate(this.startDateHotel);
            endD = this.formatDate(this.endDateHotel);
        }

        if (this.bookingStatusHotel === 'ALL') {
            this.bookingStatusHotel = '';
        }

        const searchData = {
            startDate: startD, endDate: endD, bookingStatus: this.bookingStatusHotel,
            bookingNo: this.bookingNumberHotel
        };
        this.hotelData = [];
        this.localAPIService.postRequest(searchData, this.localAPIService.GET_HOTEL_BOOKINGS_BY_SEARCH_TERM).subscribe(
            data => {
                if (this.isGuest) {
                    for (const hotel of data.data) {
                        if (hotel.ownerEmail === this.user.email) {
                            this.hotelData.push(hotel);
                        }
                    }
                } else {
                    this.hotelData = data.data;
                }
                this.startDateHotel = '';
                this.endDateHotel = '';
                this.bookingStatusHotel = '';
                this.bookingNumberHotel = '';
            },
            error => {
                console.log(error);
            });
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
        this.visaData = [];
        this.localAPIService.postRequest(searchData, this.localAPIService.GET_VISA_REQUEST_BY_SEARCH_TERM).subscribe(
            data => {
                if (this.isGuest) {
                    for (const visa of data.data) {
                        if (visa.email === this.user.email) {
                            this.visaData.push(visa);
                        }
                    }
                } else {
                    this.visaData = data.data;
                }
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
            startDate: startD, endDate: endD, bookingStatus: this.bookingStatusFlight,
            bookingNo: this.bookingNumberFlight
        };

        this.flightData = [];
        this.localAPIService.postRequest(searchData, this.localAPIService.GET_FLIGHT_BOOKINGS_BY_SEARCH_TERM).subscribe(
            data => {
                if (this.isGuest) {
                    for (const flight of data.data) {
                        if (flight.ownerEmail === this.user.email) {
                            this.flightData.push(flight);
                        }
                    }
                } else {
                    this.flightData = data.data;
                }
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

    getHotelReservationDetail(bookingNo, template: TemplateRef<any>) {
        const searchData = { bookingNo };
        this.localAPIService.postRequest(searchData, this.localAPIService.GET_HOTEL_RESERVATION_DETAILS).subscribe(
            data => {
                this.hotelBookingDetails = data.data;
                this.openHotelModal(template);
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

                const hotelDataLength = this.hotelData.length;
                for (let i = 0; i < hotelDataLength; i++) {
                    if (this.hotelData[i].bookingNumber === bookingNo) {
                        this.hotelData[i].bookingStatus = bookingStatus;
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

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result, 10);
    }

}
