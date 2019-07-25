import { Component } from '@angular/core';
import { PricedItineraries } from '../../model/pricedItineraries';
import { User } from '../../model/User';
import { BookingResponse } from '../../model/BookingResponse';
import { Service } from '../../provider/api.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { InitModel } from '../../model/InitModel';
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
    constructor(private router: Router, private service: Service, private spinner: NgxSpinnerService) {
        this.pricedItinerary = JSON.parse(localStorage.getItem('pricedItineraries'));
        this.contactDetail = JSON.parse(localStorage.getItem('contactDetail'));
        this.bookingResponse = JSON.parse(localStorage.getItem('bookingResponse'));
        this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
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
                    localStorage.setItem('viewPaymentResponse', 'true');
                    ref.router.navigate(['/payment_response']);
               }
            },
            callback(response) {
                if (response.success === false) {

                } else {
                    payResponse = response.tx.flwRef;
                    localStorage.setItem('paymentRef', response.tx.flwRef);
                    localStorage.setItem('txFee', response.tx.appfee);
                    localStorage.setItem('totalAmount', response.tx.amount + response.tx.appfee);
                    if (response.tx.chargeResponseCode === '00' || response.tx.chargeResponseCode === '0') {

                    } else {
                        console.log('Error paying with rave');
                    }
                }
            }
        });

    }

    goHome() {
        const token = JSON.parse(localStorage.getItem('token'));
        const countries = JSON.parse(localStorage.getItem('countries'));
        localStorage.clear();
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('countries', JSON.stringify(countries));
        this.router.navigate(['/home']);
        window.location.reload();
    }
}
