import { Component, inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { charities, directors, donors, events, guides, initiatives, remembrances, scholarships } from '../../data/misc';
import { format, parse } from 'date-fns';
import { CommonModule, DatePipe } from '@angular/common';
import { taluka, talukas, village, villages } from '../../data/areas';
import { members } from '../../data/members';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-eventsdatacollector',
    templateUrl: './eventsdatacollector.component.html',
    //styleUrls: ['./eventsdatacollector.component.css'],
    imports: [FormsModule, CommonModule],
    providers: [DatePipe],
    standalone: true
})
export class EventsDataCollectorComponent {
    selectedEventType: string = 'charities';
    formData: any = {};
    firebaseService = inject(FirebaseService);
    datePipe = inject(DatePipe);

    onEventTypeChange(event: any): void {
        this.selectedEventType = event.target.value;
        this.resetFormData();
    }

    resetFormData(): void {
        const today = new Date().toISOString().split('T')[0];
        this.formData = {
            name: '',
            taluka: 'satara',
            village: 'satara',
            date: today,
            amount: '0',
            donationType: '',
            charityType: '',
            company: '',
            url: '',
            desc: '',
            contact: '',
            phone: '',
            venue: '',
            order: 1
        };

        if (this.selectedEventType == "donors") this.formData.donationType = "jaqat";
        if (this.selectedEventType == "charities") this.formData.type = "financial";
    }

    onSubmit(): void {
        if (this.formData.date) this.formData.date = this.formattedDate;
        console.log('Form Data:', this.formData);
        // Add your form submission logic here
        this.firebaseService.addMasterData(this.selectedEventType, removeEmptyOrNullAttributes(this.formData));
        this.resetFormData();
    }

    talukas: taluka[] = talukas;
    villages: village[] = villages;
    villagesByTaluka: village[] = [];

    onTalukaChange(event: any) {
        this.formData.taluka = event.target.value;
        localStorage.setItem("mytaluka", event.target.value);
        console.log('Taluka changed to:', this.formData.taluka);

        // Filter the villages array by the selected taluka
        this.villagesByTaluka = this.villages.filter(village => village.taluka === this.formData.taluka);

        this.formData.village = this.formData.taluka; //most of the time taluka n village are same. satara - satara etc.
        localStorage.setItem("myvillage", this.formData.taluka);
    }

    onVillageChange(event: any) {
        this.formData.village = event.target.value;
        localStorage.setItem("myvillage", event.target.value);
        console.log('Village changed to:', this.formData.village);
    }

    formattedDate: string = '';
    onDateChange(): void {
        console.log('Form Data 1: Date');
        if (this.formData.date) {
            console.log('Form Data 2:', this.formData.date);
            const parsedDate = new Date(this.formData.date);
            this.formattedDate = this.datePipe.transform(parsedDate, 'dd/MM/yyyy')?.toString() || '';
            console.log('Form Data 3:', this.formattedDate);
        }
    }

    masterdatas = [
        { name: "donors" },
        { name: "members" },
        { name: "falicitations" },
        { name: "directors" },
        { name: "events" },
        { name: "initiatives" },
        { name: "remembrances" },
        { name: "scholarships" },
        { name: "guides" },
        { name: "charities" },
        //{ name: "recommendations" },
    ]

    masterdata = "donors";

    onMasterDataChange(event: any) {
        this.masterdata = event.target.value;
        console.log("selected master data: " + event.target.value);
    }

    async goLoadMasterData() {

        let data2load: any[] = [];
        console.log("inserting into master data: " + this.masterdata);
        switch (this.masterdata) {
            case "members": data2load = members; break;
            case "donors": data2load = donors; break;
            //case "falicitations": data2load = falicitations; break;
            case "directors": data2load = directors; break;
            case "events": data2load = events; break;
            case "scholarships": data2load = scholarships; break;
            case "guides": data2load = guides; break;
            case "charities": data2load = charities; break;
            case "initiatives": data2load = initiatives; break;
            case "remembrances": data2load = remembrances; break;
        }

        for (const item of data2load) {
            await this.firebaseService.addMasterData(this.masterdata, removeEmptyOrNullAttributes(item));
        }

        alert("Master data loaded for collection: " + this.masterdata);
    }

    goExportData(): void {
        this.firebaseService.exportCollectionToCsv(this.masterdata);
    }

    goImportData(event: any): void {
        console.log("importing into master data: " + this.masterdata);
        const file: File = event.target.files[0];
        if (file) {
            this.firebaseService.readCsvAndWriteToDatabase(file, this.masterdata);
            //this.firebaseService.readCsvAndWriteToDatabase(file, this.masterdata + "imported");
        }
    }
}

export function removeEmptyOrNullAttributes(obj: any): any {
    // Create a copy of the object to avoid modifying the original
    const cleanedObj = { ...obj };

    // Iterate over the object's keys
    Object.keys(cleanedObj).forEach(key => {
        const value = cleanedObj[key];

        // If the value is an object, recursively clean it
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            cleanedObj[key] = removeEmptyOrNullAttributes(value);

            // If the cleaned object is empty, delete the key
            if (Object.keys(cleanedObj[key]).length === 0) {
                delete cleanedObj[key];
            }
        }
        // If the value is null or an empty string, delete the key
        else if (value === null || value === '') {
            delete cleanedObj[key];
        }
    });
    //debugger;
    return cleanedObj;
}

