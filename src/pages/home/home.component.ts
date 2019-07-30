import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TypeaheadMatch, ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlightDataSearch } from '../../model/FlightDataSearch';
import { mergeMap, map } from 'rxjs/operators';
import { InitModel } from '../../model/InitModel';
import { Country } from '../../model/Country';
import { VisaRequest } from '../../model/VisaRequest';
import { Observable, of } from 'rxjs';
import { TravelbetaAPIService } from '../../provider/travelbeta.api.service';
import { LocalAPIService } from '../../provider/local.api.service';
import { User } from '../../model/user';


@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {
    initModel: InitModel = new InitModel();

    constructor(private TBservice: TravelbetaAPIService, private router: Router,
        private spinner: NgxSpinnerService, private localService: LocalAPIService) {
        localStorage.clear();

        const interval = setInterval(() => {
            if (JSON.parse(sessionStorage.getItem('initModel')) != null) {
                this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
                this.countries = this.initModel.countries;
                clearInterval(interval);
            }
        }, 1000);

        setInterval(() => {
            if (this.searchTerm === '') {
                this.airports = [];
            } else {
                this.getAirports(this.searchTerm);
            }
        }, 1000);

        this.formatDepartureDate();
        this.populateMultipleDest();
        this.datasource = Observable.create((observer: any) => {
            // Runs on every search
            observer.next(this.airports);
        }).pipe(
            mergeMap((token: string) => of(this.airports))
        );

        localStorage.setItem('viewFlightSearchResult', 'false');
        localStorage.setItem('viewFlightDetail', 'false');
        localStorage.setItem('viewFlightPayment', 'false');
        localStorage.setItem('viewHotelPayment', 'false');
        localStorage.setItem('viewHotelSearchResult', 'false');
        localStorage.setItem('viewHotelRoom', 'false');
        localStorage.setItem('viewHotelDetails', 'false');
    }

    minDepartureDate: Date;
    maxDepartureDate: Date;
    minReturnDate: Date;
    maxReturnDate: Date;
    departureDate = '';
    returnDate = '';

    departureCity: string;
    destinationCity: string;
    airports: any[] = [];
    departureAirport: any;
    destinationAirport: any;
    datasource: Observable<any> = of([]);

    adultTraveller = 1;
    childTraveller = 0;
    infantTraveller = 0;
    totalTraveller = 1;
    travellerAlert = '';
    tripType = '2';
    seatclass = '1';
    multipleDest: { 'departureAirport': any, 'arrivalAirport': any, 'departureDate': string }[] = [];

    countries: Country[] = [];

    minVisaReturnDate: Date;
    maxVisaReturnDate: Date;
    visaDepartureDate = '';
    visaReturnDate = '';
    visaRequest: VisaRequest = new VisaRequest();

    selected = '';
    cities: string[] = [];
    searchTerm = '';

    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;

    populateMultipleDest() {
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
    }

    typeaheadOnSelectM(e: TypeaheadMatch, type: string, index: number): void {
        if (type === 'Departure') {
            this.multipleDest[index].departureAirport = e.item;
            this.getAirportCountry(this.multipleDest[index].departureAirport);
        }
        if (type === 'Destination') {
            this.multipleDest[index].arrivalAirport = e.item;
            this.getAirportCountry(this.multipleDest[index].arrivalAirport);
        }
    }

    getAirportCountry(airport: any) {
        this.TBservice.postRequest(JSON.stringify({ cityCode: airport.cityCode }), this.TBservice.GET_CITY).subscribe(
            city => {
                if (city.status === 0) {
                    const countries = this.initModel.countries;
                    for (const c of countries) {
                        if (c.code === city.data.countryCode) {
                            airport.country = c.name;
                        }
                    }
                }
            });
    }

    typeaheadOnSelect(e: TypeaheadMatch, type: string): void {
        if (type === 'Departure') {
            this.departureAirport = e.item;
            this.getAirportCountry(this.departureAirport);

        }
        if (type === 'Destination') {
            this.destinationAirport = e.item;
            this.getAirportCountry(this.destinationAirport);
        }
    }

    searchHotel() {
        localStorage.setItem('viewHotelSearchResult', 'true');
        this.router.navigate(['/hotel_search_result']);
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
                destinationAirportCode: this.destinationAirport.iataCode, departureDate: this.formatDate(this.departureDate)
            });
            const flightHeader = {
                departureAirport: this.departureAirport, destinationAirport: this.destinationAirport,
                totalTravelers: this.getTotalTraveller(), ticketClass: this.getTicketClass(flightSearch.ticketClass),
                depatureDate: this.departureDate, arrivalDate: this.returnDate, tripType: tripTypeString
            };
            localStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        if (tripType === '2') {
            tripTypeString = 'Round Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.departureAirport.iataCode,
                destinationAirportCode: this.destinationAirport.iataCode, departureDate: this.formatDate(this.departureDate)
            });
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.destinationAirport.iataCode,
                destinationAirportCode: this.departureAirport.iataCode, departureDate: this.formatDate(this.returnDate)
            });
            const flightHeader = {
                departureAirport: this.departureAirport, destinationAirport: this.destinationAirport,
                totalTravelers: this.getTotalTraveller(), ticketClass: this.getTicketClass(flightSearch.ticketClass),
                depatureDate: this.departureDate, arrivalDate: this.returnDate, tripType: tripTypeString
            };
            localStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        if (tripType === '3') {
            const index = this.multipleDest.length - 1;
            tripTypeString = 'Multi Trip';
            for (const m of this.multipleDest) {
                flightSearch.flightItineraryDetail.push({
                    originAirportCode: m.departureAirport.iataCode,
                    destinationAirportCode: m.arrivalAirport.iataCode, departureDate: this.formatDate(m.departureDate)
                });
            }
            const flightHeader = {
                departureAirport: this.multipleDest[0].departureAirport,
                destinationAirport: this.multipleDest[index].arrivalAirport,
                totalTravelers: this.getTotalTraveller(), ticketClass: this.getTicketClass(flightSearch.ticketClass),
                depatureDate: this.departureDate, arrivalDate: this.returnDate, tripType: tripTypeString
            };
            localStorage.setItem('flightHeader', JSON.stringify(flightHeader));
            localStorage.setItem('multipleDest', JSON.stringify(this.multipleDest));
        }
        this.spinner.show();
        this.TBservice.postRequest(flightSearch, this.TBservice.PROCESS_FLIGHT_SEARCH).subscribe(
            flight => {
                if (flight.status === 0) {
                    localStorage.setItem('flight', JSON.stringify(flight.data));
                    flightSearch.flightItineraryDetail = flightItineraryDetails;
                    localStorage.setItem('flightSearch', JSON.stringify(flightSearch));
                    this.spinner.hide();
                    localStorage.setItem('viewFlightSearchResult', 'true');
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

        if (JSON.parse(sessionStorage.getItem('user')) != null) {
            const user: User = JSON.parse(sessionStorage.getItem('user'));
            this.visaRequest.requestById = user.id.toString();
        } else {
            this.visaRequest.requestById = '';
        }

        this.spinner.show();
        this.localService.postRequest(this.visaRequest, this.localService.VISA_REQUEST).subscribe(
            data => {
                alert('Visa request was successful');
                this.visaRequest = new VisaRequest();
                this.visaDepartureDate = '';
                this.visaReturnDate = '';
                this.spinner.hide();
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

    formatDate(date: string): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('DD/MM/YYYY');
        return d;
    }

    formatDate2(date: string): string {
        const msec = Date.parse(date);
        const d = moment(msec).format('MM/DD/YYYY');
        return d;
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

    searchMethod(term: string) {
        if (term === '') {
            return of([]);
        }
        const requestData = JSON.stringify({ searchTerm: term, limit: 10 });
        return this.TBservice.postRequest(requestData, this.TBservice.GET_AIRPORT_BY_SEARCH_TERM).pipe(
            map(response => response[1])
        );
    }

    checkInput(e: string) {
        if (e.length > 1) {
            this.searchTerm = e;
        }
    }

    getAirports(token: string) {
        const requestData = JSON.stringify({ searchTerm: token, limit: 10 });
        const airports = [];
        this.TBservice.postRequest(requestData, this.TBservice.GET_AIRPORT_BY_SEARCH_TERM).subscribe(
            data => {
                if (data.status === 0) {
                    for (const u of data.data) {
                        const airport = u;
                        airport.displayName = airport.name + ' (' + airport.cityCode + '), ' + airport.cityName;
                        airports.push(airport);
                        if (airports.length === data.data.length) {
                            this.airports = [];
                            this.airports = airports;
                        }
                    }
                }
            },
            error => {
                console.log(error);
            });
    }

    addDestination() {
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
    }

    removeDestination() {
        this.multipleDest.pop();
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

    checkInfantAdultRatio(name: string) {
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
