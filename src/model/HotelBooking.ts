import { User } from './user';
import { RoomDetailList } from './RoomDetailList';

export class HotelBooking {
    constructor(
    ) { }

    public hotelName: string;
    public hotelId: string;
    public hotelDescription: string;
    public cityName: string;
    public cityCode: string;
    public countryName: string;
    public countryCode: string;
    public roomPrice: number;
    public roomName: string;
    public customerAccount: User;
    public guestInformation: RoomDetailList[] = [];
    public checkInDate: string;
    public checkOutDate: string;
    public nights: number;
    public roomCount: number;
    public adultCount: number;
    public childCount: number;
    public portalUsername: string;
}
