import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'app-donors',
    templateUrl: './donors.component.html',
    styleUrls: ['./donors.component.css'],
    standalone: false
})
export class DonorsComponent {

    firebaseService = inject(FirebaseService);
    masterdata: any = [];
    filteredData: any[] = [];
    searchQuery: string = '';

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByField("donors", "amount").subscribe(data => {
            //debugger;
            this.masterdata = this.filteredData = data;
        });
    }

    onSearchChange(query: string) {
        if (query) {
            this.filteredData = this.masterdata.filter((donor: any) =>
                donor.name.toLowerCase().includes(query.toLowerCase()) ||
                donor.village.toLowerCase().includes(query.toLowerCase()) ||
                donor.donationType.toLowerCase().includes(query.toLowerCase())
            );
        } else {
            this.filteredData = this.masterdata;
        }
    }
}
