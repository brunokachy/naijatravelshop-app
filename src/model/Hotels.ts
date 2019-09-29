import { HotelList } from './hotelList';
export class Hotels {
    constructor(
    ) { }

    public totalResult: number;
    public maximumPrice: number;
    public minimumPrice: number;
    public hotelList: HotelList[] = [];
}
