import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.css'],
    standalone: false
})
export class EducationComponent {

    firebaseService = inject(FirebaseService);
    masterdata: any = [];

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByField("scholarships", "timestamp").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
    }
}
