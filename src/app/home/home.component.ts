import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { AuthService } from '../services/auth.service';
//import { AdsPopupComponent } from '../advertisement/ads-popup/ads-popup.component';
// Flash marque news
//इयत्ता दहावीच्या परीक्षेत यशस्वी सर्व विद्यार्थी व पालकांना अनेक शुभेच्छा ।
import { map, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  //imports: [AdsPopupComponent],
  standalone: false
})
export class HomeComponent implements OnInit {

  renderer = inject(Renderer2);
  router = inject(Router);
  firebaseService = inject(FirebaseService);
  authService = inject(AuthService);
  appsettings: any = [];
  masterdata: any = [];
  charityCount = 72;
  isTesting: boolean = false;
  isLoggedIn: boolean = false;

  isAdmin = false;

  ngOnInit(): void {
    // Fetch by Document ID
    this.isLoggedIn = !!localStorage.getItem("loggedInUser");

    localStorage.setItem("isTesting", String(this.isTesting));

    this.firebaseService.getSettingById(
      "eG52d1h6Gt0ON3n0ZgRx"
    ).subscribe(data => {
      this.appsettings = data;
    });

    const charityCountString = localStorage.getItem('charityCount');
    if (charityCountString) {
      this.charityCount = parseInt(charityCountString, 10);
    }

    this.firebaseService.getMasterDataOrderByField("guides", "timestamp").subscribe(data => {
      //debugger;
      this.masterdata = data;
    });

    this.authService.getLoggedInPhone().pipe(
      switchMap(phone => {
        if (phone) {
          this.isLoggedIn = true;
          return this.firebaseService.getMemberByPhone(phone);
        }
        this.isLoggedIn = false;
        return of(null);
      })
    ).subscribe(result => {
      const member = Array.isArray(result) ? result[0] : result;
      this.isAdmin = !!member && this.authService.isAdminDesignation(member.designation);
    });
  }

  jumpTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      this.renderer.setStyle(element, 'display', 'block');
      element.focus();
      // Bring the element into focus without scrolling
    }
  }

  async logout() {
    localStorage.removeItem("loggedInUser");
    this.isLoggedIn = false;
    this.router.navigateByUrl("login");
  }

  showList() {
    this.router.navigateByUrl('charity');
  }

  userIssue: string = "";
  needHelp: boolean = false;
  requestSentSuccess: boolean = false;
  requestSentFailure: boolean = false;

  onHelpChange() {
    //console.log('Need Help:', this.needHelp);
  }

  goSendRequest() {
    this.requestSentFailure = false;
    this.requestSentSuccess = false;

    if (this.userIssue == "" || this.userIssue.length < 20) {
      //console.log("please enter atleast 30 characters");
      this.requestSentFailure = true;
    } else {
      this.firebaseService.addUserIssues(this.userIssue);
      this.requestSentSuccess = true;
      setTimeout(() => {
        this.requestSentSuccess = false;
        this.userIssue = "";
        this.needHelp = false;
      }, 2000); // Hide the message after 3 seconds
    }
  }

}

