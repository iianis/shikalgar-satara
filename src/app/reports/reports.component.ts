import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Member } from '../interfaces/interfaces';
import { FirebaseReportService } from '../services/firebasereport.service';
import { HeaderComponent } from '../shared/header/header.component';

export type ReportType = 'list' | 'member-audit' | 'recommendation-letter' | 'needy-family-fund' | 'donors';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private reportService = inject(FirebaseReportService);

  // Active Report State ('list' shows dashboard)
  selectedReport: ReportType = 'list';

  // Shared Data & Pagination State
  records: any[] = [];
  isLoading = false;
  pageSize = 50;
  currentPage = 1;
  hasNextPage = false;

  private pageSnapshots: (QueryDocumentSnapshot<any> | null)[] = [null];
  private currentLastDoc: QueryDocumentSnapshot<any> | null = null;

  // In membermanager.component.ts or reports.component.ts
  async ngOnInit(): Promise<void> {
    // Call the temporary migration function once
    // try {
    //   const count = await this.reportService.migrateAliveFieldOneTime();
    //   console.log(`Migration completed for ${count} records.`);
    // } catch (err) {
    //   console.error('Migration failed:', err);
    // }
  }

  // Handle Report Selection from Dashboard
  selectReport(report: ReportType): void {
    this.selectedReport = report;
    this.resetPagination();
    if (report !== 'list') {
      this.loadPage(1);
    }
  }

  goBackToList(): void {
    this.selectedReport = 'list';
    this.resetPagination();
  }

  private resetPagination(): void {
    this.records = [];
    this.currentPage = 1;
    this.hasNextPage = false;
    this.pageSnapshots = [null];
    this.currentLastDoc = null;
  }

  async loadPage(pageNumber: number): Promise<void> {
    if (pageNumber < 1) return;
    this.isLoading = true;

    try {
      if (this.selectedReport === 'needy-family-fund') {
        const result = await this.reportService.getCharityReport(this.pageSize, pageNumber - 1);
        this.records = result.records;
        this.hasNextPage = (pageNumber * this.pageSize) < result.totalCount;
        this.currentPage = pageNumber;
      } else if (this.selectedReport === 'donors') {
        const result = await this.reportService.getDonorsReport(this.pageSize, pageNumber - 1);
        this.records = result.records;
        this.hasNextPage = (pageNumber * this.pageSize) < result.totalCount;
        this.currentPage = pageNumber;
      } else if (this.selectedReport === 'recommendation-letter') {
        const result = await this.reportService.getRecommendationReport(this.pageSize, pageNumber - 1);
        this.records = result.records;
        this.hasNextPage = (pageNumber * this.pageSize) < result.totalCount;
        this.currentPage = pageNumber;
      } else {
        // Query/Cursor-based pagination for collections (member-audit)
        const cursor = this.pageSnapshots[pageNumber - 1] || null;
        let result: { records: any[]; members?: Member[]; lastVisibleDoc: QueryDocumentSnapshot<any> | null };

        if (this.selectedReport === 'member-audit') {
          const auditResult = await this.reportService.getMemberAuditReport(this.pageSize + 1, cursor);
          result = { records: auditResult.members, lastVisibleDoc: auditResult.lastVisibleDoc };
        } else {
          return;
        }

        if (result.records.length > this.pageSize) {
          this.hasNextPage = true;
          this.records = result.records.slice(0, this.pageSize);
          this.currentLastDoc = result.lastVisibleDoc;
        } else {
          this.hasNextPage = false;
          this.records = result.records;
          this.currentLastDoc = result.lastVisibleDoc;
        }

        this.currentPage = pageNumber;

        if (this.currentLastDoc && this.pageSnapshots.length <= pageNumber) {
          this.pageSnapshots.push(this.currentLastDoc);
        }
      }
    } catch (error) {
      console.error('Error loading report:', error);
      alert('अहवाल लोड करताना त्रुटी आली.');
    } finally {
      this.isLoading = false;
    }
  }
  nextPage(): void {
    if (this.hasNextPage && !this.isLoading) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1 && !this.isLoading) {
      this.loadPage(this.currentPage - 1);
    }
  }

  /**
   * Formats a timestamp into a short date string.
   * @param timestamp Firestore Timestamp or JS Date object/string
   * @param includeTime If true, includes time (e.g. 'DD/MM/YY, HH:MM AM/PM'). Defaults to true.
   */
  formatDate(timestamp: any, includeTime: boolean = true): string {
    if (!timestamp) return 'N/A';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date.getTime())) return 'N/A';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const shortDate = `${day}/${month}/${year}`;

    if (!includeTime) {
      return shortDate;
    }

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const formattedHours = String(hours).padStart(2, '0');

    return `${shortDate}, ${formattedHours}:${minutes} ${ampm}`;
  }
}