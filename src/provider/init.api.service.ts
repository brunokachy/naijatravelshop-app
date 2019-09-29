import { Injectable } from '@angular/core';
import * as sha1 from 'js-sha1';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenObject } from '../model/TokenObject';
import { ApiResponse } from '../model/ApiResponse';
import { InitModel } from '../model/InitModel';
import { Country } from '../model/Country';
import { AfilliateDetails } from '../model/AffiliateDetails';
import { FlwAccountDetails } from '../model/FlwAccountDetail';
import { Airport } from '../model/Airport';
import { HotelCity } from '../model/HotelCity';
import { TopDeal } from '../model/TopDeals';

@Injectable({
    providedIn: 'root'
})

export class InitAPIService {
    initModel: InitModel = new InitModel();
    constructor(private httpClient: HttpClient) { }
    private naijaTravelShopAPIBaseURL = window.location.origin + '/naijatravelshop/api/';
    // private naijaTravelShopAPIBaseURL = 'http://localhost:8080/naijatravelshop/api/';
    private GET_BASE_URL = this.naijaTravelShopAPIBaseURL + 'admin/get_base_url';
    private GET_AFFILIATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'admin/get_affiliate_account_details';
    private GET_FLUTTERWAVE_ACCOUNT_DETAILS = this.naijaTravelShopAPIBaseURL + 'payment/get_flw_account_details';
    private GET_ALL_AIRPORTS = this.naijaTravelShopAPIBaseURL + 'flight/fetch_airports';
    private GET_ALL_HOTEL_CITIES = this.naijaTravelShopAPIBaseURL + 'hotel/fetch_hotel_cities';
    private GET_COUNTRIES = 'get-countries';
    public CREATE_FLIGHT_TOP_DEALS = 'flight/get-top-deals';

    makeInitCall() {
        const getBaseURL = () => {
            return new Promise((resolve) => {
                this.httpClient.get(this.GET_BASE_URL).subscribe(data => {
                    const baseResponse: string = JSON.stringify(data);
                    const baseUrl: ApiResponse<string> = JSON.parse(baseResponse);
                    this.initModel.apiURL = baseUrl.data;
                    resolve();
                }, error => {
                    console.log(error);
                });
            });
        };

        const getAffiliateAccount = () => {
            return new Promise((resolve) => {
                this.httpClient.get(this.GET_AFFILIATE_ACCOUNT).subscribe(data => {
                    const affiliateDetailResponse: string = JSON.stringify(data);
                    const affiliateDetail: ApiResponse<AfilliateDetails> = JSON.parse(affiliateDetailResponse);
                    this.initModel.affilateDetail = affiliateDetail.data;
                    resolve();
                }, error => {
                    console.log(error);
                });
            });
        };

        const getFlutterwaveAccountDetails = () => {
            return new Promise((resolve) => {
                this.httpClient.get(this.GET_FLUTTERWAVE_ACCOUNT_DETAILS).subscribe(data => {
                    const flwAccountResponse: string = JSON.stringify(data);
                    const flwAccount: ApiResponse<FlwAccountDetails> = JSON.parse(flwAccountResponse);
                    this.initModel.flwAccountDetails = flwAccount.data;
                    localStorage.setItem('initModel', JSON.stringify(this.initModel));
                    resolve();
                }, error => {
                    console.log(error);
                });

            });
        };

        const getTopDeals = () => {
            this.postRequest('', this.CREATE_FLIGHT_TOP_DEALS).subscribe(data => {
                const topDealResponseString: string = JSON.stringify(data);
                const topDeals: ApiResponse<TopDeal[]> = JSON.parse(topDealResponseString);
                if (localStorage.getItem('topDeals') != null) {
                    localStorage.removeItem('topDeals');
                }
                localStorage.setItem('topDeals', JSON.stringify(topDeals.data));
            }, error => {
                console.log(error);
            });
        };

        const fetchOtherEntities = () => {
            this.postRequest('', this.GET_COUNTRIES).subscribe(data => {
                const countryResponseString: string = JSON.stringify(data);
                const countries: ApiResponse<Country[]> = JSON.parse(countryResponseString);
                const country = new Country();
                country.capital = 'Abuja';
                country.code = 'NG';
                country.currencyCode = 'NGN';
                country.currencyName = 'NAIRA';
                country.dialingCode = '+234';
                country.isoCode = 'NG';
                country.name = 'NIGERIA';
                countries.data.unshift(country);
                if (localStorage.getItem('countries') != null) {
                    localStorage.removeItem('countries');
                }
                localStorage.setItem('countries', JSON.stringify(countries.data));
            }, error => {
                console.log(error);
            });

            this.httpClient.get(this.GET_ALL_AIRPORTS).subscribe(data => {
                const airportResponse: string = JSON.stringify(data);
                const airport: ApiResponse<Airport[]> = JSON.parse(airportResponse);
                if (localStorage.getItem('airports') != null) {
                    localStorage.removeItem('airports');
                }
                localStorage.setItem('airports', JSON.stringify(airport.data));
            }, error => {
                console.log('Return from fetching airport with error');
                console.log(error);
            });

            this.httpClient.post(this.GET_ALL_HOTEL_CITIES, {}).subscribe(data => {
                const hotelCityResponse: string = JSON.stringify(data);
                const city: ApiResponse<HotelCity[]> = JSON.parse(hotelCityResponse);
                if (localStorage.getItem('hotelCities') != null) {
                    localStorage.removeItem('hotelCities');
                }
                localStorage.setItem('hotelCities', JSON.stringify(city.data));
            }, error => {
                console.log(error);
            });
        };

        getBaseURL().then(getAffiliateAccount).then(getTopDeals).then(getFlutterwaveAccountDetails).then(fetchOtherEntities).catch();
    }

