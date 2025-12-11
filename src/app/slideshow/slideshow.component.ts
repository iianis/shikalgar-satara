import { Component } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
    selector: 'app-slideshow',
    templateUrl: './slideshow.component.html',
    styleUrls: ['./slideshow.component.css'],
    standalone: false
})
export class SlideshowComponent {
    slides = [
        { title: "", image: "/assets/images/slide1.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide10.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide2.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide3.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide4.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide5.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide6.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide7.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide8.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide9.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide11.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/images/slide12.jpeg", header1: "", header2: "" },
    ];
}


// slide 1 - dharwala
// slide 2 - karishma
// slide 3 - lokseva
// slide 4 - shenoli
// slide 5 - nagthane
// satara 6 - adhiveshan
