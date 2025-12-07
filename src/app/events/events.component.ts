import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: false
})
export class EventsComponent implements OnInit {

  router = inject(Router);
  @Input() totalEvents: number = 0;
  firebaseService = inject(FirebaseService);
  eventsCount = 0;

  ngOnInit(): void {
    this.firebaseService.getCollectionCount('events').subscribe(count => {
      this.eventsCount = count;
    });
  }

  showList() {
    this.router.navigateByUrl('eventslist');
  }
}
