import { Component } from '@angular/core';

@Component({
    selector: 'app-affiliates',
    templateUrl: './affiliates.component.html',
    //styleUrls: ['./affiliates.component.css'],
    standalone: false
})
export class AffiliatesComponent {
    masterData = [
        { name: "शिकलगार जमात ट्रस्ट, मुंबई", contact: "ज. नौशादभाई शिकलगार", phone: "9930254884", photo: "../../assets/images/affiliate1.jpg" },
        { name: "पुणे जिल्हा सिक्कलगार समाज सेवा संघ", contact: "ज. सलिमभाई सिक्कलगार", phone: "9822038203", photo: "/assets/images/profile.jpg" },
        { name: "सांगली जिल्हा मुस्लीम शिकलगार संघटना, विटा", contact: "ज. असिफ अली शिकलगार", phone: "9420340230", photo: "/assets/images/profile.jpg" },
        { name: "सोलापूर जिल्हा मुस्लीम शिकलगार संघटना", contact: "ज. रशिद शेख - शिकलगार", phone: "", photo: "/assets/images/profile.jpg" },
        { name: "महाराष्ट्र सिक्कलगर जमात, बुलढाणा", contact: "ज. इब्राहिमभाई सिक्कलगर", phone: "9881329403", photo: "/assets/images/profile.jpg" },
    ];
}
