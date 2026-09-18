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

  // Selected member ID state for expanded view
  selectedMemberId: string | null = null;

  villagesByTaluka: village[] = [];

  // Active search query state
  searchQuery: string = '';

  // Auth & Permissions State
  loggedInPhone: string | null = null;

  // Set defaults: Load saved selection from localStorage or fall back to Satara & Nagthane
  mytaluka = localStorage.getItem("mytaluka") || "सातारा";
  myvillage = localStorage.getItem("myvillage") || "नागठाणे";

  talukas: taluka[] = talukas;
  villages: village[] = villages;

  async ngOnInit(): Promise<void> {
    // Reset window scroll position to top
    window.scrollTo(0, 0);

    this.updateVillagesForSelectedTaluka();

    // Retrieve logged in phone for checking ownership permission
    this.loggedInPhone = await firstValueFrom(this.authService.getLoggedInPhone());

    this.firebaseService.getMembers().subscribe(data => {
      this.members = data;
      this.applyCombinedFilters();
    });
  }

  toggleMemberDetails(memberId: string | undefined): void {
    if (!memberId) return;
    this.selectedMemberId = this.selectedMemberId === memberId ? null : memberId;
  }

  goBack(): void {
    this.location.back();
  }

  onSearchChange(query: string) {
    this.searchQuery = query ? query.toLowerCase().trim() : '';
    this.applyCombinedFilters();
  }

  updateVillagesForSelectedTaluka(): void {
    if (this.mytaluka && this.mytaluka !== "none") {
      this.villagesByTaluka = this.villages.filter(v => v.taluka === this.mytaluka);
    } else {
      this.villagesByTaluka = [];
    }
  }

  onTalukaChange(event: any) {
    this.mytaluka = event.target.value;
    localStorage.setItem("mytaluka", this.mytaluka);

    this.updateVillagesForSelectedTaluka();

    const villageExists = this.villagesByTaluka.some(v => v.name === this.myvillage);
    if (!villageExists) {
      this.myvillage = "none";
      localStorage.setItem("myvillage", "none");
    }

    this.applyCombinedFilters();
  }

  onVillageChange(event: any) {
    this.myvillage = event.target.value;
    localStorage.setItem("myvillage", this.myvillage);

    this.applyCombinedFilters();
  }

  /**
   * Evaluates Taluka, Village, and Search Text (Name, Village, Designation, Phone) simultaneously.
   */
  applyCombinedFilters(): void {
    this.filteredMembers = this.members.filter((member) => {
      // 1. Check Taluka Filter
      const matchesTaluka = this.mytaluka === "none" || member.taluka === this.mytaluka;

      // 2. Check Village Filter
      const matchesVillage = this.myvillage === "none" || member.village === this.myvillage;

      // 3. Check Search Query Filter (Name, Village, Designation, or Phone)
      const matchesSearch = !this.searchQuery ||
        member.fname?.toLowerCase().includes(this.searchQuery) ||
        member.lname?.toLowerCase().includes(this.searchQuery) ||
        member.village?.toLowerCase().includes(this.searchQuery) ||
        member.designation?.toLowerCase().includes(this.searchQuery) ||
        member.phone?.includes(this.searchQuery);

      return matchesTaluka && matchesVillage && matchesSearch;
    });
  }

  /**
   * Helper to determine if current user can edit this record
   */
  canEdit(member: Member): boolean {
    return !!this.loggedInPhone && this.loggedInPhone === member.phone;
  }

  /**
   * Navigates to MemberManager component passing the selected member to edit
   */
  editMember(member: Member): void {
    this.router.navigate(['/membermanager'], { state: { memberToEdit: member } });
  }
}