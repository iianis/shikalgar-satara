import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.css'],
    standalone: false
})
export class LogoComponent {

    router = inject(Router);

    addEvent() {
        alert("hi");
        this.router.navigateByUrl('membersnew');
    }
}
