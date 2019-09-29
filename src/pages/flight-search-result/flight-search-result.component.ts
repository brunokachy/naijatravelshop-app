import { Component, TemplateRef } from '@angular/core';
import { Flight } from '../../model/flight';
import { PricedItineraries } from '../../model/pricedItineraries';
import * as moment from 'moment';
import { OriginDestinationOptions } from '../../model/originDestinationOptions';
import { BsModalService, BsModalRef, TypeaheadMatch } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { FlightDataSearch } from '../../model/FlightDataSearch';
import { NgxSpinnerService } from 'ngx-spinner';
import { Country } from '../../model/Country';
import { TravelbetaAPIService } from '../../provider/travelbeta.api.service';
import { Airport } from '../../model/Airport';


@Component({
    moduleId: module.id,
    selector: 'flight_search_result',
    templateUrl: 'flight-search-result.component.html',
    styleUrls: ['flight-search-result.component.scss']
})
export class FlightSearchResultComponent {
    flight: Flight;
    pricedItineraries: PricedItineraries[] = [];
    modalRef: BsModalRef;
    config = {
        //animated: false,
        //  backdrop: 'static'
    };
    pricedItinerary: PricedItineraries;
    originDestinationOptions: OriginDestinationOptions[] = [];
    flightHeader: any;

    minDepartureDate: Date;
    maxDepartureDate: Date;
    minReturnDate: Date;
    maxReturnDate: Date;
    departureDate = '';
    returnDate = '';

    airports: Airport[] = [];
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
    flightSearch: any;
    multipleDest: { 'departureAirport': Airport, 'arrivalAirport': Airport, 'departureDate': string }[] = [];

    isOpen = true;

    airlines: { 'name': string, 'code': string, 'minPrice': number }[] = [];

    sortValue = 'Lowest Price';

    stops = -1;
    airline: { 'name': string, 'code': string, 'minPrice': number } = { name: 'SHOW ALL', code: '', minPrice: 0 };

    constructor(private modalService: BsModalService, private travelbetaAPIService: TravelbetaAPIService, private router: Router,
        private spinnerService: NgxSpinnerService) {
        this.flight = JSON.parse(sessionStorage.getItem('flight'));
        this.flightHeader = JSON.parse(sessionStorage.getItem('flightHeader'));
        this.airports = JSON.parse(localStorage.getItem('airports'));
        this.popluateFlights();
        this.getAirlineList();
    }

    popluateFlights() {
        this.pricedItineraries = [];
        for (const a of this.flight.airlineItineraries) {
            for (const b of a.pricedItineraries) {
                this.pricedItineraries.push(b);
            }
        }
        this.sort();
    }

    sort() {
        if (this.sortValue === 'Lowest Price') {
            this.pricedItineraries.sort((obj1, obj2) => {
                return obj1.totalFare - obj2.totalFare;
            });
        }
        if (this.sortValue === 'Highest Price') {
            this.pricedItineraries.sort((obj1, obj2) => {
                return obj2.totalFare - obj1.totalFare;
            });
        }
        if (this.sortValue === 'Earliest Departure') {
            this.pricedItineraries.sort((obj1, obj2) => {
                const a = moment(obj1.originDestinationOptions[0].flightSegments[0].departureTime, 'dd/MM/YYYY HH:mm').valueOf();
                const b = moment(obj2.originDestinationOptions[0].flightSegments[0].departureTime, 'dd/MM/YYYY HH:mm').valueOf();
                return a - b;
            });
        }

        if (this.sortValue === 'Latest Departure') {
            this.pricedItineraries.sort((obj1, obj2) => {
                const a = moment(obj1.originDestinationOptions[0].flightSegments[0].departureTime, 'dd/MM/YYYY HH:mm').valueOf();
                const b = moment(obj2.originDestinationOptions[0].flightSegments[0].departureTime, 'dd/MM/YYYY HH:mm').valueOf();
                return b - a;
            });
        }
    }


    selectFlight(pricedItineraries: PricedItineraries) {
        sessionStorage.setItem('pricedItineraries', JSON.stringify(pricedItineraries));
        sessionStorage.setItem('viewFlightDetail', 'true');
        this.router.navigate(['/flight_detail']);
    }

    formatDate(date: string) {
        const d = moment(date, 'dd/MM/YYYY HH:mm').format('HH:mm');
        return d;
    }

    formatStops(stops: number) {
        if (stops === 0) {
            return 'Non-stop';
        }
        if (stops === 1) {
            return '1 stop';
        }
        if (stops > 1) {
            return '2+ stops';
        }
    }

