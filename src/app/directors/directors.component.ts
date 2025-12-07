import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'app-directors',
    templateUrl: './directors.component.html',
    styleUrls: ['./directors.component.css'],
    standalone: false
})
export class DirectorsComponent {

    firebaseService = inject(FirebaseService);
    masterdata: any = [];

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByField("directors", "order").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
    }
}
