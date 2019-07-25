import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Test Credentials
  private travelbetaAPIBaseURL = 'http://139.162.210.123:8086/v1/';
  private affiliatePublicKey = 'D4071DA79A7C79CD9A099A1C36CAEAB6';
  public affiliateSecretKey = 'DBB049465F3F79176658A7F77C05D8A0';
  private affiliateCode = 'TBAF0000000059';
  private naijaTravelShopAPIBaseURL = 'http://localhost:8080/';

  // Live Credentials
  //   private travelbetaAPIBaseURL = 'https://api.travelbeta.com/v1/';
  //   private affiliatePublicKey = '80A9BE4C9DAAB845FA19E8FA79A6C0A4';
  //   public affiliateSecretKey = 'E08137513A794B957AE97DEA4CA717CD';
  //   private affiliateCode = 'TBAF0000004385';
  //   private naijaTravelShopAPIBaseURL = 'https://naijatravelshop.com/';

    public RESEND_ACTIVATION_CODE = this.naijaTravelShopAPIBaseURL + 'create-account/resend-activation-code';
    public CONFIRM_REGISTRATION = this.naijaTravelShopAPIBaseURL + 'confirm_registration';
    public CREATE_ACCOUNT = this.naijaTravelShopAPIBaseURL + 'create_account';
    public LOGIN = this.naijaTravelShopAPIBaseURL + 'sign_in';
    public BOOK = this.naijaTravelShopAPIBaseURL + 'booking';
    public PAYMENT_VERIFICATION = this.naijaTravelShopAPIBaseURL + 'payment_verification';
    public GET_RECENT_BOOKINGS = this.naijaTravelShopAPIBaseURL + 'get_recent_booking';
    public UPDATE_PROFILE = this.naijaTravelShopAPIBaseURL + 'update_profile';
    public CHANGE_PASSWORD = this.naijaTravelShopAPIBaseURL + 'change_password';
    public RESET_PASSWORD = this.naijaTravelShopAPIBaseURL + 'reset_password';

    public GET_AIRPORT_BY_SEARCH_TERM = this.travelbetaAPIBaseURL + 'flight/get-airports-by-search-term';
    public GET_CITY = this.travelbetaAPIBaseURL + 'flight/get-city';
    public GET_AIRPORT = this.travelbetaAPIBaseURL + 'flight/get-airport';
    public GET_C0UNTRY = this.travelbetaAPIBaseURL + 'get-country';
    public GET_COUNTRIES = this.travelbetaAPIBaseURL + 'get-countries';
    public PROCESS_FLIGHT_SEARCH = this.travelbetaAPIBaseURL + 'flight/process-flight-search';
    public CREATE_AFILLIATE_FLIGHT_BOOKING = this.travelbetaAPIBaseURL + 'flight/create-affiliate-booking';
    public CREATE_FLIGHT_TOP_DEALS = this.travelbetaAPIBaseURL + 'flight/get-top-deals';
    public CANCEL_RESERVATION = this.travelbetaAPIBaseURL + 'flight/cancel-reservation';
    public ISSUE_TICKET = this.travelbetaAPIBaseURL + 'affiliate/flight-ticket-issue-request';
    public FLIGHT_RESERVATION_STATUS = this.travelbetaAPIBaseURL + 'affiliate/booking/get-flight-reservation-status';

  constructor(private httpClient: HttpClient) { }

  
}
