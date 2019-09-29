import { Injectable } from '@angular/core';
import * as sha1 from 'js-sha1';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenObject } from '../model/TokenObject';
import { ApiResponse } from '../model/ApiResponse';
import { InitModel } from '../model/InitModel';
import { AfilliateDetails } from '../model/AffiliateDetails';
import { FlwAccountDetails } from '../model/FlwAccountDetail';
import { Country } from '../model/Country';
import { reject, resolve } from 'q';

@Injectable({
    providedIn: 'root'
})
export class Service {
    initModel: InitModel = new InitModel();
    constructor(private httpClient: HttpClient) {
        this.getInitModel();
    }

    private locationOrigin = window.location.origin;
   private naijaTravelShopAPIBaseURL = this.locationOrigin + '/naijatravelshop/api/';
    // private naijaTravelShopAPIBaseURL = 'http://localhost:8080/naijatravelshop/api/';

    public CONFIRM_REGISTRATION = this.naijaTravelShopAPIBaseURL + 'confirm_registration';
    public CREATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'admin/create_account';
    public LOGIN = this.naijaTravelShopAPIBaseURL + 'admin/login';
    public BOOK = this.naijaTravelShopAPIBaseURL + 'flight/create_reservation';
    public PAYMENT_VERIFICATION = this.naijaTravelShopAPIBaseURL + 'payment/flw_payment_verification';
    public GET_RECENT_BOOKINGS = this.naijaTravelShopAPIBaseURL + 'admin/get_recent_booking';
    public UPDATE_PROFILE = this.naijaTravelShopAPIBaseURL + 'admin/update_account';
    public CHANGE_PASSWORD = this.naijaTravelShopAPIBaseURL + 'admin/change_password';
    public RESET_PASSWORD = this.naijaTravelShopAPIBaseURL + 'admin/reset_user_password';
    private GET_FLUTTERWAVE_ACCOUNT_DETAILS = this.naijaTravelShopAPIBaseURL + 'payment/get_flw_account_details';
    public GET_AFFILIATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'admin/get_affiliate_account_details';
    public GET_BASE_URL = this.naijaTravelShopAPIBaseURL + 'admin/get_base_url';
    public GET_PORTAL_USERS = this.naijaTravelShopAPIBaseURL + 'admin/get_portal_users';
    public ACTIVATE_USER = this.naijaTravelShopAPIBaseURL + 'admin/reactivate_account';
    public DEACTIVATE_USER = this.naijaTravelShopAPIBaseURL + 'admin/deactivate_account';
    public VISA_REQUEST = this.naijaTravelShopAPIBaseURL + 'flight/create_visa_request';
    public GET_AIRPORT_BY_SEARCH_TERM = 'flight/get-airports-by-search-term';
    public GET_CITY = 'flight/get-city';
    public GET_AIRPORT = 'flight/get-airport';
    public GET_C0UNTRY = 'get-country';
    public GET_COUNTRIES = 'get-countries';
    public PROCESS_FLIGHT_SEARCH = 'flight/process-flight-search';
    public CREATE_AFILLIATE_FLIGHT_BOOKING = 'flight/create-affiliate-booking';
    public CREATE_FLIGHT_TOP_DEALS = 'flight/get-top-deals';
    public CANCEL_RESERVATION = 'flight/cancel-reservation';
    public ISSUE_TICKET = 'affiliate/flight-ticket-issue-request';
    public FLIGHT_RESERVATION_STATUS = 'affiliate/booking/get-flight-reservation-status';
    public GET_FLIGHT_BOOKINGS_BY_SEARCH_TERM = this.naijaTravelShopAPIBaseURL + 'admin/get_flight_bookings_by_search_term';
    public GET_VISA_REQUEST_BY_SEARCH_TERM = this.naijaTravelShopAPIBaseURL + 'admin/get_visa_requests_by_search_term';
    public CHANGE_BOOKING_STATUS = this.naijaTravelShopAPIBaseURL + 'admin/change_booking_status';
    public CHANGE_VISA_REQUEST_STATUS = this.naijaTravelShopAPIBaseURL + 'admin/change_visa_request_status';
    public GET_FLIGHT_RESERVATION_DETAILS = this.naijaTravelShopAPIBaseURL + 'admin/get_flight_reservation_details';

    getInitModel() {
        if (JSON.parse(sessionStorage.getItem('initModel')) != null) {
            this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
        } else {
            this.makeInitCall();
        }
    }

    callAPI(requestData: any, url: string): Observable<any> {
        let token = this.getSavedToken();
        const isValid = this.validateToken(token);
        if (isValid) {
            token = this.getSavedToken().token;
            return this.makeApiRequestWithToken(token, requestData, this.initModel.apiURL + url);
        } else {
            console.log(this.initModel.apiURL);
            return this.makeApiRequest(requestData, this.initModel.apiURL + url);
        }
    }

    callAPII(requestData: any, url: string): Observable<any> {
        return this.httpClient
            .post(url, requestData, this.header(''));
    }

    getAPICall(url: string): Observable<any> {
        return this.httpClient.get(url);
    }

