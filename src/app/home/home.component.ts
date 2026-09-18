import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { FirebaseService } from '../../app/services/firebase.service';
import { AuthService } from '../services/auth.service';
//import { AdsPopupComponent } from '../advertisement/ads-popup/ads-popup.component';
// Flash marque news
//इयत्ता दहावीच्या परीक्षेत यशस्वी सर्व विद्यार्थी व पालकांना अनेक शुभेच्छा ।

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  //imports: [AdsPopupComponent],
  standalone: false
})
export class HomeComponent implements OnInit {

  private router = inject(Router);
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  appsettings: any = [];
  masterdata: any = [];
  charityCount = 72;
  isTesting: boolean = false;
  isLoggedIn: boolean = false;
  isAdmin = false;

  userIssue: string = "";
  needHelp: boolean = false;
  requestSentSuccess: boolean = false;
  requestSentFailure: boolean = false;

  ngOnInit(): void {
    // Fetch by Document ID
    this.isLoggedIn = !!localStorage.getItem("loggedInUser");

    localStorage.setItem("isTesting", String(this.isTesting));

    // Fetch Application Settings with automatic unsubscription
    this.firebaseService.getSettingById("eG52d1h6Gt0ON3n0ZgRx")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.appsettings = data;
      });

    const charityCountString = localStorage.getItem('charityCount');
    if (charityCountString) {
      this.charityCount = parseInt(charityCountString, 10);
    }

    // Fetch Master Data with automatic unsubscription
    this.firebaseService.getMasterDataOrderByField("guides", "timestamp")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        //debugger;
        this.masterdata = data || [];
      });

    // Unified Authentication & Admin Designation pipeline
    this.authService.getLoggedInPhone().pipe(
      switchMap(phone => {
        if (phone) {
          this.isLoggedIn = true;
          return this.firebaseService.getMemberByPhone(phone);
        }
        this.isLoggedIn = false;
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      const member = Array.isArray(result) ? result[0] : result;
      this.isAdmin = !!member && this.authService.isAdminDesignation(member.designation);
    });
  }

  jumpTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.focus();
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (e) {
      // Ignore fallback if firebase logout encounters non-critical warnings
    } finally {
      localStorage.removeItem("loggedInUser");
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.router.navigateByUrl("login");
    }
  }

  showList(): void {
    this.router.navigateByUrl('charity');
  }

  onHelpChange(): void {
    //console.log('Need Help:', this.needHelp);
  }

  goSendRequest(): void {
    this.requestSentFailure = false;
    this.requestSentSuccess = false;

    if (this.userIssue == "" || this.userIssue.trim().length < 20) {
      //console.log("please enter atleast 30 characters");
      this.requestSentFailure = true;
    } else {
      this.firebaseService.addUserIssues(this.userIssue.trim());
      this.requestSentSuccess = true;
      setTimeout(() => {
        this.requestSentSuccess = false;
        this.userIssue = "";
        this.needHelp = false;
      }, 2000); // Hide the message after 2 seconds
    }
  }
}