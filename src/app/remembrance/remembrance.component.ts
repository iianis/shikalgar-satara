import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../app/services/firebase.service';

@Component({
    selector: 'app-remembrance',
    templateUrl: './remembrance.component.html',
    styleUrls: ['./remembrance.component.css'],
    standalone: false
})
export class RemembranceComponent {

    firebaseService = inject(FirebaseService);
    masterdata: any = [];

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByTimestamp("remembrances", "timestamp").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
    }
}
