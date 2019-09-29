import { HotelCity } from './HotelCity';
import { RoomDetailList } from './RoomDetailList';

export class HotelSearch {
    constructor(
    ) { }

    public city: HotelCity;
    public cityCode: string;
    public checkInDate: string;
    public checkOutDate: string;
    public checkinDateDisplay: string;
    public checkoutDateDisplay: string;
    public numberOfRooms: number;
    public roomDetailList: RoomDetailList[] = [];
    public adultCount: number;
    public childCount: number;
}
