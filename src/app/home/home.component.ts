import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { AdsPopupComponent } from '../advertisement/ads-popup/ads-popup.component';

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
  appsettings: any = [];
  masterdata: any = [];
  charityCount = 42;
  isTesting: boolean = false;

  ngOnInit(): void {
    // Fetch by Document ID

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
    console.log('Logout in progress..');
    await localStorage.removeItem("loggedInUser");
    setTimeout(() => { this.router.navigateByUrl("login"); }, 2000);
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
