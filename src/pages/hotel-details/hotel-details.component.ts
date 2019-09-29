import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { HotelList } from '../../model/hotelList';
import { HotelSearch } from '../../model/HotelSearch';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { RoomDetailList } from '../../model/RoomDetailList';
import { User } from '../../model/user';
import { Country } from '../../model/Country';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalAPIService } from '../../provider/local.api.service';
import { HotelBooking } from '../../model/HotelBooking';

@Component({
    moduleId: module.id,
    selector: 'hotel_details',
    templateUrl: 'hotel-details.component.html',
    styleUrls: ['hotel-details.component.scss']
})
export class HotelDetailsComponent {
    hotel: HotelList;
    hotelSearch: HotelSearch;
    nights: number;
    room: { name: string, roomPrice: number };
    modalRef: BsModalRef;

    roomDetailLists: RoomDetailList[] = [];
    contactDetail: User = new User();
    countries: Country[] = [];

    login = false;
    shouldRegister = false;
    alertMessage: string;

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    constructor(private modalService: BsModalService, private router: Router,
        private spinnerService: NgxSpinnerService, private localAPIService: LocalAPIService) {
        this.hotel = JSON.parse(sessionStorage.getItem('hotel'));
        this.hotelSearch = JSON.parse(sessionStorage.getItem('hotelSearch'));
        this.room = JSON.parse(sessionStorage.getItem('selectedRoom'));
        this.calculateNights();
        this.roomDetailLists = this.hotelSearch.roomDetailList;
        this.populateTravellers();
        this.countries = JSON.parse(localStorage.getItem('countries'));
    }

    selectHotel() {
        localStorage.setItem('viewHotelDetails', 'true');
        this.router.navigate(['/hotel_details']);
    }

    calculateNights() {
        const now = moment(this.hotelSearch.checkInDate, 'YYYY-MM-DD');
        const end = moment(this.hotelSearch.checkOutDate, 'YYYY-MM-DD');
        const duration = moment.duration(end.diff(now));
        const days = duration.asDays();
        this.nights = days;
    }

    formatDate2(date) {
        const a = moment(date, 'YYYY-MM-DD').valueOf();
        const d = moment(a).format('dddd');
        return d;
    }

    formatDate3(date) {
        const a = moment(date, 'YYYY-MM-DD').valueOf();
        const d = moment(a).format('MMM DD, YYYY');
        return d;
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result, 10);
    }

    populateTravellers() {
        for (const u of this.roomDetailLists) {
            for (const m of u.adultsAgeList) {
                const user = new User();
                user.age = m;
                u.adultList.push(user);
            }
            for (const m of u.childrenAgeList) {
                const user = new User();
                user.age = m;
                u.childrenList.push(user);
            }
        }
    }

    setAdultContact() {
        if (this.contactDetail.firstName === undefined || this.contactDetail.lastName === undefined
            || this.contactDetail.title == null || this.contactDetail.countryName === '') {
            this.alertMessage = 'Please fill the Customer Account detail first';
            this.showModal();
        } else {
            this.roomDetailLists[0].adultList[0].firstName = this.contactDetail.firstName;
            this.roomDetailLists[0].adultList[0].lastName = this.contactDetail.lastName;
            this.roomDetailLists[0].adultList[0].title = this.contactDetail.title;
            this.roomDetailLists[0].adultList[0].countryName = this.contactDetail.countryName;
        }
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

    openSearchModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    proceed() {
        const hotelBooking: HotelBooking = new HotelBooking();
        hotelBooking.cityCode = this.hotel.cityCode;
        hotelBooking.cityName = this.hotel.cityName;
        hotelBooking.countryCode = this.hotel.countryCode;
        hotelBooking.countryName = this.hotel.countryName;
        hotelBooking.customerAccount = this.contactDetail;
        hotelBooking.guestInformation = this.roomDetailLists;
        hotelBooking.hotelDescription = this.hotel.smallDescription;
        hotelBooking.hotelId = this.hotel.hotelId;
        hotelBooking.hotelName = this.hotel.hotelName;
        hotelBooking.roomName = this.room.name;
        hotelBooking.roomPrice = this.room.roomPrice;
        hotelBooking.checkInDate = this.hotelSearch.checkInDate;
        hotelBooking.checkOutDate = this.hotelSearch.checkOutDate;
        hotelBooking.nights = this.nights;
        hotelBooking.roomCount = this.hotelSearch.numberOfRooms;
        hotelBooking.childCount = this.hotelSearch.childCount;
        hotelBooking.adultCount = this.hotelSearch.adultCount;
        if (JSON.parse(localStorage.getItem('user')) != null) {
            const portalUser: User = JSON.parse(localStorage.getItem('user'));
            hotelBooking.portalUsername = portalUser.email;
        }

        this.spinnerService.show();
        this.localAPIService.postRequest(hotelBooking, this.localAPIService.BOOKING_HOTEL).subscribe(
            data => {
                sessionStorage.setItem('bookingResponse', JSON.stringify(data.data));
                sessionStorage.setItem('contactDetail', JSON.stringify(this.contactDetail));
                this.spinnerService.hide();
                sessionStorage.setItem('bookingType', 'HOTEL');
                sessionStorage.setItem('viewFlightPayment', 'true');
                this.router.navigate(['/flight_payment']);
            },
            error => {
                this.spinnerService.hide();
                this.alertMessage = 'Problem with hotel booking, try again later';
                this.showModal();
                console.log(error);
            });

        if (this.shouldRegister) {
            const roles: string[] = [];
            roles.push('GUEST');
            this.contactDetail.roles = roles;
            this.localAPIService.postRequest(this.contactDetail, this.localAPIService.CREATE_ACCOUNT).subscribe(
                () => { },
                error => {
                    console.log(error);
                });
        }
    }
}
