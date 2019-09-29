import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingResponse } from '../../model/BookingResponse';
import { NgxSpinnerService } from 'ngx-spinner';
import { InitModel } from '../../model/InitModel';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'payment_response',
    templateUrl: 'payment-response.component.html',
    styleUrls: ['payment-response.component.scss']
})
export class PaymentResponseComponent {
    paymentRef: string;
    totalAmount = 0;
    txFee = 0.00;
    fare = 0.00;
    bookingResponse: BookingResponse;
    response: { bookingNumber: string, reservationId: number };
    bookingType: string;
    bookingNumber: string;
    referenceNumber: string;
    alerts: any[] = [];
    initModel: InitModel;

    constructor(private router: Router, private localAPIService: LocalAPIService, private spinner: NgxSpinnerService) {


        this.bookingType = sessionStorage.getItem('bookingType');
        if (this.bookingType === 'HOTEL') {
            this.response = JSON.parse(sessionStorage.getItem('bookingResponse'));
            this.bookingNumber = this.response.bookingNumber;
            this.referenceNumber = this.response.bookingNumber;
        }

        if (this.bookingType === 'FLIGHT') {
            this.bookingResponse = JSON.parse(sessionStorage.getItem('bookingResponse'));
            this.bookingNumber = this.bookingResponse.referenceNumber;
            this.referenceNumber = this.bookingResponse.referenceNumber;
        }

        this.paymentRef = sessionStorage.getItem('paymentRef');
        this.totalAmount = JSON.parse(sessionStorage.getItem('totalAmount'));
        this.txFee = JSON.parse(sessionStorage.getItem('txFee'));
        this.fare = this.totalAmount - this.txFee;
        this.initModel = JSON.parse(localStorage.getItem('initModel'));
        this.paymentVerification();
    }

    add(type, message): void {
        this.alerts.push({
            type,
            msg: message,
            timeout: 5000
        });
    }

    paymentVerification() {
        const SECKKey = this.initModel.flwAccountDetails.secretKey;
        const requestData = JSON.stringify({
            flwRef: this.referenceNumber,
            secret: SECKKey,
            amount: this.fare,
            paymentEntity: 1,
            paymentRef: this.paymentRef,
            paymentCode: 'F03',
            bookingNumber: this.bookingNumber
        });

        this.localAPIService.postRequest(requestData, this.localAPIService.PAYMENT_VERIFICATION).subscribe(
            data => {
                if (data.data === 'Success') {
                    this.add('success', data.message);
                } else {
                    this.add('danger', 'Payment Verification was not successfully. Please contact admin.');
                }
            },
            error => {
                console.log(error);
                this.spinner.hide();
                this.add('danger', 'Payment Verification was not successfully. Please contact admin.');
            });
    }

    goHome() {
        sessionStorage.clear();
        this.router.navigate(['/home']);
        window.location.reload();
    }
}
