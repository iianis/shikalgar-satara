import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule, Location } from '@angular/common';
import { NgxOrgChartComponent } from '@ahmedaoui/ngx-org-chart';
import { FormsModule } from '@angular/forms';

interface Member {
    id: number;
    name: string;
    parentid: number | null;
    relation?: string;
    hierarchyid: number;
    education?: string;
    village?: string;
    occupation?: string;
    dob?: string;
    status?: string;
    phone?: string;
}

interface INode {
    name: string;
    cssClass: string;
    childs?: INode[];
}

@Component({
    selector: 'app-familytree',
    templateUrl: './familytree.component.html',
    //template: '<div #chartContainer></div>',
    styleUrls: ['./familytree.component.css'],
    imports: [NgxOrgChartComponent, CommonModule, FormsModule],
    standalone: true
})
export class FamilytreeComponent implements OnInit {

    constructor() { console.log("0"); }
    location = inject(Location);
    firebaseService = inject(FirebaseService);

    familyTree: INode[] = [];
    fullTree: INode[] = [];
    members: any[] = [];
    hierarchyTree: any[] = [];
    selectedTree: INode[] = [];
    showLeft = true;
    selectedFamily = "";

    ngOnInit() {
        //this.hierarchyTree = this.buildHierarchy(2); // depth limit = 2
    }

    // Helper: compute depth of a node
    getDepth(id: number): number {
        let depth = 0;
        let current = this.members.find(m => m.id === id);
        while (current && current.parentid !== null) {
            depth++;
            console.log(depth);
            current = this.members.find(m => m.id === current?.parentid);
        }
        return depth;
    }

    buildHierarchy(maxDepth: number): any[] {
        const buildNode = (member: Member, depth: number): any => {
            if (depth > maxDepth) return null;
            const children = this.members.filter(m => m.parentid === member.id);
            return {
                id: member.id,
                name: member.name,
                //cssClass: this.getCssClass(member.hierarchyid), // assign style based on relation
                childs: children
                    .map(c => buildNode(c, depth + 1))
                    .filter(c => c !== null)
            };
        };

        // roots = members with parentid null
        return this.members
            .filter(m => m.parentid === null)
            .map(root => buildNode(root, 0));
    }

    selectNode(id: number) {
        this.selectedTree = [this.buildSubTree(id)];
        this.showLeft = false; // hide left, show right

    }

    buildSubTree(id: number): INode {
        const member = this.members.find(m => m.id === id)!;
        const children = this.members.filter(m => m.parentid === id);
        return {
            name: member.name,
            cssClass: 'ngx-org-member',
            childs: children.map(c => this.buildSubTree(c.id))
        };
    }

    goBack(): void {
        this.showLeft = true; // show left again
        this.selectedTree = [];
    }

    buildOrgTree(members: Member[]): INode[] {
        // Step 1: Create a lookup map
        const lookup: { [key: number]: INode } = {};
        console.log("buildOrgTree");
        members.forEach(m => {
            lookup[m.id] = {
                name: m.name,
                cssClass: this.getCssClass(m.hierarchyid), // assign style based on relation
                childs: []
            };
        });

        // Step 2: Build hierarchy
        const roots: INode[] = [];
        members.forEach(m => {
            if (m.parentid === null) {
                // root node
                roots.push(lookup[m.id]);
            } else {
                // attach to parent
                const parent = lookup[m.parentid];
                if (parent) {
                    parent.childs!.push(lookup[m.id]);
                }
            }
        });

        return roots;
    }

    // Helper: decide CSS class based on relation
    getCssClass(hierarchyid: number = 0): string {
        //if (hierarchyid) return 'ngx-org-member';
        console.log("hierarchyid: " + hierarchyid);
        switch (hierarchyid) {
            case 0:
                return 'ngx-org-ceo';
            case 1:
                return 'ngx-org-head';
            case 2:
                return 'ngx-org-ceo';
            case 3:
                return 'ngx-org-ceo';
            case 4:
                return 'ngx-org-ceo';
            case 5:
                return 'ngx-org-ceo';
            default:
                return 'ngx-org-member';
        }
    }

    // Define an event handler for clicks
    public onNodeClick(node: any): void {
        console.log('Node clicked:', node);
        alert(`You clicked on ${node.name}`);
    }

    loadTree(type: string) {
        this.selectedFamily = type;
        if (type === 'kulakjai') {
            this.members = this.members1;
        } else if (type === 'baramati') {
            this.members = this.members2;
        }

        this.hierarchyTree = this.buildHierarchy(2); // depth limit = 2
        this.showLeft = true; // reset to left panel view
    }

