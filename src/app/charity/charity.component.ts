import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { charities } from '../../data/misc';

@Component({
    selector: 'app-charity',
    templateUrl: './charity.component.html',
    //styleUrls: ['./charity.component.css'],
    standalone: false
})
export class CharityComponent {

    firebaseService = inject(FirebaseService);
    masterdata: any = [];
    location = inject(Location);

    goBack(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.firebaseService.getMasterDataOrderByField("charities", "timestamp").subscribe(data => {
            //debugger;
            this.masterdata = data;
        });
        this.getTotalCount();
    }

    charityCount = 0;
    charities = charities;

    getTotalCount() {
        let totalCount = 0;
        let totalCountEducation = 0;
        let totalCountMedical = 0;
        let totalCountFinancial = 0;
        let totalCountBusiness = 0;
        let totalCountOther = 0;

        this.charities.forEach(charity => {
            charity.familiesByTaluka.forEach((family: any) => {
                totalCount += family.count;
            });
            if (charity.name == "शैक्षणिक मदत") totalCountEducation = totalCount;
            if (charity.name == "वैद्यकीय मदत") totalCountMedical = totalCount;
            if (charity.name == "आर्थिक मदत") totalCountFinancial = totalCount;
            if (charity.name == "लघुउद्योग मदत") totalCountBusiness = totalCount;
            //if (charity.name == "") totalCountOther = totalCount;
        });

        this.charityCount = totalCount;
        localStorage.setItem('charityCount', totalCount.toString());
    }

    charityChart: CharityRecord[] = [
        { year: "2026-27", type: "आर्थिक", charityCount: 3, charityAmount: 15000 },
        { year: "2026-27", type: "शैक्षणिक", charityCount: 3, charityAmount: 30000 },
        { year: "2026-27", type: "वैद्यकीय", charityCount: 1, charityAmount: 5000 },
        { year: "2026-27", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
        { year: "2026-27", type: "इतर", charityCount: 0, charityAmount: 0 },

        { year: "2025-26", type: "आर्थिक", charityCount: 22, charityAmount: 110000 },
        { year: "2025-26", type: "शैक्षणिक", charityCount: 4, charityAmount: 40000 },
        { year: "2025-26", type: "वैद्यकीय", charityCount: 1, charityAmount: 5000 },
        { year: "2025-26", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
        { year: "2025-26", type: "इतर", charityCount: 1, charityAmount: 10000 },

        { year: "2024-25", type: "आर्थिक", charityCount: 16, charityAmount: 80000 },
        { year: "2024-25", type: "शैक्षणिक", charityCount: 3, charityAmount: 15000 },
        { year: "2024-25", type: "वैद्यकीय", charityCount: 4, charityAmount: 20000 },
        { year: "2024-25", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
        { year: "2024-25", type: "इतर", charityCount: 0, charityAmount: 0 },

        { year: "2023-24", type: "आर्थिक", charityCount: 15, charityAmount: 45000 },
        { year: "2023-24", type: "शैक्षणिक", charityCount: 0, charityAmount: 0 },
        { year: "2023-24", type: "वैद्यकीय", charityCount: 2, charityAmount: 10000 },
        { year: "2023-24", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
        { year: "2023-24", type: "इतर", charityCount: 0, charityAmount: 0 },

    ];

    // Grouped data structure
    get groupedByYear() {
        const groups: { [key: string]: CharityRecord[] } = {};

        this.charityChart.forEach(item => {
            if (!groups[item.year]) {
                groups[item.year] = [];
            }
            groups[item.year].push(item);
        });

        // Convert back to array of objects for easier iteration in HTML
        return Object.keys(groups).map(year => ({
            year: year,
            data: groups[year],
            // Calculate total per year
            totalAmount: groups[year].reduce((sum, current) => sum + current.charityAmount, 0),
            totalCount: groups[year].reduce((sum, current) => sum + (current.charityCount || 0), 0)
        }));
    }
}


// Interface for type safety
interface CharityRecord {
    year: string;
    type: string;
    charityCount: number;
    charityAmount: number;
}