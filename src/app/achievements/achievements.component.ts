import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    styleUrls: ['./achievements.component.css'],
    standalone: false
})
export class AchievementsComponent {

    location = inject(Location);

    goBack(): void {
        this.location.back();
    }

    firebaseService = inject(FirebaseService);
    masterdata: any = [];

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByTimestamp("falicitations", "order").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
    }
}
