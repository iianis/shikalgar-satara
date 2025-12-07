import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { EducationComponent } from '../education/education.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { InitiativesComponent } from '../initiatives/initiatives.component';
import { DonorsComponent } from '../donors/donors.component';
import { RemembranceComponent } from '../remembrance/remembrance.component';
import { VerificationComponent } from '../verification/verification.component';
import { AchievementsComponent } from '../achievements/achievements.component';
import { DirectorsComponent } from '../directors/directors.component';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css'],
    standalone: false
})
export class ActivitiesComponent implements OnInit, AfterViewInit {
    @ViewChildren(CdkPortalOutlet) dynamicComponentRefs!: QueryList<CdkPortalOutlet>;

    activities = [
        { name: "शैक्षणिक व इतर शिष्यवृत्ती", component: EducationComponent },
        { name: "उल्लेखनीय कामगिरी", component: AchievementsComponent },
        { name: "जात प्रमाणपत्र / पडताळणी", component: VerificationComponent },
        { name: "ज्येष्ठांच्या आठवणी", component: RemembranceComponent },
        { name: "देणगीदार", component: DonorsComponent },
        { name: "विचाराधीन योजना", component: InitiativesComponent },
        { name: "कार्यकारणी", component: DirectorsComponent },
        { name: "Gallery", component: GalleryComponent },
    ];

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        // Initialize components if necessary after the view has been initialized
    }

    loadComponent(index: number) {
        const container = this.dynamicComponentRefs.toArray()[index];
        container.detach(); // Clear previous component if any
        const componentPortal = new ComponentPortal(this.activities[index].component);
        container.attachComponentPortal(componentPortal);
    }
}
