import { Component, inject, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirebaseService } from '../services/firebase.service';
import { taluka, talukas, village, villages } from '../../data/areas';
import { take } from 'rxjs';
import { IMember } from '../interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
    selector: 'app-membersnew',
    templateUrl: './membersnew.component.html',
    styleUrls: ['./membersnew.component.css'],
    standalone: false
})
export class MembernewComponent implements OnInit {

    router = inject(Router);
    location = inject(Location);
    firebaseService = inject(FirebaseService);
    talukas: taluka[] = talukas;
    villages: village[] = villages;

    member: IMember = { lname: "", fname: "", mname: "", taluka: "", village: "", dist: "", phone: "", designation: "" };
    memberPhoneExists: boolean = false;
    memberSaveSuccess: boolean = false;
    memberSaveFailure: boolean = false;
    memberPhoneValidationFailure: boolean = false;
    memberValidationFailure: boolean = false;
    validating: boolean = false;
    saving: boolean = false;

    ngOnInit(): void {
        let mytaluka = localStorage.getItem("mytaluka") || "सातारा";
        //if (mytaluka == null) {
        this.item.taluka = mytaluka;
        localStorage.setItem("mytaluka", mytaluka);
        //}

        this.villagesByTaluka = this.villages.filter(village => village.taluka === this.item.taluka);

        let myvillage = localStorage.getItem("myvillage");
        if (myvillage == null) {
            this.item.village = mytaluka;
            localStorage.setItem("myvillage", mytaluka);
        } else {
            this.item.village = myvillage;
            localStorage.setItem("myvillage", myvillage);
        }
        this.resetFormData();
    }

    goBack(): void {
        //this.location.back();
        this.router.navigateByUrl('home');
    }

    membersBeingSaved: Set<string> = new Set();

    private isInvalidPhoneNumber(): boolean {
        return this.item.phone.length !== 10;
    }

    private isInvalidMemberData(): boolean {
        return this.isInvalidPhoneNumber() || this.item.fname === "" || this.item.lname === "" ||
            this.item.village === "none" || this.item.taluka === "none";
    }

    private resetFlags(): void {
        this.memberSaveSuccess = false;
        this.memberSaveFailure = false;
        this.memberPhoneValidationFailure = false;
        this.memberValidationFailure = false;
        this.validating = false;
        this.saving = false;
    }

    async goValidateNSave(): Promise<void> {
        if (this.validating || this.saving || this.membersBeingSaved.has(this.item.phone)) return;

        this.resetFlags();
        this.saving = true;
        this.membersBeingSaved.add(this.item.phone);

        if (this.isInvalidMemberData()) {
            this.memberValidationFailure = true;
            this.saving = false;
            this.membersBeingSaved.delete(this.item.phone);
        } else {
            this.firebaseService.getMemberByPhone(this.item.phone).pipe(take(1)).subscribe({
                next: async (members) => {
                    if (members.length > 0) {
                        this.memberPhoneExists = true;
                        this.member = members[0];
                    } else {
                        await this.firebaseService.addMember(this.item);
                        this.memberSaveSuccess = true;
                        setTimeout(() => {
                            this.memberSaveSuccess = false;
                            this.resetFormData();
                        }, 3000);
                    }
                    this.saving = false;
                    this.membersBeingSaved.delete(this.item.phone);
                },
                error: (err) => {
                    console.error("Error saving member data:", err);
                    this.memberSaveFailure = true;
                    this.saving = false;
                    this.membersBeingSaved.delete(this.item.phone);
                }
            });
        }
    }

    // async onPhoneChange() {
    //     this.validating = true;
    //     this.memberPhoneExists = false;
    //     this.memberSaveSuccess = false;
    //     this.memberSaveFailure = false;
    //     this.memberPhoneValidationFailure = false;
    //     this.memberValidationFailure = false;
    //     //this.requestSentSuccess = false;
    //     //this.requestSentFailure = false;
    //     //debugger;
    //     console.log('checking existing user by phone!! 6: ' + this.item.phone);
    //     if (this.item.phone == "" || (this.item.phone).toString().length < 10 || (this.item.phone).toString().length > 10) {
    //         console.log("दिलेला फोन, नाव व इतर माहिती तपासून पहा!! 7");
    //         this.memberPhoneValidationFailure = true;
    //         this.validating = false;
    //     } else {
    //         (await this.firebaseService.getMemberByPhonev2(this.item.phone)).subscribe(async members => {
    //             console.log('checking existing user by phone!! 8: ' + this.item.phone + ", exists: " + members == null);
    //             if (members.length > 0) {
    //                 console.log('Found a existing member with same phone!! 9');
    //                 this.memberPhoneExists = true;
    //             }
    //             this.validating = false;
    //         });
    //     }
    // }

    villagesByTaluka: village[] = [];

    onTalukaChange(event: any) {
        this.item.taluka = event.target.value;
        localStorage.setItem("mytaluka", event.target.value);
        console.log('Taluka changed to:', this.item.taluka);

        // Filter the villages array by the selected taluka
        this.villagesByTaluka = this.villages.filter(village => village.taluka === this.item.taluka);

        this.item.village = this.item.taluka; //most of the time taluka n village are same. satara - satara etc.
        localStorage.setItem("myvillage", this.item.taluka);
    }

    onVillageChange(event: any) {
        this.item.village = event.target.value;
        localStorage.setItem("myvillage", event.target.value);
        console.log('Village changed to:', this.item.village);
    }

    userTalukaSelection = 'सातारा';
    userVillageSelection = 'सातारा';

    resetFormData() {
        //clear data fields
        this.memberPhoneExists = false;
        this.userTalukaSelection = localStorage.getItem("mytaluka") || 'सातारा';
        this.userVillageSelection = localStorage.getItem("myvillage") || 'सातारा';

        this.item = {
            initial: "ज.",
            fname: "",
            lname: "शिकलगार",
            address: "",
            district: "सातारा",
            taluka: this.userTalukaSelection,
            village: this.userVillageSelection,
            dist: "सातारा",
            designation: "सभासद",
            phone: "",
            joinedOn: "1/1/2025",
            //donationType: "",
            //donationAmount: "",
            //donationDate: "",
            //remembranceName: "",
            //remembranceDate: "",
            //remembranceVillage: "",
        }

        if (this.member?.fname !== "") this.item = this.member;

        // Create a synthetic event for testing
        const syntheticEvent = {
            target: {
                value: this.userTalukaSelection
            }
        };

        // Trigger the onTalukaChange method programmatically
        this.onTalukaChange(syntheticEvent);
    }

    item: any = {};

    loadMemberInformation() {
        this.memberPhoneExists = false;
        this.resetFormData();
    }

    onCancel() {
        this.member = { lname: "", fname: "", mname: "", taluka: "", village: "", dist: "", phone: "", designation: "सभासद" };
        this.resetFormData();
    }
}
