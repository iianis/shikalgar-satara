import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CharityRecord {
    name: string;
    village: string;
    taluka: string;
    type: string;
    amount: number;
    date: string;
    description: string;
}

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    imports: [CommonModule, FormsModule],
    standalone: true
})
export class AnnouncementComponent implements OnInit {
    location = inject(Location);

    selectedTypeFilter = 'सर्व';
    searchTerm = '';

    charity2families: CharityRecord[] = [
        { "name": "बिस्मिल्लाह अकबर", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "नजमा मोहसिन", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "असगरअली हुसेन", "village": "सातारा", "taluka": "सातारा", "type": "वैद्यकीय", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "शहनाज हनीफ", "village": "भाडळे", "taluka": "खटाव", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "रजिया रज्जाक", "village": "भाडळे", "taluka": "खटाव", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "मुसाभाई", "village": "सर्कलवाडी", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "नादान मोहम्मद", "village": "वर्धनगड", "taluka": "खटाव", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "हाफिज यासीन", "village": "खटाव", "taluka": "खटाव", "type": "आर्थिक", "amount": 3000, "date": "24-03-24", "description": "" },
        { "name": "जाहिरा यासीन", "village": "बुध", "taluka": "खटाव", "type": "आर्थिक", "amount": 3000, "date": "24-03-24", "description": "" },
        { "name": "नसीमा आसिफ", "village": "कुळकजाई", "taluka": "माण", "type": "आर्थिक", "amount": 3000, "date": "18-02-24", "description": "" },
        { "name": "रुकय्या हातिम", "village": "शेरे", "taluka": "कराड", "type": "आर्थिक", "amount": 3000, "date": "26-02-24", "description": "" },
        { "name": "बानू सुलेमान", "village": "ओगलेवाडी", "taluka": "कराड", "type": "आर्थिक", "amount": 3000, "date": "27-03-24", "description": "" },
        { "name": "रेहाना गुलामहुसेन", "village": "कालवडे", "taluka": "कराड", "type": "आर्थिक", "amount": 3000, "date": "05-04-24", "description": "" },
        { "name": "रेश्मा शकील", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 3000, "date": "05-04-24", "description": "" },
        { "name": "नियाज दस्तगीर", "village": "कुळकजाई", "taluka": "माण", "type": "वैद्यकीय", "amount": 5000, "date": "03-09-24", "description": "" },
        { "name": "शहनाज नजीर", "village": "कराड", "taluka": "कराड", "type": "आर्थिक", "amount": 3000, "date": "19-06-2024", "description": "" },
        { "name": "मुमताज खुदबुद्दीन", "village": "कराड", "taluka": "कराड", "type": "वैद्यकीय", "amount": 5000, "date": "17-07-2024", "description": "" },
        { "name": "बिस्मिल्लाह अकबर", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "नजमा मोहसिन", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "रेश्मा शकील", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "शहनाज हनीफ", "village": "भाडळे", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "रजिया रज्जाक", "village": "भाडळे", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "मुसाभाई", "village": "सर्कलवाडी", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "नादान मोहम्मद", "village": "वर्धनगड", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "हाफिज यासीन", "village": "खटाव", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "जाहिरा यासीन", "village": "बुध", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "नसीमा आसिफ", "village": "कुळकजाई", "taluka": "माण", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "रुकय्या हातिम", "village": "शेरे", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "बानू सुलेमान", "village": "ओगलेवाडी", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "रेहाना गुलामहुसेन", "village": "कालवडे", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "शहनाज नजीर", "village": "कराड", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "मुमताज खुदबुद्दीन", "village": "कराड", "taluka": "कराड", "type": "वैद्यकीय", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "असद मोहम्मद खुदबुद्दीन नदाफ", "village": "नागठाणे", "taluka": "सातारा", "type": "वैद्यकीय", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "नजमुन हसन", "village": "शेणोली", "taluka": "कराड", "type": "वैद्यकीय", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "सानिया अब्दुल शकूर", "village": "सातारा", "taluka": "सातारा", "type": "शैक्षणिक", "amount": 5000, "date": "18-01-25", "description": "डी. फार्म" },
        { "name": "तानसिया आरिफ रहीमान", "village": "वर्धनगड", "taluka": "खटाव", "type": "शैक्षणिक", "amount": 5000, "date": "18-01-25", "description": "बी.एस्सी. नर्सिंग" },
        { "name": "आरजू फारूक मोहम्मद", "village": "वर्धनगड", "taluka": "खटाव", "type": "शैक्षणिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "मलिक अलीभाई", "village": "शेणोली स्टेशन", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "मदिना रमजान", "village": "विराळी", "taluka": "माण", "type": "वैद्यकीय", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "हसीना रियाज", "village": "सातारा रोड", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 5000, "date": "18-01-25", "description": "" },
        { "name": "नसरीन नसीम", "village": "वर्धनगड", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "05-06-25", "description": "तातडीची मदत" },
        { "name": "शमाबी आरिफ", "village": "कोरेगाव", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 5000, "date": "12-08-25", "description": "" },
        { "name": "झाकिर अन्वर", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 5000, "date": "18-09-25", "description": "" },
        { "name": "सानिया अब्दुल शकूर", "village": "सातारा", "taluka": "सातारा", "type": "शैक्षणिक", "amount": 10000, "date": "18-09-25", "description": "डी. फार्म" },
        { "name": "आरिश सलीम", "village": "शिरवळ", "taluka": "खंडाळा", "type": "शैक्षणिक", "amount": 10000, "date": "23-08-25", "description": "कॉम्प्युटर इंजिनिअरिंग" },
        { "name": "मोहम्मद साद नसीम", "village": "वर्धनगड", "taluka": "खटाव", "type": "शैक्षणिक", "amount": 10000, "date": "06-10-25", "description": "एम.सी.एस." },
        { "name": "इरफान नियाज", "village": "शिरवळ", "taluka": "खंडाळा", "type": "शैक्षणिक", "amount": 10000, "date": "18-11-25", "description": "बी. फार्म" },
        { "name": "हाफिजा हुसेन", "village": "वर्धनगड", "taluka": "खटाव", "type": "आर्थिक", "amount": 0, "date": "27-09-25", "description": "" },
        { "name": "रमजान पापामिया", "village": "सातारा", "taluka": "सातारा", "type": "वैद्यकीय", "amount": 0, "date": "04-01-25", "description": "" },
        { "name": "फिरोज नूरमोहम्मद", "village": "नेर", "taluka": "खटाव", "type": "नैसर्गिक आपत्ती", "amount": 10000, "date": "04-01-26", "description": "आगीत घर जळून खाक झाले" },
        { "name": "नसीमा आसिफ", "village": "कुळकजाई", "taluka": "माण", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "नादान मोहम्मद", "village": "वर्धनगड", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "हाफिज यासीन", "village": "खटाव", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "जाहिरा यासीन", "village": "बुध", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "रुकय्या हातिम", "village": "शेरे", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "नजमुन हाशिम", "village": "शेणोली", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "तबस्सुम सलीम", "village": "शिरवळ", "taluka": "खंडाळा", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "तातडीची मदत" },
        { "name": "अफसाना नियाज", "village": "शिरवळ", "taluka": "खंडाळा", "type": "आर्थिक", "amount": 5000, "date": "15-02-26", "description": "" },
        { "name": "हसीना रियाज", "village": "सातारा रोड", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 5000, "date": "18-02-26", "description": "" },
        { "name": "शहनाज हनीफ", "village": "भाडळे", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-02-26", "description": "" },
        { "name": "रजिया रज्जाक", "village": "भाडळे", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-02-26", "description": "" },
        { "name": "शमाबी आरिफ", "village": "कोरेगाव", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 5000, "date": "18-02-26", "description": "" },
        { "name": "रेश्मा शकील", "village": "सातारा", "taluka": "सातारा", "type": "आर्थिक", "amount": 5000, "date": "18-02-26", "description": "" },
        { "name": "नसरीन नसीम", "village": "वर्धनगड", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "23-02-26", "description": "" },
        { "name": "नाजिया समीर", "village": "सर्कलवाडी", "taluka": "कोरेगाव", "type": "आर्थिक", "amount": 5000, "date": "23-02-26", "description": "" },
        { "name": "इसाक सुलेमान", "village": "ओगलेवाडी", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "07-03-26", "description": "" },
        { "name": "रेहाना गुलामहुसेन", "village": "कालवडे", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "07-03-26", "description": "" },
        { "name": "मोहम्मद रसूल", "village": "दारूज", "taluka": "खटाव", "type": "आर्थिक", "amount": 5000, "date": "18-03-26", "description": "" },
        { "name": "सिकंदर बाबलाल", "village": "नागठाणे", "taluka": "सातारा", "type": "वैद्यकीय", "amount": 5000, "date": "14-06-26", "description": "" },
        { "name": "सरफराज नवाज", "village": "जयरामस्वामी वडगाव", "taluka": "खटाव", "type": "शैक्षणिक", "amount": 10000, "date": "14-06-26", "description": "" },
        { "name": "मुसा मोहम्मद", "village": "रेठरे बुद्रुक", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "14-06-26", "description": "" },
        { "name": "अस्मा जैनुद्दीन", "village": "रेठरे बुद्रुक", "taluka": "कराड", "type": "आर्थिक", "amount": 5000, "date": "14-06-26", "description": "" },
        { "name": "आरिश सलीम", "village": "शिरवळ", "taluka": "खंडाळा", "type": "शैक्षणिक", "amount": 10000, "date": "23-07-26", "description": "" },
        { "name": "खुशी रियाज", "village": "सातारा रोड", "taluka": "कोरेगाव", "type": "शैक्षणिक", "amount": 10000, "date": "23-07-26", "description": "" },
        { "name": "निसार राजासाहेब", "village": "विराळी", "taluka": "माण", "type": "शैक्षणिक", "amount": 10000, "date": "11-10-26", "description": "" },
        { "name": "रेहाना जमीर", "village": "दहीवडी", "taluka": "माण", "type": "आर्थिक", "amount": 5000, "date": "11-10-26", "description": "" },
        { "name": "अस्लम दस्तगीर", "village": "फलटण", "taluka": "फलटण", "type": "आर्थिक", "amount": 5000, "date": "11-10-26", "description": "" }
    ];

    ngOnInit(): void { }

    goBack(): void {
        this.location.back();
    }

    // Category summary helpers
    getTypeCount(type: string): number {
        return this.charity2families.filter(item => item.type === type).length;
    }

    getTypeTotal(type: string): number {
        return this.charity2families
            .filter(item => item.type === type)
            .reduce((sum, item) => sum + (item.amount || 0), 0);
    }

    getTotalAmount(): number {
        return this.charity2families.reduce((sum, item) => sum + (item.amount || 0), 0);
    }

    getUniqueBeneficiaries(): number {
        return new Set(this.charity2families.map(i => i.name.trim())).size;
    }

    // Filter list for table view
    get filteredCharityList(): CharityRecord[] {
        return this.charity2families.filter(item => {
            const matchesType = this.selectedTypeFilter === 'सर्व' || item.type === this.selectedTypeFilter;
            const term = this.searchTerm.trim().toLowerCase();
            const matchesSearch = !term ||
                item.name.toLowerCase().includes(term) ||
                item.village.toLowerCase().includes(term) ||
                item.taluka.toLowerCase().includes(term) ||
                (item.description && item.description.toLowerCase().includes(term));
            return matchesType && matchesSearch;
        });
    }

    // Badge styling
    getBadgeClass(type: string): string {
        switch (type) {
            case 'शैक्षणिक': return 'bg-success';
            case 'वैद्यकीय': return 'bg-danger';
            case 'आर्थिक': return 'bg-primary';
            case 'नैसर्गिक आपत्ती': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    }
}