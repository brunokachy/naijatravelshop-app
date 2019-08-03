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

@Injectable({
    providedIn: 'root'
})

export class InitAPIService {
    initModel: InitModel = new InitModel();
    constructor(private httpClient: HttpClient) {
        this.checkInitModel();
    }
     private naijaTravelShopAPIBaseURL = window.location.origin + '/naijatravelshop/api/';
    //private naijaTravelShopAPIBaseURL = 'http://localhost:8080/naijatravelshop/api/';
    private GET_BASE_URL = this.naijaTravelShopAPIBaseURL + 'admin/get_base_url';
    private GET_AFFILIATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'admin/get_affiliate_account_details';
    private GET_FLUTTERWAVE_ACCOUNT_DETAILS = this.naijaTravelShopAPIBaseURL + 'payment/get_flw_account_details';
    private GET_COUNTRIES = 'get-countries';

    checkInitModel() {
        if (JSON.parse(sessionStorage.getItem('initModel')) == null) {
            sessionStorage.setItem('initModel', JSON.stringify(new InitModel()));
        } else {
            this.initModel = JSON.parse(sessionStorage.getItem('initModel'));
            if (this.initModel.apiURL == null) {
                this.makeInitCall();
            }
        }
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
                    resolve();
                }, error => {
                    console.log(error);
                });

            });
        };

        const getCountries = () => {
            return new Promise((resolve) => {
                this.postRequest('', this.GET_COUNTRIES).subscribe(data => {
                    const countryResponseString: string = JSON.stringify(data);
                    const countries: ApiResponse<Country[]> = JSON.parse(countryResponseString);
                    this.initModel.countries = countries.data;

                    const country = new Country();
                    country.capital = 'Abuja';
                    country.code = 'NG';
                    country.currencyCode = 'NGN';
                    country.currencyName = 'NAIRA';
                    country.dialingCode = '+234';
                    country.isoCode = 'NG';
                    country.name = 'NIGERIA';

                    this.initModel.countries.unshift(country);
                    this.initModel.countryCode = 'NG';

                    sessionStorage.setItem('initModel', JSON.stringify(this.initModel));
                    resolve();
                }, error => {
                    console.log(error);
                });

            });
        };

        getBaseURL().then(getAffiliateAccount).then(getFlutterwaveAccountDetails).then(getCountries).catch();
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
