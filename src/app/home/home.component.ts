import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { FirebaseService } from '../../app/services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
  loggedInFirstName: string = '';
  userIssue: string = "";
  needHelp: boolean = false;
  requestSentSuccess: boolean = false;
  requestSentFailure: boolean = false;

  // Footer Stats (One-time load)
  visitorCount = 0;
  registeredUsersCount = 0;
  personalInfoAccessCount = 0;

  ngOnInit(): void {

    // 1. Session-based Visitor Increment
    this.registerVisitorVisit();

    // 2. Listen to Settings Doc (reactive count display)
    this.firebaseService.getSettingById('eG52d1h6Gt0ON3n0ZgRx')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.appsettings = data;
        if (data?.visitorCount) {
          this.visitorCount = data.visitorCount;
        }
      });

    this.isLoggedIn = !!localStorage.getItem("loggedInUser");

    localStorage.setItem("isTesting", String(this.isTesting));

    const charityCountString = localStorage.getItem('charityCount');
    if (charityCountString) {
      this.charityCount = parseInt(charityCountString, 10);
    }

    // Fetch Master Data
    this.firebaseService.getMasterDataOrderByField("guides", "timestamp")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.masterdata = data || [];
      });

    // Original Authentication pipeline
    this.authService.getLoggedInPhone().pipe(
      switchMap(phone => {
        if (phone) {
          this.isLoggedIn = true;
          return this.firebaseService.getMemberByPhone(phone);
        }
        this.isLoggedIn = false;
        this.loggedInFirstName = '';
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      const member = Array.isArray(result) ? result[0] : result;
      this.isAdmin = !!member && this.authService.isAdminDesignation(member.designation);

      if (member) {
        const rawName = (member.fname || member.name || '').trim();
        const spaceIndex = rawName.search(/\s/);
        this.loggedInFirstName = spaceIndex !== -1 ? rawName.substring(0, spaceIndex) : rawName;
      }
    });

    // Fetch total logged-in users who accessed personal information
    this.firebaseService.getPersonalAccessUserCount().subscribe({
      next: (count) => {
        this.personalInfoAccessCount = count;
      },
      error: (err) => console.error('Error fetching personal access count:', err)
    });
    // One-time load for footer statistics
    this.loadFooterStats();

    // Inside your existing ngOnInit auth subscription:
    this.authService.getLoggedInPhone().pipe(
      switchMap(phone => {
        if (phone) {
          this.isLoggedIn = true;
          return this.firebaseService.getMemberByPhone(phone);
        }
        this.isLoggedIn = false;
        this.loggedInFirstName = '';
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      const member = Array.isArray(result) ? result[0] : result;
      this.loggedInMember = member || null; // Store current member record
      this.isAdmin = !!member && this.authService.isAdminDesignation(member.designation);

      if (member) {
        const rawName = (member.fname || member.name || '').trim();
        const spaceIndex = rawName.search(/\s/);
        this.loggedInFirstName = spaceIndex !== -1 ? rawName.substring(0, spaceIndex) : rawName;
      }
    });
  }

  /**
   * One-time query to fetch total visitors and active logged-in members count
   */
  private async loadFooterStats(): Promise<void> {
    try {
      // 1. Load members list once to count logged-in / active?? users
      this.firebaseService.getCollectionCount('members').subscribe(count => {
        this.registeredUsersCount = count;
      });

      //this.visitorCount = this.appsettings.visitorCount;

    } catch (error) {
      console.error('Error fetching footer statistics:', error);
    }
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
      // Ignore fallback warnings
    } finally {
      localStorage.removeItem("loggedInUser");
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.loggedInFirstName = '';
      this.router.navigateByUrl("login");
    }
  }

  showList(): void {
    this.router.navigateByUrl('charity');
  }

  onHelpChange(): void { }

  goSendRequest(): void {
    this.requestSentFailure = false;
    this.requestSentSuccess = false;

    if (this.userIssue == "" || this.userIssue.trim().length < 20) {
      this.requestSentFailure = true;
    } else {
      this.firebaseService.addUserIssues(this.userIssue.trim());
      this.requestSentSuccess = true;
      setTimeout(() => {
        this.requestSentSuccess = false;
        this.userIssue = "";
        this.needHelp = false;
      }, 2000);
    }
  }

  // home.component.ts

  // Add this property to store the logged-in member object
  loggedInMember: any = null;

  // Add handler for opening personal details
  openMyProfile(): void {
    if (this.loggedInMember) {
      this.router.navigate(['/membermanager'], {
        state: { memberToEdit: this.loggedInMember }
      });
    } else {
      this.router.navigateByUrl('/membermanager');
    }
  }

  private registerVisitorVisit(): void {
    const SESSION_KEY = 'v_logged_session';
    const hasVisitedThisSession = sessionStorage.getItem(SESSION_KEY);

    // Only increment if it's a new browser tab/session and not in testing mode
    if (!hasVisitedThisSession && !this.isTesting) {
      this.firebaseService.incrementVisitorCount('eG52d1h6Gt0ON3n0ZgRx')
        .then(() => {
          sessionStorage.setItem(SESSION_KEY, 'true');
        })
        .catch((err) => console.error('Error recording visit:', err));
    }
  }
}