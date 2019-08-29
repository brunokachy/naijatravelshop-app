import { Component } from '@angular/core';
import { PricedItineraries } from '../../model/pricedItineraries';
import { User } from '../../model/User';
import { BookingResponse } from '../../model/BookingResponse';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { InitModel } from '../../model/InitModel';
import { LocalAPIService } from '../../provider/local.api.service';
declare var getpaidSetup;
@Component({
    moduleId: module.id,
    selector: 'flight_payment',
    templateUrl: 'flight-payment.component.html',
    styleUrls: ['flight-payment.component.scss']
})
export class FlightPaymentComponent {
    pricedItinerary: PricedItineraries;
    contactDetail: User;
    bookingResponse: BookingResponse;
    initModel: InitModel;
    constructor(private router: Router, private spinner: NgxSpinnerService, private localAPIService: LocalAPIService) {
        this.pricedItinerary = JSON.parse(sessionStorage.getItem('pricedItineraries'));
        this.contactDetail = JSON.parse(sessionStorage.getItem('contactDetail'));
        this.bookingResponse = JSON.parse(sessionStorage.getItem('bookingResponse'));
        this.initModel = JSON.parse(localStorage.getItem('initModel'));
    }

    formatFlightLocation(name) {
        name = name.substr(0, name.indexOf('-'));
        return name;
    }

    formatTime2(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('HH:mm');
        return d;
    }

    formatDate2(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('DD MMM YY');
        return d;
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2);
        return parseInt(result);
    }

    formatDuration(departureTime: string, arrivalTime: string) {
        const a = moment(arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
        const b = moment(departureTime, 'DD/MM/YYYY HH:mm').valueOf();
        const c: number = a - b;
        const tempTime = moment.duration(c);
        return tempTime.hours() + 'h ' + tempTime.minutes() + 'm';
    }

    calculateLayoverTime(arrivalTime: string, departureTime: string) {
        const a = moment(arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
        const b = moment(departureTime, 'DD/MM/YYYY HH:mm').valueOf();
        const c: number = b - a;
        const tempTime = moment.duration(c);
        return tempTime.hours() + 'h ' + tempTime.minutes() + 'm';
    }

    ravePay() {
        const PBFKey = this.initModel.flwAccountDetails.publicKey;
        const ref = this;
        let payResponse = null;
        const phoneNumber = this.contactDetail.phoneNumber.replace('+', '');
        const amount = ref.formatCurrency(this.pricedItinerary.totalFare);
        ref.bookingResponse.paidAmount = ref.pricedItinerary.totalFare;

        getpaidSetup({
            PBFPubKey: PBFKey,
            customer_email: this.contactDetail.email,
            customer_firstname: this.contactDetail.firstName,
            customer_lastname: this.contactDetail.lastName,
            custom_description: '',
            custom_title: 'NaijaTravelShop',
            amount,
            customer_phone: phoneNumber,
            currency: 'NGN',
            country: 'NG',
            txref: this.bookingResponse.referenceNumber,
            integrity_hash: '',
            onclose() {
                if (payResponse != null) {
                    sessionStorage.setItem('viewPaymentResponse', 'true');
                    ref.router.navigate(['/payment_response']);
                }
            },
            callback(response) {
                if (response.success === false) {

                } else {
                    payResponse = response.tx.flwRef;
                    sessionStorage.setItem('paymentRef', response.tx.flwRef);
                    sessionStorage.setItem('txFee', response.tx.appfee);
                    sessionStorage.setItem('totalAmount', response.tx.amount + response.tx.appfee);
                    if (response.tx.chargeResponseCode === '00' || response.tx.chargeResponseCode === '0') {

                    } else {
                        console.log('Error paying with rave');
                    }
                }
            }
        });

    }

    goHome() {
        const requestData = { bookingNumber: this.bookingResponse.bookingNumber, amount: this.bookingResponse.paidAmount };
        this.localAPIService.postRequest(requestData, this.localAPIService.BANK_PAYMENT).subscribe(
            data => {
                sessionStorage.clear();
                this.router.navigate(['/home']);
                window.location.reload();
            },
            error => {
                console.log(error);
            });
    }
}
