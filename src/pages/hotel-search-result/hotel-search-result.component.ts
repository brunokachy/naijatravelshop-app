import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HotelSearch } from '../../model/HotelSearch';
import { Hotels } from '../../model/Hotels';
import { HotelList } from '../../model/HotelList';
import { BsModalRef, TypeaheadMatch, ModalDirective, BsModalService } from 'ngx-bootstrap';
import { HotelCity } from '../../model/HotelCity';
import { RoomDetailList } from '../../model/RoomDetailList';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalAPIService } from '../../provider/local.api.service';

@Component({
    moduleId: module.id,
    selector: 'hotel_search_result',
    templateUrl: 'hotel-search-result.component.html',
    styleUrls: ['hotel-search-result.component.scss']
})
export class HotelSearchResultComponent {
    hotels: Hotels;
    hotelSearch: HotelSearch;
    hotelList: HotelList[] = [];

    modalRef: BsModalRef;

    hotelCity: HotelCity;
    cityName: string;
    roomDetailLists: RoomDetailList[] = [];
    checkinDate: Date = new Date();
    checkoutDate: Date = new Date();
    minCheckinDate: Date;
    maxCheckinDate: Date;
    minCheckoutDate: Date;
    maxCheckoutDate: Date;
    hotelCities: HotelCity[] = [];

    sortValue = 'Lowest Price';
    rating = '-1';
    ratingList: { 'rating': string, 'size': number }[] = [];
    facilities: { 'name': string, 'realname': string, 'checked': boolean }[] = [];
    selectedFacilities: string[] = [];
    maxPrice = 0;
    minPrice = 0;

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    constructor(private router: Router, private modalService: BsModalService, private spinnerService: NgxSpinnerService,
        private localService: LocalAPIService) {
        this.hotelCities = JSON.parse(localStorage.getItem('hotelCities'));
        this.hotels = JSON.parse(sessionStorage.getItem('hotels'));
        this.hotelSearch = JSON.parse(sessionStorage.getItem('hotelSearch'));
        this.cityName = this.hotelSearch.city.name;
        this.maxPrice = Math.trunc(this.hotels.maximumPrice);
        this.minPrice = Math.trunc(this.hotels.minimumPrice);
        this.populateHotels();
        this.populateRatingList();
        this.populateFacilities();
    }

    populateHotels() {
        this.hotelList = this.hotels.hotelList;
        this.sort();
    }

    reset() {
        this.maxPrice = Math.trunc(this.hotels.maximumPrice);
        this.minPrice = Math.trunc(this.hotels.minimumPrice);
        this.filter();
    }

    populateRatingList() {
        const rating: { 'rating': string, 'size': number }[] = [];

        for (const r of this.hotelList) {
            rating.push({ rating: r.rating, size: 0 });
        }
        this.ratingList = this.getUnique(rating, 'rating');
        for (const r of this.hotelList) {
            for (const l of this.ratingList) {
                if (r.rating === l.rating) {
                    l.size++;
                }
            }
        }
        this.ratingList.pop();
        this.ratingList.sort((obj1, obj2) => parseInt(obj2.rating, 10) - parseInt(obj1.rating, 10));
    }

    populateFacilities() {
        this.selectedFacilities = [];
        const facilities: { 'name': string, 'checked': boolean }[] = [];

        for (const h of this.hotelList) {
            for (const facility of h.facilities) {
                facilities.push({ name: facility, checked: false });
            }
        }
        this.facilities = this.getUnique(facilities, 'name');
        this.facilities.pop();

        this.facilities.sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    getUnique(arr, comp) {
        const unique = arr
            .map(e => e[comp])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);
        return unique;
    }

    filter() {
        const priceFilter: HotelList[] = [];
        let facilityFilter: HotelList[] = [];
        let ratingFilter: HotelList[] = [];

        this.populateHotels();
        for (const hotel of this.hotelList) {
            if (hotel.minimumPrice > this.minPrice && hotel.maximumPrice < this.maxPrice) {
                priceFilter.push(hotel);
            }
        }

        for (const hotel of priceFilter) {
            hotel.facilities.some(ai => this.selectedFacilities.includes(ai)) ? facilityFilter.push(hotel) : '';
        }

        if (facilityFilter.length === 0) {
            facilityFilter = priceFilter;
        } else {
            facilityFilter = this.getUnique(facilityFilter, 'hotelId');
        }


        if (this.rating === '-1') {
            ratingFilter = facilityFilter;
        } else {
            for (const f of facilityFilter) {
                if (f.rating === this.rating) {
                    ratingFilter.push(f);
                }
            }
        }
        this.hotelList = ratingFilter;
    }

    selectRating(rating) {
        this.rating = rating;
        this.filter();
    }

    selectFacility(event, i) {
        if (event.target.checked) {
            this.selectedFacilities.push(i.name);
        } else {
            const index = this.selectedFacilities.indexOf(i.name);
            if (index > -1) {
                this.selectedFacilities.splice(index, 1);
            }
        }
        this.filter();
    }

    sort() {
        if (this.sortValue === 'Lowest Price') {
            this.hotelList.sort((obj1, obj2) => {
                return obj1.minimumPrice - obj2.minimumPrice;
            });
        }
        if (this.sortValue === 'Highest Price') {
            this.hotelList.sort((obj1, obj2) => {
                return obj2.minimumPrice - obj1.minimumPrice;
            });
        }
        if (this.sortValue === 'Highest Rating') {
            this.hotelList.sort((obj1, obj2) => {
                return parseFloat(obj2.rating) - parseFloat(obj1.rating);
            });
        }
    }

