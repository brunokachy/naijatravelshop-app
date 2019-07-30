import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'hotel_search_result',
    templateUrl: 'hotel-search-result.component.html',
    styleUrls: ['hotel-search-result.component.scss']
})
export class HotelSearchResultComponent {
    constructor(private router: Router) {
    }

    selectHotel() {
        localStorage.setItem('viewHotelDetails', 'true');
        this.router.navigate(['/hotel_details']);
    }
}
