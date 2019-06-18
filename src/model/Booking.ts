import { ReservationOwner } from './reservationowner';
import { PricedItineraries } from './pricedItineraries';
import { FlightDataSearch } from './FlightDataSearch';

export class Booking {
    public reservationType: string;
    public amount: number;
    public title: string;
    public description: string;
    public reservationOwner: ReservationOwner;
    public checkinDate: string;
    public checkoutDate: string;
    public hotelLocation: string;
    public ticketLimitTime: string;
    public travellers: ReservationOwner[] = [];
    public status: string;
    public message: string;
    public referenceNumber: string;
    public bookingNumber: string;
    public departureDate: string;
    public arrivalDate: string;
    public portalUsername: string;
    public flightDetails: PricedItineraries;
    public flightSearch: FlightDataSearch;
    public flightSummary: string;

    constructor(
    ) { }


}