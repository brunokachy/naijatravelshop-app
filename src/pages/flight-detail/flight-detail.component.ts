import { Component, TemplateRef, ViewChild } from '@angular/core';
import { PricedItineraries } from '../../model/pricedItineraries';
import { Router } from '@angular/router';
import { OriginDestinationOptions } from '../../model/originDestinationOptions';
import * as moment from 'moment';
import { User } from '../../model/user';
import { Passenger } from '../../model/passenger';
import { FlightDataSearch } from '../../model/FlightDataSearch';
import { Country } from '../../model/country';
import { BsModalRef, BsModalService, ModalDirective, AlertComponent } from 'ngx-bootstrap';
import { BookingResponse } from '../../model/bookingResponse';
import { ReservationOwner } from '../../model/reservationowner';
import { Booking } from '../../model/booking';
import { NgxSpinnerService } from 'ngx-spinner';
import { TravelbetaAPIService } from '../../provider/travelbeta.api.service';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'flight_detail',
    templateUrl: 'flight-detail.component.html',
    styleUrls: ['flight-detail.component.scss']
})
export class FlightDetailComponent {
    constructor(private modalService: BsModalService, private router: Router, private travelbetaAPIService: TravelbetaAPIService,
        private spinnerService: NgxSpinnerService, private localAPIService: LocalAPIService) {
        this.pricedItinerary = JSON.parse(sessionStorage.getItem('pricedItineraries'));
        this.flightSearch = JSON.parse(sessionStorage.getItem('flightSearch'));
        this.flightHeader = JSON.parse(sessionStorage.getItem('flightHeader'));

        this.getCountries();
        this.populateFlightDetails();
        this.createTravellerDetail();
        this.formatPassengerBday();
    }
    pricedItinerary: PricedItineraries;
    flightSearch: FlightDataSearch;
    flightHeader: any;
    originDestinationOptions: OriginDestinationOptions[] = [];
    modalRef: BsModalRef;
    config = {
        animated: false,
    };

    user = new User();
    contactDetail: User = new User();
    countries: Country[] = [];
    contactPhoneNumber: string;
    passengers: Passenger[] = [];
    maxAdultBday: Date;
    maxChildBday: Date;
    minChildBday: Date;
    maxInfantBday: Date;
    minInfantBday: Date;
    login = false;
    email: string;
    password: string;
    shouldRegister = false;
    alertMessage: string;
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

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    getCountries() {
        this.countries = JSON.parse(localStorage.getItem('countries'));
        // this.checkProfile();
    }

    populateFlightDetails() {
        for (const u of this.pricedItinerary.originDestinationOptions) {
            this.originDestinationOptions.push(u);
        }
    }

    formatDate(date: string) {
        const d = moment(date, 'dd/MM/YYYY HH:mm').format('HH:mm');
        return d;
    }

    formatStops(stops: number) {
        if (stops === 0) {
            return 'Non-stop';
        }
        if (stops === 1) {
            return '1 stop';
        }
        if (stops > 1) {
            return '2+ stops';
        }
    }

