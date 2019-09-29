import { Component, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { TypeaheadMatch, ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlightDataSearch } from '../../model/FlightDataSearch';
import { InitModel } from '../../model/InitModel';
import { Country } from '../../model/Country';
import { VisaRequest } from '../../model/VisaRequest';
import { TravelbetaAPIService } from '../../provider/travelbeta.api.service';
import { LocalAPIService } from '../../provider/local.api.service';
import { User } from '../../model/user';
import { Airport } from '../../model/Airport';
import { TopDeal } from '../../model/TopDeals';
import { HotelCity } from '../../model/HotelCity';
import { RoomDetailList } from '../../model/RoomDetailList';
import { HotelSearch } from '../../model/HotelSearch';


@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {
    initModel: InitModel = new InitModel();
    @ViewChild('departureCity1') departureCityElement1: ElementRef;
    @ViewChild('destinationCity1') destinationCityElement1: ElementRef;
    @ViewChild('departureCity2') departureCityElement2: ElementRef;
    @ViewChild('destinationCity2') destinationCityElement2: ElementRef;
    @ViewChild('hotelCityElement') hotelCityElement: ElementRef;

    constructor(private TBservice: TravelbetaAPIService, private router: Router, private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService, private localService: LocalAPIService) {
        this.sessionConfig();
        this.countries = JSON.parse(localStorage.getItem('countries'));
        this.topDeals = JSON.parse(localStorage.getItem('topDeals'));
        this.formatDepartureDate();
        this.populateMultipleDest();
        this.formatCheckinDate();
        this.setRooms();
        this.populatePopularAirports();

        this.flight = localStorage.getItem('flight');
        this.hotel = localStorage.getItem('hotel');
        this.visa = localStorage.getItem('visa');

        this.activatedRoute.params.subscribe(params => {
            const tab = params.tab;
            if (tab === undefined || tab === 'flight') {
                this.flight = 'active';
                this.visa = '';
                this.hotel = '';
            }

            if (tab === 'hotel') {
                this.flight = '';
                this.visa = '';
                this.hotel = 'active';
            }

            if (tab === 'visa') {
                this.flight = '';
                this.visa = 'active';
                this.hotel = '';
            }
        });
    }

    subscribeEmail: string;

    visa: string;
    hotel: string;
    flight: string;

    minDepartureDate: Date;
    maxDepartureDate: Date;
    minReturnDate: Date;
    maxReturnDate: Date;
    departureDate = '';
    returnDate = '';

    airports: Airport[] = [];
    popularAirports: Airport[] = [];
    departureAirport: Airport;
    destinationAirport: Airport;
    departure: string;
    destination: string;

    adultTraveller = 1;
    childTraveller = 0;
    infantTraveller = 0;
    totalTraveller = 1;
    travellerAlert = '';
    tripType = '2';
    seatclass = '1';
    multipleDest: { 'departureAirport': Airport, 'arrivalAirport': Airport, 'departureDate': string }[] = [];



    countries: Country[] = [];
    topDeals: TopDeal[] = [];

    minVisaReturnDate: Date;
    maxVisaReturnDate: Date;
    visaDepartureDate = '';
    visaReturnDate = '';
    visaRequest: VisaRequest = new VisaRequest();

    city: string;
    hotelCities: HotelCity[] = [];
    hotelCity: HotelCity;
    noOfRooms = 1;
    roomDetailLists: RoomDetailList[] = [];
    checkinDate = '';
    checkoutDate = '';
    minCheckinDate: Date;
    maxCheckinDate: Date;
    minCheckoutDate: Date;
    maxCheckoutDate: Date;

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    populateMultipleDest() {
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
    }

    typeaheadOnSelectM(e: TypeaheadMatch, type: string, index: number): void {
        if (type === 'Departure') {
            this.multipleDest[index].departureAirport = e.item;
        }
        if (type === 'Destination') {
            this.multipleDest[index].arrivalAirport = e.item;
        }
    }

    checkForHotelCityList() {
        const currentValue = this.hotelCityElement.nativeElement.value;
        if (localStorage.getItem('hotelCities') == null) {
            const intervalHotelCity = setInterval(() => {
                this.hotelCityElement.nativeElement.value = 'Loading...';
                this.hotelCityElement.nativeElement.disabled = true;
                if (localStorage.getItem('hotelCities') != null) {
                    this.hotelCities = JSON.parse(localStorage.getItem('hotelCities'));
                    this.hotelCityElement.nativeElement.value = currentValue;
                    this.hotelCityElement.nativeElement.disabled = false;
                    clearInterval(intervalHotelCity);
                }
            }, 1000);
        } else {
            this.hotelCities = JSON.parse(localStorage.getItem('hotelCities'));
        }
    }

    check(element) {
        if (element === 'Departure1') {
            const currentValue = this.departureCityElement1.nativeElement.value;
            if (currentValue === '') {
                this.airports = this.popularAirports;
            } else {
                this.checkForAirportList(element);
            }
        }

        if (element === 'Destination1') {
            const currentValue = this.destinationCityElement1.nativeElement.value;
            if (currentValue === '') {
                this.airports = this.popularAirports;
            } else {
                this.checkForAirportList(element);
            }
        }

        if (element === 'Departure2') {
            const currentValue = this.departureCityElement2.nativeElement.value;
            if (currentValue === '') {
                this.airports = this.popularAirports;
            } else {
                this.checkForAirportList(element);
            }
        }

        if (element === 'Destination2') {
            const currentValue = this.destinationCityElement2.nativeElement.value;
            if (currentValue === '') {
                this.airports = this.popularAirports;
            } else {
                this.checkForAirportList(element);
            }
        }
    }

    checkForAirportList(element) {
        if (element === 'Departure1') {
            const currentValue = this.departureCityElement1.nativeElement.value;
            if (JSON.parse(localStorage.getItem('airports')) == null) {
                const intervalAirport = setInterval(() => {
                    this.departureCityElement1.nativeElement.value = 'Loading...';
                    this.departureCityElement1.nativeElement.disabled = true;
                    if (JSON.parse(localStorage.getItem('airports')) != null) {
                        this.airports = JSON.parse(localStorage.getItem('airports'));
                        this.departureCityElement1.nativeElement.value = currentValue;
                        this.departureCityElement1.nativeElement.disabled = false;
                        clearInterval(intervalAirport);
                    }
                }, 1000);
            }
        } else {
            this.airports = JSON.parse(localStorage.getItem('airports'));
        }

        if (element === 'Destination1') {
            const currentValue = this.destinationCityElement1.nativeElement.value;
            if (JSON.parse(localStorage.getItem('airports')) == null) {
                const intervalAirport = setInterval(() => {
                    this.destinationCityElement1.nativeElement.value = 'Loading...';
                    this.destinationCityElement1.nativeElement.disabled = true;
                    if (JSON.parse(localStorage.getItem('airports')) != null) {
                        this.airports = JSON.parse(localStorage.getItem('airports'));
                        this.destinationCityElement1.nativeElement.value = currentValue;
                        this.destinationCityElement1.nativeElement.disabled = false;
                        clearInterval(intervalAirport);
                    }
                }, 1000);
            }
        } else {
            this.airports = JSON.parse(localStorage.getItem('airports'));
        }

        if (element === 'Departure2') {
            const currentValue = this.departureCityElement2.nativeElement.value;
            if (JSON.parse(localStorage.getItem('airports')) == null) {
                const intervalAirport = setInterval(() => {
                    this.departureCityElement2.nativeElement.value = 'Loading...';
                    this.departureCityElement2.nativeElement.disabled = true;
                    if (JSON.parse(localStorage.getItem('airports')) != null) {
                        this.airports = JSON.parse(localStorage.getItem('airports'));
                        this.departureCityElement2.nativeElement.value = currentValue;
                        this.departureCityElement2.nativeElement.disabled = false;
                        clearInterval(intervalAirport);
                    }
                }, 1000);
            }
        } else {
            this.airports = JSON.parse(localStorage.getItem('airports'));
        }

        if (element === 'Destination2') {
            const currentValue = this.destinationCityElement2.nativeElement.value;
            if (JSON.parse(localStorage.getItem('airports')) == null) {
                const intervalAirport = setInterval(() => {
                    this.destinationCityElement2.nativeElement.value = 'Loading...';
                    this.destinationCityElement2.nativeElement.disabled = true;
                    if (JSON.parse(localStorage.getItem('airports')) != null) {
                        this.airports = JSON.parse(localStorage.getItem('airports'));
                        this.destinationCityElement2.nativeElement.value = currentValue;
                        this.destinationCityElement2.nativeElement.disabled = false;
                        clearInterval(intervalAirport);
                    }
                }, 1000);
            }
        } else {
            this.airports = JSON.parse(localStorage.getItem('airports'));
        }

    }

    typeaheadOnSelect(e: TypeaheadMatch, type: string): void {
        if (type === 'Departure') {
            this.departureAirport = e.item;
        }
        if (type === 'Destination') {
            this.destinationAirport = e.item;
        }
    }

    typeaheadOnSelectH(e: TypeaheadMatch): void {
        this.hotelCity = e.item;
    }

    searchHotel() {
        const hotelSearch = new HotelSearch();
        hotelSearch.checkInDate = this.formatHotelDate(this.checkinDate);
        hotelSearch.checkOutDate = this.formatHotelDate(this.checkoutDate);
        hotelSearch.city = this.hotelCity;
        hotelSearch.cityCode = this.hotelCity.code;
        hotelSearch.numberOfRooms = this.noOfRooms;
        hotelSearch.roomDetailList = this.roomDetailLists;
        hotelSearch.checkinDateDisplay = this.formatDate3(hotelSearch.checkInDate);
        hotelSearch.checkoutDateDisplay = this.formatDate3(hotelSearch.checkOutDate);
        this.spinner.show();
        this.localService.postRequest(hotelSearch, this.localService.SEARCH_HOTELS).subscribe(
            hotel => {
                sessionStorage.setItem('hotels', JSON.stringify(hotel.data));
                sessionStorage.setItem('hotelSearch', JSON.stringify(hotelSearch));
                this.spinner.hide();
                sessionStorage.setItem('viewHotelSearchResult', 'true');
                this.router.navigate(['/hotel_search_result']);
            },
            error => {
                console.log(error);
                this.spinner.hide();
                this.showModal();
            });
    }

    bookTopDeal(deal: TopDeal) {
        let tripTypeString = '';
        const flightSearch = new FlightDataSearch();
        const flightItineraryDetails = flightSearch.flightItineraryDetail;
        flightSearch.ticketClass = this.getReverseTicketClass(deal.cabinClassType);
        flightSearch.tripType = deal.tripType;
        flightSearch.travellerDetail = {
            adults: deal.numberOfAdult, children: deal.numberOfChildren,
            infants: deal.numberOfInfant
        };
        if (deal.tripType === 1) {
            tripTypeString = 'One-way Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: deal.originAirportCode,
                destinationAirportCode: deal.destinationAirportCode, departureDate: this.formatFlightDate(deal.departureDate)
            });
            const flightHeader = {
                departureAirport: deal.originAirportName, destinationAirport: deal.destinationAirportName,
                totalTravelers: deal.numberOfAdult + deal.numberOfChildren + deal.numberOfInfant, ticketClass: deal.cabinClassType,
                depatureDate: deal.departureDate, arrivalDate: deal.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        if (deal.tripType === 2) {
            tripTypeString = 'Round Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: deal.originAirportCode,
                destinationAirportCode: deal.destinationAirportCode, departureDate: this.formatFlightDate(deal.departureDate)
            });
            flightSearch.flightItineraryDetail.push({
                originAirportCode: deal.destinationAirportCode,
                destinationAirportCode: deal.originAirportCode, departureDate: this.formatFlightDate(deal.returnDate)
            });
            const flightHeader = {
                departureAirport: deal.originAirportName, destinationAirport: deal.destinationAirportName,
                totalTravelers: deal.numberOfAdult + deal.numberOfChildren + deal.numberOfInfant, ticketClass: deal.cabinClassType,
                depatureDate: deal.departureDate, arrivalDate: deal.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        this.spinner.show();
        this.TBservice.postRequest(flightSearch, this.TBservice.PROCESS_FLIGHT_SEARCH).subscribe(
            flight => {
                if (flight.status === 0) {
                    sessionStorage.setItem('flight', JSON.stringify(flight.data));
                    flightSearch.flightItineraryDetail = flightItineraryDetails;
                    sessionStorage.setItem('flightSearch', JSON.stringify(flightSearch));
                    this.spinner.hide();
                    sessionStorage.setItem('viewFlightSearchResult', 'true');
                    this.router.navigate(['/flight_search_result']);
                }
            },
            error => {
                console.log(error);
                this.spinner.hide();
                this.showModal();
            });
    }

    searchFlight(tripType: string) {
        let tripTypeString = '';
        const flightSearch = new FlightDataSearch();
        const flightItineraryDetails = flightSearch.flightItineraryDetail;
        flightSearch.ticketClass = parseInt(this.seatclass, 10);
        flightSearch.tripType = parseInt(tripType, 10);
        flightSearch.travellerDetail = {
            adults: this.adultTraveller, children: this.childTraveller,
            infants: this.infantTraveller
        };
        if (tripType === '1') {
            tripTypeString = 'One-way Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.departureAirport.iataCode,
                destinationAirportCode: this.destinationAirport.iataCode, departureDate: this.formatFlightDate(this.departureDate)
            });
            const flightHeader = {
                departureAirport: this.departureAirport, destinationAirport: this.destinationAirport,
                totalTravelers: this.getTotalTraveller(), ticketClass: this.getTicketClass(flightSearch.ticketClass),
                depatureDate: this.departureDate, arrivalDate: this.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        if (tripType === '2') {
            tripTypeString = 'Round Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.departureAirport.iataCode,
                destinationAirportCode: this.destinationAirport.iataCode, departureDate: this.formatFlightDate(this.departureDate)
            });
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.destinationAirport.iataCode,
                destinationAirportCode: this.departureAirport.iataCode, departureDate: this.formatFlightDate(this.returnDate)
            });
            const flightHeader = {
                departureAirport: this.departureAirport, destinationAirport: this.destinationAirport,
                totalTravelers: this.getTotalTraveller(), ticketClass: this.getTicketClass(flightSearch.ticketClass),
                depatureDate: this.departureDate, arrivalDate: this.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        if (tripType === '3') {
            const index = this.multipleDest.length - 1;
            tripTypeString = 'Multi Trip';
            for (const m of this.multipleDest) {
                flightSearch.flightItineraryDetail.push({
                    originAirportCode: m.departureAirport.iataCode,
                    destinationAirportCode: m.arrivalAirport.iataCode, departureDate: this.formatFlightDate(m.departureDate)
                });
            }
            const flightHeader = {
                departureAirport: this.multipleDest[0].departureAirport,
                destinationAirport: this.multipleDest[index].arrivalAirport,
                totalTravelers: this.getTotalTraveller(), ticketClass: this.getTicketClass(flightSearch.ticketClass),
                depatureDate: this.departureDate, arrivalDate: this.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
            sessionStorage.setItem('multipleDest', JSON.stringify(this.multipleDest));
        }
        this.spinner.show();
        this.TBservice.postRequest(flightSearch, this.TBservice.PROCESS_FLIGHT_SEARCH).subscribe(
            flight => {
                if (flight.status === 0) {
                    this.spinner.hide();
                    sessionStorage.setItem('flight', JSON.stringify(flight.data));
                    flightSearch.flightItineraryDetail = flightItineraryDetails;
                    sessionStorage.setItem('flightSearch', JSON.stringify(flightSearch));
                    sessionStorage.setItem('viewFlightSearchResult', 'true');
                    this.router.navigate(['/flight_search_result']);
                }
            },
            error => {
                console.log(error);
                this.spinner.hide();
                this.showModal();
            });
    }

    visaRequestSubmit() {
        this.visaRequest.departureDate = new Date(this.formatDate2(this.visaDepartureDate));
        this.visaRequest.returnDate = new Date(this.formatDate2(this.visaReturnDate));

        if (JSON.parse(localStorage.getItem('user')) != null) {
            const user: User = JSON.parse(localStorage.getItem('user'));
            this.visaRequest.requestById = user.id.toString();
        } else {
            this.visaRequest.requestById = '';
        }
        console.log(JSON.stringify(this.visaRequest));
        this.spinner.show();
        this.localService.postRequest(this.visaRequest, this.localService.VISA_REQUEST).subscribe(
            data => {
                this.spinner.hide();
                alert('Visa request was successful');
                this.visaRequest = new VisaRequest();
                this.visaDepartureDate = '';
                this.visaReturnDate = '';
            },
            error => {
                console.log(error);
            });
    }

    formatDepartureDate() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        this.minDepartureDate = d;
        this.maxDepartureDate = new Date(year + 1, month, day);
        this.minReturnDate = d;
        this.maxReturnDate = new Date(year + 1, month, day);
    }

    formatReturnDate(departureDate: string) {
        const msec = Date.parse(departureDate);
        const dd = new Date(msec);
        const year = dd.getFullYear();
        const month = dd.getMonth();
        const day = dd.getDate();
        this.minReturnDate = new Date(year, month, day + 1);
        this.maxReturnDate = new Date(year + 1, month, day);
    }

    formatVisaReturnDate(departureDate: string) {
        const msec = Date.parse(departureDate);
        const dd = new Date(msec);
        const year = dd.getFullYear();
        const month = dd.getMonth();
        const day = dd.getDate();
        this.minVisaReturnDate = new Date(year, month, day + 1);
        this.maxVisaReturnDate = new Date(year + 2, month, day);
    }

    formatHotelDate(date: string): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('YYYY-MM-DD');
        return d;
    }

    formatFlightDate(date: string): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('DD/MM/YYYY');
        return d;
    }

    formatDate2(date: string): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('MM/DD/YYYY');
        return d;
    }

    formatDate3(date) {
        const a = moment(date, 'YYYY-MM-DD').valueOf();
        const d = moment(a).format('MMM DD, YYYY');
        return d.toString();
    }

    getTicketClass(ticketClass: number): string {
        if (ticketClass === 1) {
            return 'Economy';
        } else if (ticketClass === 2) {
            return 'Premium';
        } else if (ticketClass === 3) {
            return 'Business';
        } else {
            return 'First Class';
        }
    }

    getReverseTicketClass(ticketClass: string): number {
        if (ticketClass === 'Economy') {
            return 1;
        } else if (ticketClass === 'Premium') {
            return 2;
        } else if (ticketClass === 'Business') {
            return 3;
        } else {
            return 4;
        }
    }

    getTotalTraveller(): string {
        let totalTraveller = this.adultTraveller + ' adult';
        if (this.childTraveller > 0) {
            totalTraveller = totalTraveller + ', ' + this.childTraveller + ' child';
        }

        if (this.infantTraveller > 0) {
            totalTraveller = totalTraveller + ', ' + this.infantTraveller + ' infant ';
        }

        return totalTraveller;
    }

    addDestination() {
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
    }

    removeDestination() {
        this.multipleDest.pop();
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

    sessionConfig() {
        sessionStorage.clear();
        sessionStorage.setItem('viewFlightSearchResult', 'false');
        sessionStorage.setItem('viewFlightDetail', 'false');
        sessionStorage.setItem('viewFlightPayment', 'false');
        sessionStorage.setItem('viewHotelPayment', 'false');
        sessionStorage.setItem('viewHotelSearchResult', 'false');
        sessionStorage.setItem('viewHotelRooms', 'false');
        sessionStorage.setItem('viewHotelDetails', 'false');
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2);
        return parseInt(result, 10);
    }

    formatTopDealDate(date: string) {
        const d = moment(date, 'DD/MM/YYYY').format('MMM DD');
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

    add(name: string) {
        this.travellerAlert = '';
        this.checkMaxTravellers(name);
    }

    minus(name: string) {
        this.travellerAlert = '';
        if (name === 'Adult') {
            this.checkInfantAdultRatio(name);
        }

        if (name === 'Child') {
            this.childTraveller--;
            this.minusTotalTraveller();
        }

        if (name === 'Infant') {
            this.infantTraveller--;
            this.minusTotalTraveller();
        }

    }

    addTotalTraveller() {
        this.totalTraveller++;
    }

    minusTotalTraveller() {
        this.totalTraveller--;
    }

    checkMaxTravellers(name: string) {
        if (this.totalTraveller === 9) {
            this.travellerAlert = 'The maximum number of travellers allowed is 9';
            console.log('The maximum number of travellers allowed is 9');
        } else {
            if (name === 'Adult') {
                this.checkAdultMax();
            }

            if (name === 'Child') {
                this.checkChildMax();
            }

            if (name === 'Infant') {
                this.checkInfantAdultRatio(name);
            }
        }
    }

    checkAdultMax() {
        if (this.adultTraveller === 5) {
            this.travellerAlert = 'The maximum number of adult travellers allowed is 5';
            console.log('The maximum number of adult travellers allowed is 5');
        } else {
            this.adultTraveller = this.adultTraveller + 1;
            this.addTotalTraveller();
        }
    }

    checkChildMax() {
        if (this.childTraveller === 5) {
            this.travellerAlert = 'The maximum number of child travellers allowed is 5';
            console.log('The maximum number of child travellers allowed is 5');
        } else {
            this.childTraveller = this.childTraveller + 1;
            this.addTotalTraveller();
        }
    }

    checkInfantAdultRatio(name) {
        if (this.adultTraveller === this.infantTraveller) {
            this.travellerAlert = 'The number of Infants cannot exceed the number of adults. Ratio is 1:1.';
            console.log('The number of Infants cannot exceed the number of adults. Ratio is 1:1.');
        } else {
            if (name === 'Adult') {
                this.adultTraveller = this.adultTraveller - 1;
                this.minusTotalTraveller();
            }
            if (name === 'Infant') {
                this.infantTraveller = this.infantTraveller + 1;
                this.addTotalTraveller();
            }
        }
    }

    populatePopularAirports() {
        const airport1 = new Airport();
        airport1.city = 'Lagos';
        airport1.country = 'Nigeria';
        airport1.iataCode = 'LOS';
        airport1.name = 'Murtala Muhammed';
        airport1.displayName = 'Murtala Muhammed(L0S), Lagos';
        this.popularAirports.push(airport1);

        const airport2 = new Airport();
        airport2.city = 'Johannesburg';
        airport2.country = 'South Africa';
        airport2.iataCode = 'JNB';
        airport2.name = 'O. R. Tambo International Airport';
        airport2.displayName = 'O. R. Tambo International Airport(JNB), Johannesburg';
        this.popularAirports.push(airport2);

        const airport3 = new Airport();
        airport3.city = 'London';
        airport3.country = 'United Kingdom';
        airport3.iataCode = 'LHR';
        airport3.name = 'Heathrow';
        airport3.displayName = 'Heathrow(LHR), London';
        this.popularAirports.push(airport3);

        const airport4 = new Airport();
        airport4.city = 'Abuja';
        airport4.country = 'Nigeria';
        airport4.iataCode = 'ABV';
        airport4.name = 'Nnamdi Azikiwe International Airport';
        airport4.displayName = 'Nnamdi Azikiwe International Airport(ABV), Abuja';
        this.popularAirports.push(airport4);

        const airport5 = new Airport();
        airport5.city = 'Dubai';
        airport5.country = 'United Arab Emirates';
        airport5.iataCode = 'DXB';
        airport5.name = 'Dubai';
        airport5.displayName = 'Dubai(DXB), Dubai';
        this.popularAirports.push(airport5);
    }

    subscribe() {
        const user: User = new User();
        user.email = this.subscribeEmail;
        this.localService.postRequest(user, this.localService.SUBSCRIBE_EMAIL).subscribe(
            data => {
                this.subscribeEmail = '';
            },
            error => {
                console.log(error);
                this.subscribeEmail = '';
            });
    }


}
