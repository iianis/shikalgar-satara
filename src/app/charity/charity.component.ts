import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { charities } from '../../data/misc';

@Component({
    selector: 'app-charity',
    templateUrl: './charity.component.html',
    //styleUrls: ['./charity.component.css'],
    standalone: false
})
export class CharityComponent {

    firebaseService = inject(FirebaseService);
    masterdata: any = [];
    location = inject(Location);

    goBack(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByField("charities", "timestamp").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
        this.getTotalCount();
    }

    charityCount = 0;
    charities = charities;

    getTotalCount() {
        let totalCount = 0;
        this.charities.forEach(charity => {
            charity.familiesByTaluka.forEach((family: any) => {
                totalCount += family.count;
            });
        });
        this.charityCount = totalCount;
        localStorage.setItem('charityCount', totalCount.toString());
    }
}