    members1: Member[] = [
        { id: 1, name: "Sheikhusman Baban", hierarchyid: 0, relation: "Aadi-Purush", parentid: null },
        { id: 2, name: "Mohamad+Bibi", hierarchyid: 1, relation: "", parentid: 1 },
        { id: 3, name: "Sheikhdin+Khutub", hierarchyid: 1, relation: "", parentid: 1 },
        { id: 4, name: "Dhondubai", hierarchyid: 1, relation: "", parentid: 1 },
        { id: 5, name: "Sharifa+Gulab", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 6, name: "Halima+Mohamad", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 7, name: "Mumtaz+Yusuf", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 8, name: "Amina+Babalal", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 9, name: "Nijamuddin+Salima", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 10, name: "Mubarak+Najma", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 12, name: "Roshan+Balekhan", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 13, name: "Nyamat+Mehboob", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 11, name: "Tajuddin+Noorjahan", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 14, name: "Kulsum+Chand", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 15, name: "Umda+Husein", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 16, name: "Jannat+Abdul", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 17, name: "Madina+Allabaksha", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 18, name: "Abbas+Johra", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 19, name: "Ismail+Hasmat", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 20, name: "Allahbaksh+Jubeda", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 21, name: "Chandbi+", hierarchyid: 3, relation: "", education: "", occupation: "", dob: "", status: "", parentid: 18 },
        { id: 22, name: "Sugra+", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 66, name: "Dastagir+Pyaran", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 23, name: "Suleiman+", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 24, name: "Rajjak+Najma", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 25, name: "Dilawar+Laila", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 26, name: "Ayesha-Funddi+Rafiq", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 27, name: "Noorjahan-Baidi", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 28, name: "Rajma+Nijam", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 29, name: "Imran+Nilofar", hierarchyid: 4, relation: "", parentid: 23 },
        { id: 291, name: "D1", hierarchyid: 4, relation: "", parentid: 29 },
        { id: 292, name: "D2", hierarchyid: 4, relation: "", parentid: 29 },
        { id: 30, name: "Firdos+Firoz", hierarchyid: 4, relation: "", parentid: 23 },
        { id: 31, name: "Asif+Naseema", hierarchyid: 4, relation: "", parentid: 24 },
        { id: 32, name: "Asiya-Shendrewali", hierarchyid: 4, relation: "", parentid: 24 },
        { id: 33, name: "Sahil", hierarchyid: 4, relation: "", parentid: 25 },
        { id: 34, name: "Karishma", hierarchyid: 4, relation: "", parentid: 25 },
        { id: 35, name: "Kaisar", hierarchyid: 4, relation: "", parentid: 25 },
        { id: 36, name: "Salman", hierarchyid: 4, relation: "", parentid: 26 },
        { id: 37, name: "Nilofar", hierarchyid: 4, relation: "", parentid: 26 },
        { id: 38, name: "Ayub+Rehana", hierarchyid: 4, relation: "", parentid: 28 },
        { id: 39, name: "Zhakir", hierarchyid: 4, relation: "", parentid: 28 },
        { id: 40, name: "Wajid", hierarchyid: 5, relation: "", parentid: 38 },
        { id: 41, name: "Farida+Haroon", hierarchyid: 3, relation: "", parentid: 20 },
        { id: 411, name: "Fayaz", hierarchyid: 3, relation: "", parentid: 41 },
        { id: 412, name: "Jasmin", hierarchyid: 3, relation: "", parentid: 41 },
        { id: 42, name: "Shakil", hierarchyid: 3, relation: "", parentid: 20 },
        { id: 43, name: "Akil+Tanuja", hierarchyid: 3, relation: "", parentid: 20 },
        { id: 431, name: "Mansoor", hierarchyid: 3, relation: "", parentid: 43 },
        { id: 432, name: "Rehmaan", hierarchyid: 3, relation: "", parentid: 43 },
        { id: 44, name: "Afsana+Bashir", hierarchyid: 3, relation: "", parentid: 20 }, // (Koregaon - Walhekarwadi)
        { id: 441, name: "Kabir", hierarchyid: 3, relation: "", parentid: 44 },
        { id: 45, name: "Shahjaan+Ajmuddin", hierarchyid: 3, relation: "", parentid: 20 }, // (Mumbai - Ulhasnagar)
        { id: 451, name: "Rahil", hierarchyid: 3, relation: "", parentid: 45 },
        { id: 452, name: "Firdos", hierarchyid: 3, relation: "", parentid: 45 },
        //{ id: 46, name: "Wajid", hierarchyid: 0, relation: "", parentid: 20 },
        { id: 47, name: "Surraiya+Hanif", hierarchyid: 0, relation: "", parentid: 19 },
        { id: 48, name: "Najma+Nijam", hierarchyid: 0, relation: "", parentid: 19 },
        { id: 49, name: "Musa+Najma", hierarchyid: 0, relation: "", parentid: 19 },
        { id: 50, name: "Isak+Latifa", hierarchyid: 0, relation: "", parentid: 19 },
        { id: 51, name: "Salma+Dastagir", hierarchyid: 0, relation: "", parentid: 19 },
        { id: 52, name: "Riyaj+Samiran", hierarchyid: 0, relation: "", parentid: 47 },
        { id: 53, name: "Tanveer", hierarchyid: 0, relation: "", parentid: 52 },
        { id: 54, name: "Aman", hierarchyid: 0, relation: "", parentid: 52 },
        { id: 55, name: "Anjum", hierarchyid: 0, relation: "", parentid: 47 },
        { id: 56, name: "Shama", hierarchyid: 0, relation: "", parentid: 47 },
        { id: 561, name: "Samina", hierarchyid: 0, relation: "", parentid: 47 },
        { id: 562, name: "Saira", hierarchyid: 0, relation: "", parentid: 47 },
        { id: 57, name: "Waseem+", hierarchyid: 0, relation: "", parentid: 49 }, //2
        { id: 58, name: "Mohsin+", hierarchyid: 0, relation: "", parentid: 49 }, //
        { id: 59, name: "Rinaj", hierarchyid: 0, relation: "", parentid: 49 },
        { id: 60, name: "Minaj", hierarchyid: 0, relation: "", parentid: 49 },
        { id: 61, name: "Niyaj+", hierarchyid: 0, relation: "", parentid: 51 },
        { id: 62, name: "Nawaj+", hierarchyid: 0, relation: "", parentid: 51 },
        { id: 63, name: "Eliza+Wajid", hierarchyid: 0, relation: "", parentid: 51 },
        { id: 64, name: "Parvej+Anjum", hierarchyid: 0, relation: "", parentid: 50 },
        { id: 65, name: "Ijaz+Sana", hierarchyid: 0, relation: "", parentid: 50 }, //
        { id: 67, name: "Sadik+", hierarchyid: 0, relation: "", parentid: 66 },
        { id: 671, name: "S1", hierarchyid: 0, relation: "", parentid: 67 },
        { id: 672, name: "S2", hierarchyid: 0, relation: "", parentid: 67 },
        { id: 68, name: "Shabnam(Binno)+Sikandar", hierarchyid: 0, relation: "", village: "Ner", parentid: 66 },
        { id: 681, name: "Sahil", hierarchyid: 0, relation: "", parentid: 68 },
        { id: 682, name: "Zeenat", hierarchyid: 0, relation: "", parentid: 68 },
        { id: 69, name: "Shahjaan", hierarchyid: 0, relation: "", parentid: 66 },
        { id: 70, name: "Shamim+Salim", hierarchyid: 0, relation: "", parentid: 9 },
        { id: 71, name: "Riyaj+Jahida", hierarchyid: 0, relation: "", parentid: 9 },
        { id: 72, name: "Anis+Shabana", hierarchyid: 0, relation: "", parentid: 9 },
        { id: 73, name: "Saif Ali", hierarchyid: 0, relation: "", parentid: 70 },
        { id: 74, name: "Aman", hierarchyid: 0, relation: "", parentid: 70 },
        { id: 75, name: "Simran", hierarchyid: 0, relation: "", parentid: 71 },
        { id: 76, name: "Sana", hierarchyid: 0, relation: "", parentid: 71 },
        { id: 77, name: "Sahil", hierarchyid: 0, relation: "", parentid: 72 },
        { id: 78, name: "Mansoor", hierarchyid: 0, relation: "", parentid: 11 },
        { id: 79, name: "Sameer+Nida", hierarchyid: 0, relation: "", parentid: 11 },
        { id: 80, name: "Aaliya", hierarchyid: 0, relation: "", parentid: 79 },
        { id: 81, name: "Farhaan", hierarchyid: 0, relation: "", parentid: 79 },
        { id: 82, name: "Wahida+Ikram", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 83, name: "Saira+Iqbal", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 84, name: "Mushtaq+Samina", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 85, name: "Firoz+Firdos", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 86, name: "Saniya", hierarchyid: 0, relation: "", parentid: 82 },
        { id: 87, name: "Soyeb", hierarchyid: 0, relation: "", parentid: 83 },
        { id: 88, name: "Mohsin", hierarchyid: 0, relation: "", parentid: 83 },
        { id: 89, name: "Arsh", hierarchyid: 0, relation: "", parentid: 84 },
        { id: 90, name: "Aliya", hierarchyid: 0, relation: "", parentid: 84 },
        { id: 91, name: "Anam", hierarchyid: 0, relation: "", parentid: 84 },
        { id: 92, name: "Rehan", hierarchyid: 0, relation: "", parentid: 85 },
        { id: 93, name: "Sara", hierarchyid: 0, relation: "", parentid: 85 },
        { id: 94, name: "Ayub+Naseem", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 95, name: "Hazara(Bebi)+Ismail", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 96, name: "Isaq+Noorjahan", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 97, name: "Nisar+Rizwana", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 98, name: "Shirin+", hierarchyid: 0, relation: "", parentid: 94 },
        { id: 99, name: "Zareen+", hierarchyid: 0, relation: "", parentid: 94 },
        { id: 100, name: "S", hierarchyid: 0, relation: "", parentid: 94 },
        { id: 101, name: "Asif+Rinaz", hierarchyid: 0, relation: "", parentid: 95 },
        { id: 102, name: "Firoz+Minaj", hierarchyid: 0, relation: "", parentid: 95 },
        { id: 103, name: "Farheen+Shiv", hierarchyid: 0, relation: "", parentid: 101 },
        { id: 104, name: "Eshal", hierarchyid: 0, relation: "", parentid: 101 },
        { id: 105, name: "Sofiya", hierarchyid: 0, relation: "", parentid: 102 },
        { id: 106, name: "Mahera", hierarchyid: 0, relation: "", parentid: 102 },
        { id: 107, name: "Shiraz+Nilofar", hierarchyid: 0, relation: "", parentid: 96 }, //D1, D2
        { id: 108, name: "Ajim+Jasmin", hierarchyid: 0, relation: "", parentid: 96 },
        { id: 109, name: "Zaheer+Jasmin", hierarchyid: 0, relation: "", parentid: 96 }, //Amyra, D2
        { id: 110, name: "Tanisha", hierarchyid: 0, relation: "", parentid: 107 },
        { id: 111, name: "Tasmiya", hierarchyid: 0, relation: "", parentid: 107 },
        { id: 112, name: "Zubair", hierarchyid: 0, relation: "", parentid: 108 },
        { id: 113, name: "Zainab", hierarchyid: 0, relation: "", parentid: 108 },
        { id: 114, name: "Amyra", hierarchyid: 0, relation: "", parentid: 109 },
        { id: 115, name: "Alayana", hierarchyid: 0, relation: "", parentid: 109 },
        { id: 116, name: "Rameez+Aliya", hierarchyid: 0, relation: "", parentid: 97 },
        { id: 117, name: "Asim", hierarchyid: 0, relation: "", parentid: 97 },
        { id: 118, name: "Arisha", hierarchyid: 0, relation: "", parentid: 116 },
        { id: 119, name: "Rizkin", hierarchyid: 0, relation: "", parentid: 116 },
        { id: 120, name: "Aslam+Yasmin", hierarchyid: 0, relation: "", parentid: 8 },
        { id: 121, name: "Tausif+Farheen", hierarchyid: 0, relation: "", parentid: 120 },
        { id: 122, name: "Naved+Heena", hierarchyid: 0, relation: "", parentid: 120 },
        { id: 123, name: "Sabiha", hierarchyid: 0, relation: "", parentid: 121 },
        { id: 124, name: "Anaya", hierarchyid: 0, relation: "", parentid: 122 },
        { id: 125, name: "Shafiya+Dilerkhan", hierarchyid: 0, relation: "", parentid: 12 },
        { id: 126, name: "S", hierarchyid: 0, relation: "", parentid: 125 },
        { id: 127, name: "D", hierarchyid: 0, relation: "", parentid: 125 },
        { id: 128, name: "Ajim+Tajannum", hierarchyid: 0, relation: "", parentid: 14 },
        { id: 129, name: "Shahnoor+Firoz", hierarchyid: 0, relation: "", parentid: 14 },
        { id: 1291, name: "Swaliha", hierarchyid: 0, relation: "", parentid: 129 },
        { id: 1292, name: "Alfiya", hierarchyid: 0, relation: "", parentid: 129 },
        { id: 1293, name: "Zakiya", hierarchyid: 0, relation: "", parentid: 129 },
        { id: 130, name: "Mubasshir", hierarchyid: 0, relation: "", parentid: 128 },
        { id: 131, name: "Tahir", hierarchyid: 0, relation: "", parentid: 128 },
        { id: 132, name: "Muneer", hierarchyid: 0, relation: "", parentid: 128 },
        { id: 133, name: "Aasiya+Mahmood", hierarchyid: 0, relation: "", village: "Karad", parentid: 13 },
        { id: 1331, name: "Rafat", hierarchyid: 0, relation: "", parentid: 133 },
        { id: 134, name: "Shamshad+Mukhtar", hierarchyid: 0, relation: "", village: "Kondhwa Pune", parentid: 13 },
        { id: 1341, name: "Arbaaz", hierarchyid: 0, relation: "", parentid: 134 },
        { id: 1342, name: "Rukhsar+ Attar", hierarchyid: 0, relation: "", village: "Dehu Pune", parentid: 134 },
        { id: 135, name: "Sadik+Rameeza", hierarchyid: 0, relation: "", village: "Karad", parentid: 13 },
        { id: 1351, name: "Swaliha", hierarchyid: 0, relation: "", parentid: 135 },
        { id: 1352, name: "Firdos", hierarchyid: 0, relation: "", parentid: 135 },
        { id: 1353, name: "Aksa", hierarchyid: 0, relation: "", parentid: 135 },
        { id: 136, name: "Bebinaaz+Aayaj", hierarchyid: 0, relation: "", village: "Kondhawa Pune", parentid: 13 },
        { id: 1361, name: "Faizal", hierarchyid: 0, relation: "", parentid: 136 },
        { id: 1362, name: "Kaif", hierarchyid: 0, relation: "", parentid: 136 },
        { id: 137, name: "Jasmin+Kamil", hierarchyid: 0, relation: "", village: "Moshi Chikhli Pune", parentid: 13 },
        { id: 1371, name: "Arshiya", hierarchyid: 0, relation: "", village: "", parentid: 137 },
        { id: 1372, name: "Faeem", hierarchyid: 0, relation: "", village: "", parentid: 137 },
        { id: 138, name: "Gulshan+Gulab", hierarchyid: 0, relation: "", parentid: 5 },
        { id: 139, name: "Amin", hierarchyid: 0, relation: "", parentid: 5 },
        { id: 140, name: "Afsar Ali", hierarchyid: 0, relation: "", parentid: 138 },
        { id: 141, name: "Suraiyya", hierarchyid: 0, relation: "", parentid: 138 },
        { id: 142, name: "Eliza", hierarchyid: 0, relation: "", parentid: 138 },
        { id: 143, name: "Mohsin", hierarchyid: 0, relation: "", parentid: 140 },
        { id: 144, name: "Azhar", hierarchyid: 0, relation: "", parentid: 140 },
        { id: 145, name: "Kasam+Naseem", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 146, name: "Iqbal+Shamshad", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 147, name: "Shahida+Mahmood", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 148, name: "Hamida+Latif", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 149, name: "Dilshad+Iqbal", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 150, name: "Imtiyaz+Zarina", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 151, name: "Shamshad+Shabbir", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 152, name: "Shirin+Meher", hierarchyid: 0, relation: "", parentid: 151 },
        { id: 1521, name: "Kiyan", hierarchyid: 0, relation: "", parentid: 152 },
        { id: 153, name: "Suhail+Afreen", hierarchyid: 0, relation: "", parentid: 151 },
        { id: 1531, name: "Diyana", hierarchyid: 0, relation: "", parentid: 153 },
        { id: 1532, name: "D2", hierarchyid: 0, relation: "", parentid: 153 },
        { id: 154, name: "Shahbaaz", hierarchyid: 0, relation: "", parentid: 150 },
        { id: 155, name: "Anam", hierarchyid: 0, relation: "", parentid: 150 },
        { id: 157, name: "Irfan+Khismilla", hierarchyid: 0, relation: "", parentid: 149 },
        { id: 1571, name: "Ruksar", hierarchyid: 0, relation: "", parentid: 157 },
        { id: 1572, name: "S", hierarchyid: 0, relation: "", parentid: 157 },
        { id: 156, name: "Anis+", hierarchyid: 0, relation: "", parentid: 149 },
        { id: 158, name: "Naeem+Akrunisa", hierarchyid: 0, relation: "", parentid: 148 },
        { id: 1581, name: "Tisha+", hierarchyid: 0, relation: "", parentid: 158 },
        { id: 1582, name: "Sajeed+", hierarchyid: 0, relation: "", parentid: 148 },
        { id: 159, name: "Nagina+", hierarchyid: 0, relation: "", parentid: 148 },
        { id: 1591, name: "Ajmal", hierarchyid: 0, relation: "", parentid: 159 },
        { id: 1592, name: "D", hierarchyid: 0, relation: "", parentid: 159 },
        { id: 160, name: "Riyaz+Hasina", hierarchyid: 0, relation: "", village: "Nagthane", parentid: 147 },
        { id: 1601, name: "Reehan", hierarchyid: 0, relation: "", parentid: 160 },
        { id: 1602, name: "Ayan", hierarchyid: 0, relation: "", parentid: 160 },
        { id: 161, name: "Shakila+Ajmuddin", hierarchyid: 0, relation: "", village: "Sultangadi", parentid: 147 },
        { id: 16118, name: "Aseem", hierarchyid: 0, relation: "", parentid: 161 },
        { id: 16129, name: "Afreen Shaikh", hierarchyid: 0, relation: "", parentid: 161 },
        { id: 1611, name: "Shehnaaz+Rahim", hierarchyid: 0, relation: "", village: "Sayyadnagar", parentid: 147 },
        { id: 16111, name: "Ajim", hierarchyid: 0, relation: "", parentid: 1611 },
        { id: 16112, name: "Minaj", hierarchyid: 0, relation: "", parentid: 1611 },
        { id: 1612, name: "Farida+Balekhan Indori", hierarchyid: 0, relation: "", village: "", parentid: 147 },
        { id: 16121, name: "Rameez", hierarchyid: 0, relation: "", parentid: 1612 },
        { id: 1613, name: "Pakiza+Balekhan", hierarchyid: 0, relation: "", village: "Kirloskar Wadi", parentid: 147 },
        { id: 16131, name: "Sahil", hierarchyid: 0, relation: "", village: "", parentid: 1613 },
        { id: 16132, name: "Shirin Nadaf", hierarchyid: 0, relation: "", village: "Karad", parentid: 1613 },
        { id: 16133, name: "Saniya", hierarchyid: 0, relation: "", village: "Vita", parentid: 1613 },
        { id: 1614, name: "Shamshad+Imam Indori", hierarchyid: 0, relation: "", village: "", parentid: 147 },
        { id: 16141, name: "Rinaz Shaikh", hierarchyid: 0, relation: "", village: "", parentid: 1614 },
        { id: 16142, name: "Rojina+", hierarchyid: 0, relation: "", village: "", parentid: 1614 },
        { id: 162, name: "Safdar+Alisha", hierarchyid: 0, relation: "", parentid: 146 },
        { id: 1621, name: "Mahevish", hierarchyid: 0, relation: "", parentid: 162 },
        { id: 163, name: "Sameer+Asma", hierarchyid: 0, relation: "", parentid: 145 },
        { id: 164, name: "Akil+Aliza(Asma)", hierarchyid: 0, relation: "", parentid: 145 },
        { id: 1641, name: "Uzair", hierarchyid: 0, relation: "", parentid: 164 },
        { id: 1642, name: "Khatija", hierarchyid: 0, relation: "", parentid: 164 },
        { id: 165, name: "Anaya", hierarchyid: 0, relation: "", parentid: 163 },
        { id: 166, name: "Zidaan", hierarchyid: 0, relation: "", parentid: 163 }
    ];