    selectHotel(hotel: HotelList) {
        sessionStorage.setItem('hotel', JSON.stringify(hotel));
        sessionStorage.setItem('viewHotelRooms', 'true');
        this.router.navigate(['/app-hotel-rooms']);
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result, 10);
    }

    formateDate3(date) {
        const a = moment(date, 'YYYY-MM-DD').valueOf();
        const d = moment(a).format('MMM DD, YYYY');
        return d.toString();
    }

    formatCheckinDate() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        this.minCheckinDate = d;
        this.minCheckoutDate = d;
        this.maxCheckinDate = new Date(year + 2, month, day);
        this.maxCheckoutDate = new Date(year + 2, month, day);
    }

    formateCheckoutDate(checkinDate) {
        const msec = Date.parse(checkinDate);
        const dd = new Date(msec);
        const year = dd.getFullYear();
        const month = dd.getMonth();
        const day = dd.getDate();
        this.minCheckoutDate = new Date(year, month, day + 1);
        this.maxCheckoutDate = new Date(year + 2, month, day);
    }

    checkRooms(e) {
        if (e > this.roomDetailLists.length) {
            for (let i = this.roomDetailLists.length; i < e; i++) {
                const roomDetail = new RoomDetailList();
                roomDetail.adultsAgeList = [20];
                roomDetail.childrenAgeList = [];
                roomDetail.numberOfAdults = 1;
                roomDetail.numberOfChildren = 0;
                this.roomDetailLists.push(roomDetail);
            }
        }

        if (e < this.roomDetailLists.length) {
            const newValue = this.roomDetailLists.length - e;
            for (let i = 0; i < newValue; i++) {
                this.roomDetailLists.pop();
            }
        }
    }

    setRooms() {
        const roomDetail = new RoomDetailList();
        roomDetail.adultsAgeList = [20];
        roomDetail.childrenAgeList = [];
        roomDetail.numberOfAdults = 1;
        roomDetail.numberOfChildren = 0;
        this.roomDetailLists.push(roomDetail);
    }

    setChildrenAge(e, o) {
        if (e > this.roomDetailLists[o].childrenAgeList.length) {
            for (let i = 0; i < e; i++) {
                this.roomDetailLists[o].childrenAgeList[i] = 0;
            }
        }

        if (e < this.roomDetailLists[o].childrenAgeList.length) {
            const newValue = this.roomDetailLists[o].childrenAgeList.length - e;
            for (let i = 0; i < newValue; i++) {
                this.roomDetailLists[o].childrenAgeList.pop();
            }
        }

    }

    setAdultAge(e, o) {
        if (e > this.roomDetailLists[o].adultsAgeList.length) {
            for (let i = 0; i < e; i++) {
                this.roomDetailLists[o].adultsAgeList[i] = 20;
            }
        }

        if (e < this.roomDetailLists[o].adultsAgeList.length) {
            const newValue = this.roomDetailLists[o].adultsAgeList.length - e;
            for (let i = 0; i < newValue; i++) {
                this.roomDetailLists[o].adultsAgeList.pop();
            }
        }
    }

    typeaheadOnSelectH(e: TypeaheadMatch): void {
        this.hotelCity = e.item;
    }

    searchHotel() {
        this.hotelSearch.checkInDate = moment(this.checkinDate).format('YYYY-MM-DD');
        this.hotelSearch.checkOutDate = moment(this.checkoutDate).format('YYYY-MM-DD');
        this.hotelSearch.city = this.hotelCity;
        this.hotelSearch.cityCode = this.hotelCity.code;
        this.hotelSearch.roomDetailList = this.roomDetailLists;
        this.spinnerService.show();
        this.localService.postRequest(this.hotelSearch, this.localService.SEARCH_HOTELS).subscribe(
            hotel => {
                sessionStorage.setItem('hotels', JSON.stringify(hotel.data));
                sessionStorage.setItem('hotelSearch', JSON.stringify(this.hotelSearch));
                this.spinnerService.hide();
                this.hotels = hotel.data;
                this.cityName = this.hotelSearch.city.name;
                this.maxPrice = Math.trunc(this.hotels.maximumPrice);
                this.minPrice = Math.trunc(this.hotels.minimumPrice);
                this.populateHotels();
                this.populateRatingList();
                this.populateFacilities();
                this.hotelSearch.checkinDateDisplay = this.formateDate3(this.hotelSearch.checkInDate);
                this.hotelSearch.checkoutDateDisplay = this.formateDate3(this.hotelSearch.checkOutDate);
                this.modalRef.hide();
            },
            error => {
                console.log(error);
                this.spinnerService.hide();
                this.showModal();
            });
    }

    openSearchModal(template: TemplateRef<any>) {
        this.formatCheckinDate();
        this.hotelSearch = JSON.parse(sessionStorage.getItem('hotelSearch'));
        this.hotelCity = this.hotelSearch.city;
        this.checkinDate = moment(this.hotelSearch.checkInDate, 'YYYY-MM-DD').toDate();
        this.checkoutDate = moment(this.hotelSearch.checkOutDate, 'YYYY-MM-DD').toDate();
        this.roomDetailLists = [];
        this.roomDetailLists = this.hotelSearch.roomDetailList;

        this.modalRef = this.modalService.show(template);
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

}
