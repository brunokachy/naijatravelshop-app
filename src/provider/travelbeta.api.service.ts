import { Injectable } from '@angular/core';
import * as sha1 from 'js-sha1';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenObject } from '../model/TokenObject';
import { ApiResponse } from '../model/ApiResponse';
import { InitModel } from '../model/InitModel';

@Injectable({
    providedIn: 'root'
})

export class TravelbetaAPIService {
    initModel: InitModel = new InitModel();
    constructor(private httpClient: HttpClient) {
        const interval = setInterval(() => {
            if (JSON.parse(localStorage.getItem('initModel')) != null) {
                this.initModel = JSON.parse(localStorage.getItem('initModel'));
                clearInterval(interval);
            }
        }, 1000);
    }
    public GET_AIRPORT_BY_SEARCH_TERM = 'flight/get-airports-by-search-term';
    public GET_CITY = 'flight/get-city';
    public GET_AIRPORT = 'flight/get-airport';
    public GET_C0UNTRY = 'get-country';
    public GET_COUNTRIES = 'get-countries';
    public PROCESS_FLIGHT_SEARCH = 'flight/process-flight-search';
    public CREATE_AFILLIATE_FLIGHT_BOOKING = 'flight/create-affiliate-booking';
    public CANCEL_RESERVATION = 'flight/cancel-reservation';
    public ISSUE_TICKET = 'affiliate/flight-ticket-issue-request';
    public FLIGHT_RESERVATION_STATUS = 'affiliate/booking/get-flight-reservation-status';

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
