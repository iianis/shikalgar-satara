import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { taluka, talukas, village, villages } from '../../data/areas';
import { Member } from '../interfaces/interfaces';
import { HeaderComponent } from '../shared/header/header.component';
import { SearchComponent } from '../search/search.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-memberslist',
  templateUrl: './memberslist.component.html',
  imports: [HeaderComponent, SearchComponent, CommonModule, FormsModule],
  styleUrls: ['./memberslist.component.css'],
  standalone: true
})
export class MemberslistComponent implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  authService = inject(AuthService);
  location = inject(Location);

  members: Member[] = [];
  filteredMembers: Member[] = [];

  selectedMemberId: string | null = null;
  villagesByTaluka: village[] = [];

  // Active search query term
  searchQuery: string = '';

  // Lazy loading & UI state controls
  isDataLoaded: boolean = false;
  isSearching: boolean = false;
  hasSearched: boolean = false;

  loggedInPhone: string | null = null;

  mytaluka = localStorage.getItem("mytaluka") || "सातारा";
  myvillage = localStorage.getItem("myvillage") || "नागठाणे";

  talukas: taluka[] = talukas;
  villages: village[] = villages;

  async ngOnInit(): Promise<void> {
    window.scrollTo(0, 0);
    this.updateVillagesForSelectedTaluka();
    this.loggedInPhone = await firstValueFrom(this.authService.getLoggedInPhone());
  }

  toggleMemberDetails(memberId: string | undefined): void {
    if (!memberId) return;
    this.selectedMemberId = this.selectedMemberId === memberId ? null : memberId;
  }

  goBack(): void {
    this.location.back();
  }

  /**
   * Updates search term state on typing (Does NOT trigger search automatically)
   */
  onSearchInput(query: string): void {
    this.searchQuery = query ? query.toLowerCase().trim() : '';
  }

  /**
   * Triggers search if Enter key is pressed inside search input
   */
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.executeSearch();
    }
  }

  /**
   * Main search trigger (Called on Enter keypress or Search Button click)
   */
  async executeSearch(): Promise<void> {
    this.hasSearched = true;

    // Load records from Firestore on first search invocation
    if (!this.isDataLoaded) {
      this.isSearching = true;
      try {
        const data = await firstValueFrom(this.firebaseService.getMembers());
        this.members = data || [];
        this.isDataLoaded = true;
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        this.isSearching = false;
      }
    }

    this.applyCombinedFilters();
  }

  updateVillagesForSelectedTaluka(): void {
    if (this.mytaluka && this.mytaluka !== "none") {
      this.villagesByTaluka = this.villages.filter(v => v.taluka === this.mytaluka);
    } else {
      this.villagesByTaluka = [];
    }
  }

  onTalukaChange(event: any): void {
    this.mytaluka = event.target.value;
    localStorage.setItem("mytaluka", this.mytaluka);
    this.updateVillagesForSelectedTaluka();

    const villageExists = this.villagesByTaluka.some(v => v.name === this.myvillage);
    if (!villageExists) {
      this.myvillage = "none";
      localStorage.setItem("myvillage", "none");
    }

    if (this.hasSearched) {
      this.applyCombinedFilters();
    }
  }

  onVillageChange(event: any): void {
    this.myvillage = event.target.value;
    localStorage.setItem("myvillage", this.myvillage);

    if (this.hasSearched) {
      this.applyCombinedFilters();
    }
  }

  /**
   * General Filter: Matches Taluka, Village, and Generalized Search (fname or phone)
   */
  applyCombinedFilters(): void {
    const query = this.searchQuery;

    this.filteredMembers = this.members.filter((member) => {
      // 1. Check Taluka Filter
      const matchesTaluka = this.mytaluka === "none" || member.taluka === this.mytaluka;

      // 2. Check Village Filter
      const matchesVillage = this.myvillage === "none" || member.village === this.myvillage;

      // 3. Generalized Search: Matches First Name or Phone Number
      const matchesSearch = !query ||
        member.fname?.toLowerCase().includes(query) ||
        member.lname?.toLowerCase().includes(query) ||
        member.phone?.includes(query);

      return matchesTaluka && matchesVillage && matchesSearch;
    });
  }

  canEdit(member: Member): boolean {
    return !!this.loggedInPhone && this.loggedInPhone === member.phone;
  }

  editMember(member: Member): void {
    this.router.navigate(['/membermanager'], { state: { memberToEdit: member } });
  }
}