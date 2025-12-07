import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    //styleUrls: ['./requests.component.css'],
    standalone: false
})
export class RequestsComponent implements OnInit {

    router = inject(Router);
    masterdata: any[] = [];
    firebaseService = inject(FirebaseService);

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByTimestamp("memberrequests", "timestamp").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
    }

    formatTimestampToDate(timestamp: Timestamp): string {
        const date = timestamp.toDate();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
        return new Intl.DateTimeFormat('en-GB', options).format(date); // 'en-GB' is used for dd/mm/yyyy format
    }
}