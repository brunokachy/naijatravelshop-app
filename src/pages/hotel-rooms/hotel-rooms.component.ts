import { Component, ViewChild } from '@angular/core';
import { HotelList } from '../../model/hotelList';
import { HotelSearch } from '../../model/HotelSearch';
import { BsModalRef } from 'ngx-bootstrap';
import { AgmMap } from '@agm/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app-hotel-rooms',
    templateUrl: 'hotel-rooms.component.html',
    styleUrls: ['hotel-rooms.component.scss']
})
export class HotelRoomsComponent {
    hotel: HotelList;
    hotelSearch: HotelSearch;
    childCount = 0;
    adultCount = 0;
    modalRef: BsModalRef;
    zoom = 15;

    @ViewChild('map') gmapElement: AgmMap;
    public map: any = { lat: 51.678418, lng: 7.809007 };

    constructor(private router: Router) {
        this.hotel = JSON.parse(sessionStorage.getItem('hotel'));
        this.hotelSearch = JSON.parse(sessionStorage.getItem('hotelSearch'));
        this.getGuestCount();
        this.createMap();
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result, 10);
    }

    createMap() {
        this.map.lat = parseFloat(this.hotel.lat);
        this.map.lng = parseFloat(this.hotel.lng);
    }

    getGuestCount() {
        for (const c of this.hotelSearch.roomDetailList) {
            this.childCount = parseInt(c.numberOfChildren.toString(), 10) + this.childCount;
            this.adultCount = c.numberOfAdults + this.adultCount;
        }
        this.hotelSearch.adultCount = this.adultCount;
        this.hotelSearch.childCount = this.childCount;
        sessionStorage.setItem('hotelSearch', JSON.stringify(this.hotelSearch));
    }

    selectRoom(room: { name: string, roomPrice: number }) {
        sessionStorage.setItem('selectedRoom', JSON.stringify(room));
        sessionStorage.setItem('viewHotelDetails', 'true');
        this.router.navigate(['/hotel_details']);
    }
}
