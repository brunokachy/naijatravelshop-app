import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../provider/api.service';
import { BookingResponse } from '../../model/BookingResponse';
import { NgxSpinnerService } from 'ngx-spinner';
import { InitModel } from '../../model/InitModel';

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
    alerts: any[] = [];
    initModel: InitModel;

    constructor(private router: Router, private service: Service, private spinner: NgxSpinnerService) {
        this.bookingResponse = JSON.parse(localStorage.getItem('bookingResponse'));
        this.paymentRef = localStorage.getItem('paymentRef');
        this.totalAmount = JSON.parse(localStorage.getItem('totalAmount'));
        this.txFee = JSON.parse(localStorage.getItem('txFee'));
        this.fare = this.totalAmount - this.txFee;
        this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
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
            flwRef: this.bookingResponse.referenceNumber,
            secret: SECKKey,
            amount: this.fare,
            paymentEntity: 1,
            paymentRef: this.paymentRef,
            paymentCode: 'F03',
            bookingNumber: this.bookingResponse.bookingNumber
        });

        this.service.callAPII(requestData, this.service.PAYMENT_VERIFICATION).subscribe(
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
        const token = JSON.parse(localStorage.getItem('token'));
        const countries = JSON.parse(localStorage.getItem('countries'));
        localStorage.clear();
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('countries', JSON.stringify(countries));
        this.router.navigate(['/home']);
        window.location.reload();
    }
}