    members2: Member[] = [
        //{ id: , name: "", hierarchyid: 0, relation: "", village:"", phone:"", parentid: },
        { id: 1, name: "Abdul Bhai+", hierarchyid: 0, relation: "Aadi-Purush", village: "Baramati", parentid: null },
        { id: 2, name: "Dagadu Bhai+", hierarchyid: 1, relation: "", village: "", phone: "", parentid: 1 },
        { id: 3, name: "Munnawar aka Manaji", hierarchyid: 1, relation: "", village: "", phone: "", parentid: 1 },
        { id: 4, name: "Manik+", hierarchyid: 1, relation: "", village: "", phone: "", parentid: 1 },
        { id: 5, name: "Mohamad Hanif", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 2 },
        { id: 6, name: "Rajjak+", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 2 },
        { id: 7, name: "Ajij+", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 2 },
        { id: 8, name: "Musa+Khairunissa aka Fatima Shaikh", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 2 },
        { id: 9, name: "Dastagir+", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 4 },
        { id: 10, name: "Mehboob+Chandbi", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 4 },
        { id: 11, name: "Latif+Hawa", hierarchyid: 2, relation: "", village: "", phone: "", parentid: 4 },
        { id: 12, name: "Gulam Ali+", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 5 },
        { id: 13, name: "Rafiq+", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 12 },
        { id: 14, name: "Shafiq", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 12 },
        { id: 15, name: "Iqbal+", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 12 },
        { id: 16, name: "Anis+", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 12 },

        { id: 17, name: "Mushtaq+", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 6 },
        { id: 18, name: "Shaheen+", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 6 },
        { id: 19, name: "Asif+", hierarchyid: 3, relation: "Nisar bhai ke samdhi", village: "", phone: "", parentid: 7 },
        { id: 20, name: "Yusuf+", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 7 },
        { id: 21, name: "D1+", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 20 },
        { id: 22, name: "Jubeda+Husein", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 20 },
        { id: 23, name: "Hurmat+", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 20 },
        { id: 24, name: "Tahera+Yusuf", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 20 },

        { id: 25, name: "Mumtaz+Ajij Maner", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 8 },
        { id: 26, name: "Salima+Nijamuddin Shikalgar", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 8 },
        { id: 27, name: "Ayesha+Jamil Shikalgar", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 8 },
        { id: 28, name: "Naseem+Madar Maner", hierarchyid: 3, relation: "", village: "", phone: "", parentid: 8 },
        { id: 29, name: "Najma+Philip", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 25 },
        { id: 30, name: "Rehana+Shabbir", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 25 },
        { id: 31, name: "Niyaj+Shabana", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 25 },
        { id: 32, name: "Parvez+Saira", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 25 },
        { id: 33, name: "Sufiya+Shakir", hierarchyid: 4, relation: "", village: "", phone: "", parentid: 25 },
        { id: 34, name: "Ronny", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 29 },
        { id: 35, name: "D1", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 29 },
        { id: 36, name: "D2", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 29 },
        { id: 37, name: "Imran+Reshma", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 30 },
        { id: 38, name: "Imtiyaz+", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 30 },
        { id: 39, name: "Alisha+", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 31 },
        { id: 40, name: "Shafeen", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 31 },
        { id: 41, name: "Farheen+", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 32 },
        { id: 42, name: "Aarju+", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 32 },
        { id: 43, name: "S", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 32 },
        { id: 44, name: "Rumana", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 33 },
        { id: 45, name: "Maliha", hierarchyid: 5, relation: "", village: "", phone: "", parentid: 33 },
        { id: 46, name: "Shamim+Salim", hierarchyid: 4, relation: "", parentid: 26 },
        { id: 47, name: "Riyaj+Jahida", hierarchyid: 4, relation: "", parentid: 26 },
        { id: 48, name: "Anis+Shabana", hierarchyid: 4, relation: "", parentid: 26 },
        { id: 49, name: "Saif Ali", hierarchyid: 5, relation: "", parentid: 46 },
        { id: 50, name: "Aman", hierarchyid: 5, relation: "", parentid: 46 },
        { id: 51, name: "Simran", hierarchyid: 5, relation: "", parentid: 47 },
        { id: 52, name: "Sana", hierarchyid: 5, relation: "", parentid: 47 },
        { id: 53, name: "Sahil", hierarchyid: 5, relation: "", parentid: 48 },
        { id: 54, name: "Reshma+Naushad", hierarchyid: 4, relation: "", parentid: 27 },
        { id: 55, name: "Juber", hierarchyid: 5, relation: "", parentid: 54 },
        { id: 56, name: "Inshan+", hierarchyid: 4, relation: "", parentid: 27 },
        { id: 57, name: "D1", hierarchyid: 5, relation: "", parentid: 56 },
        { id: 58, name: "D2", hierarchyid: 5, relation: "", parentid: 56 },
        { id: 59, name: "Sameer+Bismillah", hierarchyid: 5, relation: "", parentid: 28 },
        { id: 60, name: "Arfaan", hierarchyid: 5, relation: "", parentid: 59 },
        { id: 61, name: "S2", hierarchyid: 5, relation: "", parentid: 59 },
        { id: 62, name: "Mansoor+Farheen", hierarchyid: 5, relation: "", parentid: 28 },
        { id: 63, name: "S", hierarchyid: 5, relation: "", parentid: 62 },
        { id: 64, name: "D", hierarchyid: 5, relation: "", parentid: 62 },
        { id: 65, name: "D", hierarchyid: 5, relation: "", parentid: 41 }, //farheen
        { id: 66, name: "D", hierarchyid: 5, relation: "", parentid: 42 }, //aarju
        { id: 67, name: "S", hierarchyid: 5, relation: "", parentid: 39 }, //alisha
        { id: 68, name: "D", hierarchyid: 5, relation: "", parentid: 37 }, //imran
        { id: 69, name: "D", hierarchyid: 5, relation: "", parentid: 38 }, //imtiyaz
        { id: 70, name: "D", hierarchyid: 5, relation: "", parentid: 34 }, //ronny
        { id: 71, name: "D", hierarchyid: 5, relation: "", parentid: 34 },
        { id: 72, name: "Husein+Jarina", hierarchyid: 2, relation: "", parentid: 9 },
        { id: 73, name: "Hasan", hierarchyid: 2, relation: "", parentid: 9 },
        { id: 74, name: "Najir+Hurmat", hierarchyid: 2, relation: "", parentid: 9 },
        { id: 75, name: "Gani+", hierarchyid: 2, relation: "", parentid: 9 },
        { id: 76, name: "Johra+Ajij", hierarchyid: 2, relation: "", parentid: 9 },
        { id: 77, name: "Sufiya+Farooq", hierarchyid: 3, relation: "", parentid: 75 },
        { id: 78, name: "Asif+", hierarchyid: 3, relation: "", parentid: 75 },
        { id: 79, name: "Gulnaaj", hierarchyid: 3, relation: "", parentid: 75 },
        { id: 80, name: "S2", hierarchyid: 3, relation: "", parentid: 75 },
        { id: 81, name: "Sugra+", hierarchyid: 2, relation: "", parentid: 76 },
        { id: 82, name: "Mushtaq+Bebi", hierarchyid: 2, relation: "", parentid: 81 },
        { id: 83, name: "Shabbir+Irshad", hierarchyid: 2, relation: "", parentid: 81 },
        { id: 84, name: "Farooq+", hierarchyid: 2, relation: "", parentid: 81 },
        { id: 85, name: "Najim+", hierarchyid: 2, relation: "", parentid: 81 },
        //Memhoob Bhai
        { id: 86, name: "Bebi+Mushtaq", hierarchyid: 3, relation: "", village: "Chakan", parentid: 10 },
        { id: 87, name: "Muneer+", hierarchyid: 3, relation: "", parentid: 10 },
        { id: 88, name: "Salim+", hierarchyid: 3, relation: "", parentid: 10 },
        { id: 89, name: "Rehana", hierarchyid: 3, relation: "", parentid: 10 },
        { id: 90, name: "Asma+Tahir Ali", hierarchyid: 3, relation: "", parentid: 10 },
        { id: 99, name: "Afsar aka Ahmed+", hierarchyid: 3, relation: "", parentid: 10 },
        { id: 100, name: "Saqlain+", hierarchyid: 4, relation: "", parentid: 99 },
        { id: 101, name: "D", hierarchyid: 4, relation: "", parentid: 99 },
        { id: 91, name: "Rizwana+", hierarchyid: 3, relation: "", parentid: 10 },
        { id: 92, name: "Sameer+", hierarchyid: 4, relation: "", parentid: 86 },
        { id: 93, name: "Rinaz+", hierarchyid: 4, relation: "", parentid: 86 },
        { id: 94, name: "Shaheen+", hierarchyid: 4, relation: "", parentid: 86 },
        { id: 95, name: "Suhail+", hierarchyid: 4, relation: "", parentid: 87 },
        { id: 96, name: "D", hierarchyid: 4, relation: "", parentid: 87 },
        { id: 97, name: "Ajim+Heena", hierarchyid: 4, relation: "", parentid: 88 },
        { id: 98, name: "Tehsin+Mohsin", hierarchyid: 4, relation: "", village: "Solapur", parentid: 88 },
        { id: 101, name: "Simran", hierarchyid: 4, relation: "", parentid: 91 },
        { id: 102, name: "S", hierarchyid: 4, relation: "", parentid: 92 },
        { id: 103, name: "S", hierarchyid: 4, relation: "", parentid: 93 },
        { id: 104, name: "D", hierarchyid: 4, relation: "", parentid: 93 },
        { id: 105, name: "S", hierarchyid: 4, relation: "", parentid: 94 },
        { id: 106, name: "S", hierarchyid: 4, relation: "", parentid: 104 },
        { id: 107, name: "S", hierarchyid: 4, relation: "", parentid: 104 },
        //Latif Bhai
        { id: 108, name: "Imtiyaz+Shabnam", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 109, name: "Shehnaaz+Mahmood", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 110, name: "Irshad+Shabbir", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 111, name: "Maqsood+", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 112, name: "Javed+", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 113, name: "Yasmin+Aslam", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 114, name: "Wajid+Eliza", hierarchyid: 4, relation: "", parentid: 11 },
        { id: 115, name: "Tanveer+", hierarchyid: 4, relation: "", parentid: 108 },
        { id: 116, name: "Tarannum", hierarchyid: 4, relation: "", parentid: 108 },
        { id: 117, name: "Nagina+", hierarchyid: 4, relation: "", parentid: 109 },
        { id: 118, name: "Aayaj+Nilofar", hierarchyid: 4, relation: "", parentid: 109 },
        { id: 119, name: "Firoz+", hierarchyid: 4, relation: "", parentid: 109 },
        { id: 120, name: "Nilofar+Aayaj", hierarchyid: 4, relation: "", parentid: 110 },
        { id: 121, name: "S", hierarchyid: 4, relation: "", parentid: 110 },
        { id: 122, name: "S", hierarchyid: 4, relation: "", parentid: 111 },
        { id: 123, name: "D", hierarchyid: 4, relation: "", parentid: 111 },
        { id: 124, name: "S", hierarchyid: 4, relation: "", parentid: 112 },
        { id: 125, name: "D", hierarchyid: 4, relation: "", parentid: 112 },
        { id: 128, name: "S", hierarchyid: 4, relation: "", parentid: 114 },
        { id: 129, name: "D", hierarchyid: 4, relation: "", parentid: 114 },
        { id: 126, name: "Tausif+Farheen", hierarchyid: 4, relation: "", parentid: 113 },
        { id: 127, name: "Naved+Heena", hierarchyid: 4, relation: "", parentid: 113 },
        { id: 130, name: "Sabiha", hierarchyid: 4, relation: "", parentid: 126 },
        { id: 131, name: "Anaya", hierarchyid: 4, relation: "", parentid: 127 },
        { id: 132, name: "S", hierarchyid: 4, relation: "", parentid: 128 },
        { id: 133, name: "D", hierarchyid: 4, relation: "", parentid: 129 },
    ];
}