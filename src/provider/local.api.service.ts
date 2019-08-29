import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenObject } from '../model/TokenObject';

@Injectable({
    providedIn: 'root'
})
export class LocalAPIService {
    constructor(private httpClient: HttpClient) { }

    // private naijaTravelShopAPIBaseURL = window.location.origin + '/naijatravelshop/api/';
     private naijaTravelShopAPIBaseURL = 'http://localhost:8080/naijatravelshop/api/';

    public CONFIRM_REGISTRATION = this.naijaTravelShopAPIBaseURL + 'confirm_registration';
    public CREATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'admin/create_account';
    public LOGIN = this.naijaTravelShopAPIBaseURL + 'admin/login';
    public BOOK = this.naijaTravelShopAPIBaseURL + 'flight/create_reservation';
    public PAYMENT_VERIFICATION = this.naijaTravelShopAPIBaseURL + 'payment/flw_payment_verification';
    public GET_RECENT_BOOKINGS = this.naijaTravelShopAPIBaseURL + 'admin/get_recent_booking';
    public UPDATE_PROFILE = this.naijaTravelShopAPIBaseURL + 'admin/update_account';
    public CHANGE_PASSWORD = this.naijaTravelShopAPIBaseURL + 'admin/change_password';
    public RESET_PASSWORD = this.naijaTravelShopAPIBaseURL + 'admin/reset_user_password';
    public GET_AFFILIATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'admin/get_affiliate_account_details';
    public GET_PORTAL_USERS = this.naijaTravelShopAPIBaseURL + 'admin/get_portal_users';
    public ACTIVATE_USER = this.naijaTravelShopAPIBaseURL + 'admin/reactivate_account';
    public DEACTIVATE_USER = this.naijaTravelShopAPIBaseURL + 'admin/deactivate_account';
    public VISA_REQUEST = this.naijaTravelShopAPIBaseURL + 'flight/create_visa_request';
    public GET_FLIGHT_BOOKINGS_BY_SEARCH_TERM = this.naijaTravelShopAPIBaseURL + 'admin/get_flight_bookings_by_search_term';
    public GET_VISA_REQUEST_BY_SEARCH_TERM = this.naijaTravelShopAPIBaseURL + 'admin/get_visa_requests_by_search_term';
    public CHANGE_BOOKING_STATUS = this.naijaTravelShopAPIBaseURL + 'admin/change_booking_status';
    public CHANGE_VISA_REQUEST_STATUS = this.naijaTravelShopAPIBaseURL + 'admin/change_visa_request_status';
    public GET_FLIGHT_RESERVATION_DETAILS = this.naijaTravelShopAPIBaseURL + 'admin/get_flight_reservation_details';
    public BANK_PAYMENT = this.naijaTravelShopAPIBaseURL + 'payment/bank_payment';
    public SEARCH_HOTELS = this.naijaTravelShopAPIBaseURL + 'hotel/search_hotels';

    // postRequest(requestData: any, url: string): Observable<any> {
    //     let token = this.getSavedToken();
    //     const isValid = this.validateToken(token);
    //     if (isValid) {
    //         token = this.getSavedToken().token;
    //         return this.httpClient
    //             .post(url, requestData, this.header(token));
    //     } else {
    //         return this.generateToken(requestData, url);
    //     }
    // }

    postRequest(requestData: any, url: string): Observable<any> {
        return this.httpClient
            .post(url, requestData, this.header(''));
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
        const token = JSON.parse(localStorage.getItem('localToken'));
        return token;
    }

    private generateToken(requestData: any, url: string) {
        const tokenURL = 'http://localhost:8080/authenticate';
        const body = { username: 'kachybrunokachiotas', password: '701c12446da86736e088cc0683802991' };
        return this.httpClient
            .post(tokenURL, body, this.header('')).pipe(
                switchMap(tokenResponse => {
                    const tokenString: string = JSON.stringify(tokenResponse);
                    const tokenObject: TokenObject = JSON.parse(tokenString);
                    localStorage.setItem('localToken', JSON.stringify(tokenObject));
                    return this.httpClient
                        .post(url, requestData, this.header(tokenObject.token));
                }));
    }

    private header(token: string): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
              //  Authorization: token
            })
        };
        return httpOptions;
    }
}
