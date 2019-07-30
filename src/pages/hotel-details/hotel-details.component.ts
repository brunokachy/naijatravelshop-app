import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'hotel_details',
    templateUrl: 'hotel-details.component.html',
    styleUrls: ['hotel-details.component.scss']
})
export class HotelDetailsComponent {

    constructor(private router: Router) {
    }

    selectHotel() {
        localStorage.setItem('viewHotelDetails', 'true');
        this.router.navigate(['/hotel_details']);
    }
}
