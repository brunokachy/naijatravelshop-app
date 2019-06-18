import { Country } from './Country';
import { FlwAccountDetails } from './FlwAccountDetail';
import { AfilliateDetails } from './AffiliateDetails';

export class InitModel {
    public countries: Country[];
    public flwAccountDetails: FlwAccountDetails;
    public apiURL: string;
    public affilateDetail: AfilliateDetails;
    public countryCode: string;
    constructor(
    ) { }

}
