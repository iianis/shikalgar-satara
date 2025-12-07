import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.css'],
  standalone: false
})
export class InitiativesComponent {

  masterdata: any[] = [];
  firebaseService = inject(FirebaseService);

  ngOnInit(): void {
    this.firebaseService.getMasterDataOrderByField("initiatives", "timestamp").subscribe(data => {
      this.masterdata = data;
    });
  }
}