    // testing() {
    //     const verifyURL = this.travelbetaAPIBaseURL + 'auth/verify-affiliate';
    //     const data = JSON.stringify({
    //         affiliateCode: this.affiliateCode,
    //         key: this.affiliatePublicKey, hash: sha1(this.affiliateCode + this.affiliateSecretKey).toString()
    //     });
    //     const req = this.httpClient.post(verifyURL, data)
    //         .subscribe(
    //             (res: TokenObject) => {
    //                 console.log(res.data.token);
    //             },
    //             err => {
    //                 console.log("Error occured");
    //             }
    //         );
    // }



    validateToken(token: { expirationTime: string | number | Date; }): boolean {
        if (token == null) {
            return false;
        }
        const tokenExpirationTime = new Date(token.expirationTime);
        const isValid = new Date().getTime() <= tokenExpirationTime.getTime();
        return isValid;
    }

    getSavedToken() {
        const token = JSON.parse(localStorage.getItem('token'));
        return token;
    }

    makeApiRequestWithToken(token: string, requestData: any, url: string): Observable<any> {
        return this.httpClient
            .post(url, requestData, this.header(token));
    }

    makeApiRequest(requestData: any, url: string) {
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
                    return this.makeApiRequestWithToken(token.token, requestData, url);
                }));
    }

    makeInitCall() {
        const getBaseURL = () => {
            return new Promise((resolve) => {
                this.httpClient.get(this.GET_BASE_URL).subscribe(data => {
                    const baseResponse: string = JSON.stringify(data);
                    const baseUrl: ApiResponse<string> = JSON.parse(baseResponse);
                    this.initModel.apiURL = baseUrl.data;
                    resolve();
                }, error => {
                    reject();
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
                    reject();
                });

            });
        };

        const getFlutterwaveAccountDetails = () => {
            return new Promise((resolve) => {
                this.httpClient.get(this.GET_FLUTTERWAVE_ACCOUNT_DETAILS).subscribe(data => {
                    const flwAccountResponse: string = JSON.stringify(data);
                    const flwAccount: ApiResponse<FlwAccountDetails> = JSON.parse(flwAccountResponse);
                    this.initModel.flwAccountDetails = flwAccount.data;
                    resolve();
                }, error => {
                    reject();
                });

            });
        };

        const getCountries = () => {
            return new Promise((resolve) => {
                this.callAPI('', this.GET_COUNTRIES).subscribe(data => {
                    const countryResponse: string = JSON.stringify(data);
                    const countries: ApiResponse<Country[]> = JSON.parse(countryResponse);
                  //  this.initModel.countries = countries.data;

                    const country = new Country();
                    country.capital = 'Abuja';
                    country.code = 'NG';
                    country.currencyCode = 'NGN';
                    country.currencyName = 'NAIRA';
                    country.dialingCode = '+234';
                    country.isoCode = 'NG';
                    country.name = 'NIGERIA';

                   // this.initModel.countries.unshift(country);
                    // this.initModel.countryCode = 'NG';

                    sessionStorage.setItem('initModel', JSON.stringify(this.initModel));
                    resolve();
                }, error => {
                    reject();
                });

            });
        };

        getBaseURL().then(getAffiliateAccount).then(getFlutterwaveAccountDetails).then(getCountries).catch();
    }
    // makeInitCall() {
    //     return this.httpClient.get(this.GET_BASE_URL).pipe(
    //         switchMap(baseResponse => {
    //             const baseResponseString: string = JSON.stringify(baseResponse);
    //             const baseUrl: ApiResponse<string> = JSON.parse(baseResponseString);
    //             this.initModel.apiURL = baseUrl.data;

    //             return this.httpClient.get(this.GET_AFFILIATE_ACCOUNT).pipe(
    //                 switchMap(affiliateDetailResponse => {
    //                     const affiliateDetailResponseString: string = JSON.stringify(affiliateDetailResponse);
    //                     const affiliateDetail: ApiResponse<AfilliateDetails> = JSON.parse(affiliateDetailResponseString);
    //                     this.initModel.affilateDetail = affiliateDetail.data;

    //                     return this.httpClient.get(this.GET_FLUTTERWAVE_ACCOUNT_DETAILS).pipe(
    //                         switchMap(flwAccountResponse => {
    //                             const flwAccountResponseString: string = JSON.stringify(flwAccountResponse);
    //                             const flwAccount: ApiResponse<FlwAccountDetails> = JSON.parse(flwAccountResponseString);
    //                             this.initModel.flwAccountDetails = flwAccount.data;
    //                             return this.callAPI('', this.GET_COUNTRIES).pipe(
    //                                 switchMap(countryResponse => {
    //                                     const countryResponseString: string = JSON.stringify(countryResponse);
    //                                     const country: ApiResponse<Country[]> = JSON.parse(countryResponseString);
    //                                     this.initModel.countries = country.data;
    //                                     for (const u of country.data) {
    //                                         if (u.name === 'NIGERIA') {
    //                                             this.initModel.countries.unshift(u);
    //                                             this.initModel.countryCode = u.code;
    //                                             break;
    //                                         }
    //                                     }
    //                                     sessionStorage.setItem('initModel', JSON.stringify(this.initModel));
    //                                     return this.callAPI('', this.GET_COUNTRIES);
    //                                 })
    //                             );

    //                         }));
    //                 }));
    //         }));
    // }

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
