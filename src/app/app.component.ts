import { Component } from '@angular/core';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'Shikalgar-Satara';
  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