    postRequest(requestData: any, url: string): Observable<any> {
        let token = this.getSavedToken();
        const isValid = this.validateToken(token);
        if (isValid) {
            token = this.getSavedToken().token;
            return this.httpClient
                .post(this.initModel.apiURL + url, requestData, this.header(token));
        } else {
            return this.generateToken(requestData, this.initModel.apiURL + url);
        }
    }

    getRequest(url: string): Observable<any> {
        return this.httpClient.get(url);
    }

    private validateToken(token: { expirationTime: string | number | Date; }): boolean {
        if (token == null) {
            return false;
        }
        const tokenExpirationTime = new Date(token.expirationTime);
        const isValid = new Date().getTime() <= tokenExpirationTime.getTime();
        return isValid;
    }

    private getSavedToken() {
        const token = JSON.parse(localStorage.getItem('token'));
        return token;
    }

    generateToken(requestData: any, url: string) {
        const token = { expirationTime: '', token: '' };
        const verifyURL = this.initModel.apiURL + 'auth/verify-affiliate';
        const data = JSON.stringify({
            affiliateCode: this.initModel.affilateDetail.affiliateCode,
            key: this.initModel.affilateDetail.publicKey,
            hash: sha1(this.initModel.affilateDetail.affiliateCode + this.initModel.affilateDetail.secretKey).toString()
        });

        return this.httpClient
            .post(verifyURL, data, this.header('')).pipe(
                switchMap(tokenResponse => {
                    const tokenString: string = JSON.stringify(tokenResponse);
                    const tokenObject: ApiResponse<TokenObject> = JSON.parse(tokenString);
                    token.expirationTime = tokenObject.data.expirationTime;
                    token.token = tokenObject.data.token;
                    localStorage.setItem('token', JSON.stringify(token));
                    return this.httpClient
                        .post(url, requestData, this.header(token.token));
                }));
    }

    private header(token: string): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: token
            })
        };
        return httpOptions;
    }
}