    formatFlightLocation(name) {
        name = name.substr(0, name.indexOf('-'));
        return name;
    }
    formatFlightCountry(name) {
        name = name.substring(name.indexOf(',') + 1);
        return name;
    }

    formatTime(originDestinationOptions: OriginDestinationOptions[]) {
        let h = 0;
        let m = 0;
        for (const o of originDestinationOptions) {
            for (const ff of o.flightSegments) {
                h = h + parseInt(moment(ff.journeyDuration, 'HH:mm').format('H'));
                m = m + parseInt(moment(ff.journeyDuration, 'HH:mm').format('mm'));
            }
        }

        h = h + m / 60 | 0;
        const mins = m % 60 | 0;
        let hString = h + ' hour';
        let mString = mins + ' min';
        if (h > 1) {
            hString = h + ' hours';
        }

        if (mins > 1) {
            mString = mins + ' mins';
        }
        const duration = hString + ', ' + mString;
        return duration;
    }

    formatTime3(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('HH:mm');
        return d;
    }

    formatCurrency(amount: number) {
        const str = amount.toString();
        const result = str.slice(0, -2) + '.' + str.slice(-2);
        return parseInt(result);
    }

    formatSegmentDuration(o: OriginDestinationOptions) {
        let h = 0;
        let m = 0;
        let index = 1;
        for (const oo of o.flightSegments) {
            const hh = moment(oo.journeyDuration, 'HH:mm').format('HH');
            const mm = moment(oo.journeyDuration, 'HH:mm').format('mm');

            if (o.flightSegments[index] != null) {
                const a = moment(oo.arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
                const b = moment(o.flightSegments[index].departureTime, 'DD/MM/YYYY HH:mm').valueOf();
                const c: number = b - a;
                const tempTime = moment.duration(c);
                h = h + tempTime.hours();
                m = m + tempTime.minutes();
            }
            h = h + parseInt(hh);
            m = m + parseInt(mm);
            index++;
        }
        if (m >= 60) {
            h = h + 1;
            m = m - 60;
        }
        const hString = h + 'h';
        const mString = m + 'm';
        const duration = hString + ' ' + mString;
        return duration;

    }

    formatTime2(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('HH:mm');
        return d;
    }

    formatDate2(date: string) {
        const d = moment(date, 'DD/MM/YYYY HH:mm').format('DD MMM YY');
        return d;
    }

    formateDate3(checkinDate) {
        const msec = Date.parse(checkinDate);
        const d = moment(msec).format('MMM DD, YYYY');
        if (d === 'Invalid date') {
            return checkinDate;
        }
        return d;
    }

    formatDate4(date): string {
        const dd = moment(date, 'DD/MM/YYYY').toString();
        const msec = Date.parse(dd);
        const d = moment(msec).format('ddd Do MMM, YYYY');
        return d;
    }

    formatDate5(date): string {
        const dd = moment(date, 'ddd Do MMM, YYYY').toString();
        const msec = Date.parse(dd);
        const d = moment(msec).format('DD/MM/YYYY');
        return d;
    }

    calculateLayoverTime(arrivalTime: string, departureTime: string) {
        const a = moment(arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
        const b = moment(departureTime, 'DD/MM/YYYY HH:mm').valueOf();
        const c: number = b - a;
        const tempTime = moment.duration(c);
        return tempTime.hours() + 'h ' + tempTime.minutes() + 'm';
    }

    formatDuration(departureTime: string, arrivalTime: string) {
        const a = moment(arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
        const b = moment(departureTime, 'DD/MM/YYYY HH:mm').valueOf();
        const c: number = a - b;
        const tempTime = moment.duration(c);
        return tempTime.hours() + 'h ' + tempTime.minutes() + 'm';
    }

    getTotalDuration(pricedItinerary: PricedItineraries) {
        let t1 = 0;
        let t2 = 0;
        for (const o of pricedItinerary.originDestinationOptions) {
            let index = 0;
            for (const oo of o.flightSegments) {
                const d = moment(oo.journeyDuration, 'HH:mm').valueOf();
                t1 = t1 + d;

                if (o.flightSegments[index + 1] != null) {
                    const a = moment(oo.arrivalTime, 'DD/MM/YYYY HH:mm').valueOf();
                    const b = moment(o.flightSegments[index + 1].departureTime, 'DD/MM/YYYY HH:mm').valueOf();
                    const c2: number = b - a;
                    t2 = t2 + c2;
                }
                index++;
            }
        }
        const tempTime3 = moment.duration(t1 + t2);
        return tempTime3.hours() + 'h ' + tempTime3.minutes() + 'm';
    }

    openSearchModal(template: TemplateRef<any>) {
        this.flightSearch = JSON.parse(sessionStorage.getItem('flightSearch'));

        this.departure = this.flightHeader.departureAirport.displayName;
        this.destination = this.flightHeader.destinationAirport.displayName;
        this.departureAirport = this.flightHeader.departureAirport;
        this.destinationAirport = this.flightHeader.destinationAirport;
        this.seatclass = this.flightSearch.ticketClass;
        this.adultTraveller = this.flightSearch.travellerDetail.adults;
        this.childTraveller = this.flightSearch.travellerDetail.children;
        this.infantTraveller = this.flightSearch.travellerDetail.infants;
        this.formatDepartureDate();

        if (JSON.parse(sessionStorage.getItem('multipleDest')) == null) {
            this.populateMultipleDest();
        }
        if (this.flightHeader.tripType === 'One-way Trip') {
            this.departureDate = this.formatDate4(this.flightSearch.flightItineraryDetail[0].departureDate);
        }
        if (this.flightHeader.tripType === 'Round Trip') {
            this.departureDate = this.formatDate4(this.flightSearch.flightItineraryDetail[0].departureDate);
            this.returnDate = this.formatDate4(this.flightSearch.flightItineraryDetail[1].departureDate);
            this.formatReturnDate(this.flightSearch.flightItineraryDetail[0].departureDate);
        }

        if (this.flightHeader.tripType === 'Multi Trip') {
            this.multipleDest = JSON.parse(sessionStorage.getItem('multipleDest'));
            for (const m of this.multipleDest) {
                m.departureDate = this.formatDate4(m.departureDate);
            }
        }
        this.modalRef = this.modalService.show(template, this.config);
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

    checkInput(e) {
        if (e.length > 1) {
            this.getAirports(e);
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

    typeaheadOnSelectM(e: TypeaheadMatch, type: string, index: number): void {
        if (type === 'Departure') {
            this.multipleDest[index].departureAirport = e.item;
        }
        if (type === 'Destination') {
            this.multipleDest[index].arrivalAirport = e.item;
        }
    }

    getAirportCountry(airport: any) {
        this.travelbetaAPIService.postRequest(JSON.stringify({ cityCode: airport.cityCode }), this.travelbetaAPIService.GET_CITY).subscribe(
            city => {
                if (city.status === 0) {
                    const countries: Country[] = JSON.parse(sessionStorage.getItem('countries'));
                    for (const c of countries) {
                        if (c.code === city.data.countryCode) {
                            airport.country = c.name;
                        }
                    }
                }
            });
    }

    getAirports(token: string) {
        const requestData = JSON.stringify({ searchTerm: token, limit: 10 });
        const airports = [];
        this.travelbetaAPIService.postRequest(requestData, this.travelbetaAPIService.GET_AIRPORT_BY_SEARCH_TERM).subscribe(
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

    formatDepartureDate() {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        this.minDepartureDate = d;
        this.maxDepartureDate = new Date(year + 1, month, day);
    }

    formatReturnDate(departureDate) {
        const msec = Date.parse(departureDate);
        const dd = new Date(msec);
        const year = dd.getFullYear();
        const month = dd.getMonth();
        const day = dd.getDate();
        this.minReturnDate = new Date(year, month, day + 1);
        this.maxReturnDate = new Date(year + 1, month, day);
    }

    populateMultipleDest() {
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
        this.multipleDest.push({ departureAirport: null, arrivalAirport: null, departureDate: null });
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
            this.travellerAlert = 'The maximum number of travellers allowed is 9'
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
            this.travellerAlert = 'The maximum number of adult travellers allowed is 5'
        } else {
            this.adultTraveller = this.adultTraveller + 1;
            this.addTotalTraveller();
        }
    }

    checkChildMax() {
        if (this.childTraveller === 5) {
            this.travellerAlert = 'The maximum number of child travellers allowed is 5'
        } else {
            this.childTraveller = this.childTraveller + 1;
            this.addTotalTraveller();
        }
    }

    checkInfantAdultRatio(name) {
        if (this.adultTraveller === this.infantTraveller) {
            this.travellerAlert = 'The number of Infants cannot exceed the number of adults. Ratio is 1:1.'
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

    searchFlight(tripType: string) {
        let tripTypeString = '';
        const flightSearch = new FlightDataSearch();
        const flightItineraryDetails = flightSearch.flightItineraryDetail;
        flightSearch.ticketClass = parseInt(this.seatclass, 10);
        flightSearch.tripType = parseInt(tripType, 10);
        flightSearch.travellerDetail = { adults: this.adultTraveller, children: this.childTraveller, infants: this.infantTraveller };
        if (tripType === '1') {
            tripTypeString = 'One-way Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.departureAirport.iataCode,
                destinationAirportCode: this.destinationAirport.iataCode, departureDate: this.formatDate5(this.departureDate)
            });
            const flightHeader = {
                departureAirport: this.departureAirport,
                destinationAirport: this.destinationAirport, totalTravelers: this.getTotalTraveller(),
                ticketClass: this.getTicketClass(flightSearch.ticketClass), depatureDate: this.departureDate,
                arrivalDate: this.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
        }
        if (tripType === '2') {
            tripTypeString = 'Round Trip';
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.departureAirport.iataCode,
                destinationAirportCode: this.destinationAirport.iataCode, departureDate: this.formatDate5(this.departureDate)
            });
            flightSearch.flightItineraryDetail.push({
                originAirportCode: this.destinationAirport.iataCode,
                destinationAirportCode: this.departureAirport.iataCode, departureDate: this.formatDate5(this.returnDate)
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
                    destinationAirportCode: m.arrivalAirport.iataCode, departureDate: this.formatDate5(m.departureDate)
                });
            }
            const flightHeader = {
                departureAirport: this.multipleDest[0].departureAirport,
                destinationAirport: this.multipleDest[index].arrivalAirport, totalTravelers: this.getTotalTraveller(),
                ticketClass: this.getTicketClass(flightSearch.ticketClass), depatureDate: this.departureDate,
                arrivalDate: this.returnDate, tripType: tripTypeString
            };
            sessionStorage.setItem('flightHeader', JSON.stringify(flightHeader));
            sessionStorage.setItem('multipleDest', JSON.stringify(this.multipleDest));
        }
        this.spinnerService.show();
        this.travelbetaAPIService.postRequest(flightSearch, this.travelbetaAPIService.PROCESS_FLIGHT_SEARCH).subscribe(
            flight => {
                if (flight.status === 0) {
                    this.spinnerService.hide();
                    this.modalRef.hide();
                    this.flightHeader = JSON.parse(sessionStorage.getItem('flightHeader'));
                    sessionStorage.setItem('flight', JSON.stringify(flight.data));
                    this.flight = flight.data;
                    this.popluateFlights();
                    this.getAirlineList();
                    flightSearch.flightItineraryDetail = flightItineraryDetails;
                    sessionStorage.setItem('flightSearch', JSON.stringify(flightSearch));
                    this.flightSearch = flightSearch;
                }
            },
            error => {
                this.spinnerService.hide();
                console.log(error);
            });
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

    getAirlineList() {
        const s: { 'name': string, 'code': string, 'minPrice': number }[] = [];
        for (const b of this.pricedItineraries) {
            s.push({
                name: b.originDestinationOptions[0].flightSegments[0].airlineName,
                code: b.originDestinationOptions[0].flightSegments[0].airlineCode, minPrice: b.totalFare
            });
        }
        this.airlines = this.removeDuplicates(s, 'name');
        this.airlines.pop();

        for (const a of this.airlines) {
            const prices: number[] = [];
            for (const ss of s) {
                if (a.name === ss.name) {
                    prices.push(ss.minPrice);
                }
            }
            const min = Math.min.apply(Math, prices);
            a.minPrice = min;
        }

        // this.airlines.sort(function (a, b) {
        //     const textA = a.name.toUpperCase();
        //     const textB = b.name.toUpperCase();
        //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        // });

        this.airlines.sort((a, b) => {
            const textA = a.minPrice;
            const textB = b.minPrice;
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    removeDuplicates(originalArray, prop) {
        const newArray = [];
        const lookupObject = {};

        for (const i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (const i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    filter() {
        let filtered1: PricedItineraries[] = [];
        const filtered2: PricedItineraries[] = [];
        if (this.airline.name === 'SHOW ALL') {
            this.popluateFlights();
            filtered1 = this.pricedItineraries;
        } else {
            this.popluateFlights();
            for (const f of this.pricedItineraries) {
                if (f.originDestinationOptions[0].flightSegments[0].airlineName === this.airline.name) {
                    filtered1.push(f);
                }
            }

        }

        for (const p of filtered1) {
            if (this.stops !== 2 && this.stops !== -1) {
                if (p.originDestinationOptions[0].stops === this.stops) {
                    filtered2.push(p);
                }
            } else {
                if (p.originDestinationOptions[0].stops >= this.stops) {
                    filtered2.push(p);
                }
            }
        }
        this.pricedItineraries = filtered2;
    }

    selectAirline(airline) {
        if (airline === 0) {
            airline = { name: 'SHOW ALL', code: '', minPrice: 0 };
        }
        this.airline = airline;
        this.filter();
    }

    selectStops(stops: number) {
        this.stops = stops;
        this.filter();
    }
}