    formatTime(originDestinationOptions: OriginDestinationOptions[]) {
        let h = 0;
        let m = 0;
        for (const o of originDestinationOptions) {
            for (const ff of o.flightSegments) {
                h = h + parseInt(moment(ff.journeyDuration, 'HH:mm').format('H'), 10);
                m = m + parseInt(moment(ff.journeyDuration, 'HH:mm').format('mm'), 10);
            }
        }

        h = h + m / 60 | 0;
        const mins = m % 60 | 0;
        let hString = h + ' hour';
        let mString = mins + ' min';
        if (h > 1) {
            hString = h + ' hours';
        }

        if (mins > 1) {
            mString = mins + ' mins';
        }
        const duration = hString + ', ' + mString;
        return duration;
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2);
        return parseInt(result, 10);
    }

    formatTime2(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('HH:mm');
        return d;
    }

    formatDate2(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('DD MMM YY');
        return d;
    }

    calculateLayoverTime(arrivalTime: string, departureTime: string) {
        const a = moment(arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
        const b = moment(departureTime, 'DD/MM/YYYY HH:mm').valueOf();
        const c: number = b - a;
        const tempTime = moment.duration(c);
        return tempTime.hours() + 'h ' + tempTime.minutes() + 'm';
    }

    formatDuration(departureTime: string, arrivalTime: string) {
        const a = moment(arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
        const b = moment(departureTime, 'DD/MM/YYYY HH:mm').valueOf();
        const c: number = a - b;
        const tempTime = moment.duration(c);
        return tempTime.hours() + 'h ' + tempTime.minutes() + 'm';
    }

    formatDate3(date): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('DD/MM/YYYY');
        return d;
    }

    onPassengerBirthdayChange(e, i) {
        this.passengers[i].dateOfBirth = this.formatDate3(e);
    }

    formatSegmentDuration(o: OriginDestinationOptions) {
        let h = 0;
        let m = 0;
        let index = 1;
        for (const oo of o.flightSegments) {
            const hh = moment(oo.journeyDuration, 'HH:mm').format('HH');
            const mm = moment(oo.journeyDuration, 'HH:mm').format('mm');

            if (o.flightSegments[index] != null) {
                const a = moment(oo.arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
                const b = moment(o.flightSegments[index].departureTime, 'DD/MM/YYYY HH:mm').valueOf();
                const c: number = b - a;
                const tempTime = moment.duration(c);
                h = h + tempTime.hours();
                m = m + tempTime.minutes();
            }
            h = h + parseInt(hh, 10);
            m = m + parseInt(mm, 10);
            index++;
        }
        if (m >= 60) {
            h = h + 1;
            m = m - 60;
        }
        const hString = h + 'h';
        const mString = m + 'm';
        const duration = hString + ' ' + mString;
        return duration;

    }

    // checkProfile() {
    //     if (JSON.parse(sessionStorage.getItem('user')) != null) {
    //         this.contactDetail = JSON.parse(sessionStorage.getItem('user'));
    //         this.contactDetail.city = this.contactDetail.cityName;
    //         this.contactPhoneNumber = this.contactDetail.phoneNumber;
    //         this.getTitlename(this.contactDetail.title);
    //         this.login = true;
    //     } else {
    //         this.contactDetail.firstName = '';
    //         this.contactDetail.lastName = '';
    //         this.contactDetail.dateOfBirth = '';
    //         this.contactDetail.email = '';
    //         this.contactDetail.firstName = '';
    //         this.contactPhoneNumber = '';
    //         this.contactDetail.address = '';
    //         this.contactDetail.cityName = '';
    //         this.contactDetail.countryName = 'NIGERIA';
    //     }
    // }

    createTravellerDetail() {
        for (let index = 1; index < (this.flightSearch.travellerDetail.adults + 1); index++) {
            const p = new Passenger();
            p.dateOfBirth = '';
            p.passportExpiryDate = '';
            p.passportIssuingCountryCode = '';
            p.passportNumber = '';
            p.ageGroup = 3;
            this.passengers.push(p);
        }

        for (let index = 1; index < (this.flightSearch.travellerDetail.children + 1); index++) {
            const p = new Passenger();
            p.dateOfBirth = '';
            p.passportExpiryDate = '';
            p.passportIssuingCountryCode = '';
            p.passportNumber = '';
            p.ageGroup = 2;
            this.passengers.push(p);
        }

        for (let index = 1; index < (this.flightSearch.travellerDetail.infants + 1); index++) {
            const p = new Passenger();
            p.dateOfBirth = '';
            p.passportExpiryDate = '';
            p.passportIssuingCountryCode = '';
            p.passportNumber = '';
            p.ageGroup = 1;
            this.passengers.push(p);
        }
    }

    formatPassengerBday() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        this.maxAdultBday = new Date(year - 18, month, day);
        this.maxChildBday = new Date(year - 3, month, day);
        this.minChildBday = new Date(year - 18, month, day);
        this.maxInfantBday = new Date(year, month, day);
        this.minInfantBday = new Date(year - 1, month, day);
    }

    formatFlightLocation(name) {
        name = name.substr(0, name.indexOf('-'));
        return name;
    }

    buyTicket() {
        if (this.contactPhoneNumber.indexOf('+') > -1) {
            this.contactDetail.phoneNumber = this.contactPhoneNumber;
            for (const c of this.countries) {
                if (this.contactDetail.countryName === c.name) {
                    this.contactDetail.countryCode = c.code;
                }
            }
        }
        if (!(this.contactPhoneNumber.indexOf('+') > -1)) {
            for (const c of this.countries) {
                if (this.contactDetail.countryName === c.name) {
                    this.contactDetail.countryCode = c.code;
                    if (!(c.dialingCode.indexOf('+') > -1)) {
                        this.contactDetail.phoneNumber = '+' + c.dialingCode + '' + this.contactPhoneNumber;
                    } else {
                        this.contactDetail.phoneNumber = c.dialingCode + '' + this.contactPhoneNumber;
                    }
                }
            }
        }
        this.contactDetail.dateOfBirth = this.formatDate3(this.contactDetail.dateOfBirth);
        this.contactDetail.title = parseInt((this.contactDetail.title).toString(), 10);
        for (const p of this.passengers) {
            p.title = parseInt((p.title).toString(), 10);
        }

        const requestData = {
            pricedItinerary: this.pricedItinerary, contactInformation: this.contactDetail,
            travellers: this.passengers
        };
        this.spinnerService.show();
        this.travelbetaAPIService.postRequest(requestData, this.travelbetaAPIService.CREATE_AFILLIATE_FLIGHT_BOOKING).subscribe(
            booking => {
                if (booking.status === 0) {
                    const bookingResponse: BookingResponse = booking.data;
                    sessionStorage.setItem('bookingResponse', JSON.stringify(bookingResponse));
                    sessionStorage.setItem('contactDetail', JSON.stringify(this.contactDetail));
                    if (booking.data.successful === false) {
                        this.spinnerService.hide();
                        this.add('danger', booking.data.message);
                    } else {
                        this.secondBooking(bookingResponse);
                    }
                }
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
                this.alertMessage = 'Problem with flight booking, try again later';
                this.showModal();
            });
        if (this.shouldRegister) {
            const roles: string[] = [];
            roles.push('GUEST');
            this.contactDetail.roles = roles;
            this.localAPIService.postRequest(this.contactDetail, this.localAPIService.CREATE_ACCOUNT).subscribe(
                () => { },
                error => {
                    console.log(error);
                });
        }
    }

    secondBooking(bookingResponse: BookingResponse) {
        const reservationOwner: ReservationOwner = new ReservationOwner();
        reservationOwner.address = this.contactDetail.address + ', ' + this.contactDetail.city + ', ' + this.contactDetail.countryName;
        reservationOwner.dateOfBirth = this.contactDetail.dateOfBirth;
        reservationOwner.email = this.contactDetail.email;
        reservationOwner.firstName = this.contactDetail.firstName;
        reservationOwner.lastName = this.contactDetail.lastName;
        reservationOwner.phoneNumber = this.contactDetail.phoneNumber;
        reservationOwner.countryCode = this.contactDetail.countryCode;
        reservationOwner.city = this.contactDetail.city;
        if (this.contactDetail.title === 4) {
            reservationOwner.titleCode = 0;
        } else {
            reservationOwner.titleCode = this.contactDetail.title;
        }

        const travellers: ReservationOwner[] = [];
        for (const p of this.passengers) {
            const traveller: ReservationOwner = new ReservationOwner();
            traveller.firstName = p.firstName;
            traveller.lastName = p.lastName;
            if (p.title === 4) {
                traveller.titleCode = 0;
            } else {
                traveller.titleCode = p.title;
            }
            traveller.dateOfBirth = p.dateOfBirth;
            travellers.push(traveller);
        }

        const booking: Booking = new Booking();
        booking.amount = this.pricedItinerary.totalFare;
        booking.description = this.flightHeader.ticketClass + '(' + this.flightHeader.tripType + ')';
        booking.reservationType = 'Flight';
        booking.title = this.flightHeader.departureAirport.cityName + ' to ' + this.flightHeader.destinationAirport.cityName;
        booking.travellers = travellers;
        booking.reservationOwner = reservationOwner;
        booking.ticketLimitTime = this.pricedItinerary.ticketLimitTime;
        booking.message = bookingResponse.message;
        booking.referenceNumber = bookingResponse.referenceNumber;
        booking.bookingNumber = bookingResponse.bookingNumber;
        booking.flightDetails = this.pricedItinerary;
        booking.flightSearch = this.flightSearch;
        booking.flightSummary = this.flightHeader.departureAirport.cityName + ' to ' + this.flightHeader.destinationAirport.cityName
            + '; ' + this.flightHeader.ticketClass + '; ' + this.flightHeader.tripType;


        if (JSON.parse(localStorage.getItem('user')) != null) {
            const contactDetail: User = JSON.parse(localStorage.getItem('user'));
            booking.portalUsername = contactDetail.email;
        }

        this.spinnerService.show();
        this.localAPIService.postRequest(booking, this.localAPIService.BOOK).subscribe(
            data => {
                sessionStorage.setItem('secondbookingResponse', JSON.stringify(data.data));
                sessionStorage.setItem('bookingType', 'FLIGHT');
                sessionStorage.setItem('viewFlightPayment', 'true');
                this.router.navigate(['/flight_payment']);
                this.spinnerService.hide();
            },
            error => {
                console.log(error);
            });
    }

    setAdultContact() {
        if (this.contactDetail.firstName === '' || this.contactDetail.lastName === ''
            || this.contactDetail.title == null || this.contactDetail.dateOfBirth == null) {
            this.alertMessage = 'Please fill the Customer Account detail first';
            this.showModal();
        } else {
            this.passengers[0].firstName = this.contactDetail.firstName;
            this.passengers[0].lastName = this.contactDetail.lastName;
            this.passengers[0].title = this.contactDetail.title;
            this.passengers[0].dateOfBirth = this.formatDate3(this.contactDetail.dateOfBirth);
        }
    }

    openSearchModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.config);
    }

    signin() {
        this.localAPIService.postRequest({ email: this.email, password: this.password }, this.localAPIService.LOGIN).subscribe(
            data => {
                if (data.status === 'failure') {
                    this.alertMessage = data.message;
                    this.showModal();
                }
                if (data.status === 'success') {
                    localStorage.setItem('user', JSON.stringify(data.data));
                    //   this.checkProfile();
                    this.modalRef.hide();
                }
            },
            error => {
                console.log(error);
                this.alertMessage = ' Problem signing in';
                this.showModal();
            });

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

    getTitlename(title) {
        if (title != null) {
            if (title === 'MISS') {
                this.contactDetail.title = 1;
            }
            if (title === 'MASTER') {
                this.contactDetail.title = 2;
            }
            if (title === 'MRS') {
                this.contactDetail.title = 3;
            }
            if (title === 'MR') {
                this.contactDetail.title = 4;
            }
        }
    }
}
