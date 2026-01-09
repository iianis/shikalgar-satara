import { DatePipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
    selector: 'app-eventslist',
    templateUrl: './eventslist.component.html',
    styleUrls: ['./eventslist.component.css'],
    providers: [DatePipe],
    standalone: false
})
export class EventslistComponent implements OnInit {

    constructor() { }
    location = inject(Location);
    firebaseService = inject(FirebaseService);
    datePipe = inject(DatePipe);

    goBack(): void {
        this.location.back();
    }

    ngOnInit(): void {

        this.firebaseService.getMasterDataOrderByFieldDesc("events", "order").subscribe(data => {
            //debugger;
            this.masterdata = data;
            //this.sortEventsByDate();
        });
    }

    masterdata: any = [];
    events: any = [];
    eventsTotal = this.events.length;

    sortEventsByDate(): void {
        // Sort by date in descending order
        //this.masterdata.sort((a: any, b: any) => b.date.toDate().getTime() - a.date.toDate().getTime());
        // Sort asc
        this.masterdata.sort((a: any, b: any) => a.date.toDate().getTime() - b.date.toDate().getTime());
    }
}