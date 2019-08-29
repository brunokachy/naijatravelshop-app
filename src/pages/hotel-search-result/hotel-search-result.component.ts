import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotelSearch } from '../../model/HotelSearch';
import { Hotels } from '../../model/Hotels';
import { HotelList } from '../../model/HotelList';
import { BsModalRef } from 'ngx-bootstrap';
import { HotelCity } from '../../model/HotelCity';
import { RoomDetailList } from '../../model/RoomDetailList';
import * as moment from 'moment';

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

    noOfRooms = 1;
    hotelCity: HotelCity;
    hotel: string;
    roomDetailLists: RoomDetailList[] = [];
    checkinDate = '';
    checkoutDate = '';
    minCheckinDate: Date;
    maxCheckinDate: Date;
    minCheckoutDate: Date;
    maxCheckoutDate: Date;
    hotelCities: HotelCity[] = [];

    sortValue = 'Lowest Price';
    rating = '0';
    ratingList: { 'rating': string, 'size': number }[] = [];
    facilities: { 'name': string, 'realname': string, 'checked': boolean }[] = [];

    constructor(private router: Router) {
        // this.hotelCities = JSON.parse(localStorage.getItem('hotelCities'));
        // this.hotels = JSON.parse(localStorage.getItem('hotels'));
        // this.hotelSearch = JSON.parse(localStorage.getItem('hotelSearch'));
        // this.populateHotels();
        // this.populateRatingList();
        // this.populateFacilities();
    }

    populateHotels() {
        this.hotelList = this.hotels.hotelList;
        this.sort();
    }

    populateRatingList() {
        const rating: { 'rating': string, 'size': number }[] = [];

        for (const r of this.hotelList) {
            rating.push({ rating: r.starRating, size: 0 });
        }
        this.ratingList = this.removeDuplicates(rating, 'rating');
        for (const r of this.hotelList) {
            for (const l of this.ratingList) {
                if (r.starRating === l.rating) {
                    l.size++;
                }
            }
        }
        this.ratingList.pop();
        this.ratingList.sort((obj1, obj2) => parseInt(obj2.rating, 10) - parseInt(obj1.rating, 10));
    }

    populateFacilities() {
        const facilities: { 'name': string, 'realname': string, 'checked': boolean }[] = [];

        for (const h of this.hotelList) {
            for (const f of h.facilityList) {
                facilities.push({ name: f.type.replace(/_/g, ' '), realname: f.type, checked: false });
            }
        }
        this.facilities = this.removeDuplicates(facilities, 'name');
        this.facilities.pop();

        this.facilities.sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    removeDuplicates(originalArray, prop) {
        const newArray = [];
        const lookupObject = {};

        for (let i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (let i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    filter() {
        let filtered1: HotelList[] = [];
        let filtered2: HotelList[] = [];

        this.populateHotels();
        for (const f of this.hotelList) {
            for (const ff of f.facilityList) {
                for (const fff of this.facilities) {
                    if (ff.type === fff.realname && fff.checked === true) {
                        filtered1.push(f);
                    }
                }
            }
        }

        if (filtered1.length === 0) {
            filtered1 = this.hotelList;
        } else {
            filtered1 = this.removeDuplicates(filtered1, 'hotelName');
            filtered1.pop();
        }


        if (this.rating === '0') {
            filtered2 = filtered1;
        } else {
            for (const f of filtered1) {
                if (f.starRating === this.rating) {
                    filtered2.push(f);
                }
            }
        }
        this.hotelList = filtered2;
    }



    selectRating(rating) {
        this.rating = rating;
        this.filter();
    }

    selectFacility(event, i) {
        if (event.target.checked) {
            this.facilities[i].checked = true;
        } else {
            this.facilities[i].checked = false;
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
                return parseFloat(obj2.starRating) - parseFloat(obj1.starRating);
            });
        }
    }

    selectHotel(hotel: HotelList) {
        localStorage.setItem('hotel', JSON.stringify(hotel));
        localStorage.setItem('hotelsSignature', JSON.stringify(this.hotels.searchSignature));
        localStorage.setItem('viewHotelDetails', 'true');
        this.router.navigate(['/hotel_details']);
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result, 10);
    }

    formateDate3(date) {
        const a = moment(date, 'DD/MM/YYYY').valueOf();
        const d = moment(a).format('MMM DD, YYYY');
        return d;
    }

    formateDate2(date) {
        const a = moment(date, 'DD/MM/YYYY').valueOf();
        const d = moment(a).format('ddd Do MMM, YYYY');
        return d;
    }

    formateDate(date) {
        const a = moment(date, 'ddd Do MMM, YYYY').valueOf();
        const d = moment(a).format('DD/MM/YYYY');
        return d;
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

    // checkInputH(e) {
    //     if (e.length > 1) {
    //         this.getLocationsBySearchTerm(e);
    //     }
    // }

    // getLocationsBySearchTerm(searchValue: string) {
    //     const requestData = JSON.stringify({ searchTerm: searchValue, maxLimit: 10 });
    //     this.service.callAPI(requestData, this.service.GETLOCATIONS).subscribe(
    //         data => {
    //             if (data.status == 0) {
    //                 this.hotelLocations = [];
    //                 this.hotelLocations = data.data;
    //             }
    //         },
    //         error => {
    //             console.log(error);
    //         });
    // }

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

    formatHotelAddress(name) {
        name = name.substring(name.indexOf(';') + 1);
        return name;
    }

    // typeaheadOnSelectH(e: TypeaheadMatch): void {
    //     this.hotelLocation = e.item;
    // }

    // searchHotel() {
    //     this.hotelSearch.checkInDate = this.formateDate(this.checkinDate);
    //     this.hotelSearch.checkOutDate = this.formateDate(this.checkoutDate);
    //     this.hotelSearch.location = this.hotelLocation;
    //     this.hotelSearch.numberOfRooms = this.noOfRooms;
    //     this.hotelSearch.resultLimit = 100;
    //     this.hotelSearch.roomDetailList = this.roomDetailLists;
    //     this.spinnerService.show();
    //     this.service.callAPI(this.hotelSearch, this.service.SEARCHHOTELS).subscribe(
    //         hotel => {
    //             if (hotel.status == 0) {
    //                 localStorage.setItem('hotels', JSON.stringify(hotel.data));
    //                 localStorage.setItem('hotelSearch', JSON.stringify(this.hotelSearch));
    //                 this.hotels = hotel.data;
    //                 this.populateHotels();
    //                 this.populateRatingList();
    //                 this.populateFacilities();
    //                 this.spinnerService.hide();
    //                 this.modalRef.hide();
    //             }
    //         },
    //         error => {
    //             console.log(error);
    //             this.spinnerService.hide();
    //             this.showModal();
    //         });

    // }

    // openSearchModal(template: TemplateRef<any>) {
    //     this.formatCheckinDate();
    //     this.hotelSearch = JSON.parse(localStorage.getItem('hotelSearch'));
    //     this.hotel = this.hotelSearch.location.name;
    //     this.hotelLocation = this.hotelSearch.location;
    //     this.checkinDate = this.formateDate2(this.hotelSearch.checkInDate);
    //     this.checkoutDate = this.formateDate2(this.hotelSearch.checkOutDate);
    //     this.noOfRooms = this.hotelSearch.numberOfRooms;
    //     this.roomDetailLists = [];
    //     this.roomDetailLists = this.hotelSearch.roomDetailList;

    //     this.hotelDatasource = Observable.create((observer: any) => {
    //         observer.next(this.hotelLocations);
    //     }).mergeMap((token: string) => Observable.of(this.hotelLocations));

    //     this.modalRef = this.modalService.show(template);
    // }

    // @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    // isModalShown: boolean = false;

    // showModal(): void {
    //     this.isModalShown = true;
    // }

    // hideModal(): void {
    //     this.autoShownModal.hide();
    // }

    // onHidden(): void {
    //     this.isModalShown = false;
    // }

}
