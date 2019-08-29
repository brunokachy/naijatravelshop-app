import { Component } from '@angular/core';
import { User } from '../../model/user';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
    user: User;
    flightCount = 0;
    hotelCount = 0;
    bookingCount = 0;
    visaCount = 0;
    bookings: any[];
    isSuperAdmin = false;

    constructor(private localAPIService: LocalAPIService) {
        this.isSuperAdmin = JSON.parse(localStorage.getItem('isSuperAdmin'));
        this.getRecentBookings();
    }

    formatCurrency(amount: number) {
        if (amount === 0) {
            return 0;
        }
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result, 10);
    }

    getRecentBookings() {
        this.localAPIService.getRequest(this.localAPIService.GET_RECENT_BOOKINGS)
            .subscribe(data => {
                this.bookings = data.data.slice(0, 20);
                for (const b of data.data) {
                    if (b.bookingType === 'FLIGHT') {
                        this.flightCount++;
                    }

                    if (b.bookingType === 'HOTEL') {
                        this.hotelCount++;
                    }
                }
            }, error => {
                console.log(error);
            });

    }
}
