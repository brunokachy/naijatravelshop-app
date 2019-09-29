export class HotelList {
    constructor(
    ) { }
    public hotelId: string;
    public hotelName: string;
    public address: string;
    public rooms: { 'roomPrice': number, 'name': string };

    public rating: string;
    public minimumPrice: number;
    public maximumPrice: number;
    public images: [] = [];
    public facilities: [] = [];

    public fullDescription: string;
    public smallDescription: string;
    public cityName: string;
    public cityCode: string;
    public countryName: string;
    public countryCode: string;
    public lat: string;
    public lng: string;
    public thumbImageURL: string;
}
