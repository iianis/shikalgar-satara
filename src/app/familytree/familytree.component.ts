import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule, Location } from '@angular/common';
import { NgxOrgChartComponent } from '@ahmedaoui/ngx-org-chart';
import { FormsModule } from '@angular/forms';

interface Member {
    id: number;
    name: string;
    relation?: string;
    parentid: number | null;
    hierarchyid: number | null;
    education?: string;
    occupation?: string;
    dob?: string;
    status?: string;
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
    hierarchyTree: any[] = [];
    selectedTree: INode[] = [];
    showLeft = true;

    ngOnInit() {
        this.hierarchyTree = this.buildHierarchy(2); // depth limit = 2
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

        members.forEach(m => {
            lookup[m.id] = {
                name: m.name,
                cssClass: this.getCssClass(m.relation), // assign style based on relation
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
    getCssClass(relation?: string): string {
        if (!relation) return 'ngx-org-member';
        switch (relation.toLowerCase()) {
            case 'aadi-purush':
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

    members: Member[] = [//ngx-graph
        { id: 1, name: "Sheikhusman Baban", hierarchyid: 0, relation: "Aadi-Purush", parentid: null },
        { id: 2, name: "Mohamad", hierarchyid: 1, relation: "", parentid: 1 },
        { id: 3, name: "Sheikhdin+Khutub", hierarchyid: 1, relation: "", parentid: 1 },
        { id: 4, name: "Dhondubai", hierarchyid: 1, relation: "", parentid: 1 },
        { id: 5, name: "Sharifa+Gulab", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 6, name: "Halima+Mohamad", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 7, name: "Mumtaz+Yusuf", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 8, name: "Amina+Babalal", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 9, name: "Nijamuddin+Salima", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 10, name: "Mubarak+Najma", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 12, name: "Roshan", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 13, name: "Nyamat+Mehboob", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 11, name: "Tajuddin+Noorjan", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 14, name: "Kulsum+Chand", hierarchyid: 2, relation: "", parentid: 3 },
        { id: 15, name: "Umda", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 16, name: "Jannat", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 17, name: "Madina", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 18, name: "Abbas+Zohra", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 19, name: "Ismail+Hasmat", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 20, name: "Bakas+Jubeda", hierarchyid: 2, relation: "", parentid: 2 },
        { id: 21, name: "Chandbi", hierarchyid: 3, relation: "", education: "", occupation: "", dob: "", status: "", parentid: 18 },
        { id: 22, name: "Sugra", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 66, name: "Dastagir+Pyaran", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 23, name: "Suleiman+", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 24, name: "Rajjak+Najma", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 25, name: "Dilawar+Laila", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 26, name: "Ayesha-Funddi+Rafiq", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 27, name: "Noorjan-Baidi", hierarchyid: 3, relation: "", parentid: 18 },
        { id: 28, name: "Rajma", hierarchyid: 3, relation: "", parentid: 18 },
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
        { id: 41, name: "Farida+Haroon", hierarchyid: 3, relation: "", parentid: 20 }, //Fayaz, Jasmin
        { id: 411, name: "Fayaz", hierarchyid: 3, relation: "", parentid: 41 },
        { id: 412, name: "Jasmin", hierarchyid: 3, relation: "", parentid: 41 },
        { id: 42, name: "Shakil", hierarchyid: 3, relation: "", parentid: 20 },
        { id: 43, name: "Akil+Tanuja", hierarchyid: 3, relation: "", parentid: 20 }, // Mansoor, Rehmaan
        { id: 431, name: "Mansoor", hierarchyid: 3, relation: "", parentid: 43 }, //
        { id: 432, name: "Rehmaan", hierarchyid: 3, relation: "", parentid: 43 }, //
        { id: 44, name: "Afsana+Bashir", hierarchyid: 3, relation: "", parentid: 20 }, // (Koregaon - Walhekarwadi) - Kabir
        { id: 441, name: "Kabir", hierarchyid: 3, relation: "", parentid: 44 },
        { id: 45, name: "Shahjaan+Ajmuddin", hierarchyid: 3, relation: "", parentid: 20 }, // (Mumbai - Ulhasnagar) - Rahil, Firdos
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
        { id: 63, name: "Eliza", hierarchyid: 0, relation: "", parentid: 51 },
        { id: 64, name: "Parvej+Anjum", hierarchyid: 0, relation: "", parentid: 50 },
        { id: 65, name: "S2", hierarchyid: 0, relation: "", parentid: 50 }, //
        { id: 67, name: "Sadik+", hierarchyid: 0, relation: "", parentid: 66 },
        { id: 68, name: "Shabnam-Binno", hierarchyid: 0, relation: "", parentid: 66 },
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
        { id: 80, name: "Aliya", hierarchyid: 0, relation: "", parentid: 79 },
        { id: 81, name: "Farhaan", hierarchyid: 0, relation: "", parentid: 79 },
        { id: 82, name: "Wahida+Ikram", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 83, name: "Saira+Iqbal", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 84, name: "Mushtaq+Samina", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 85, name: "Firoz+Firdos", hierarchyid: 0, relation: "", parentid: 10 },
        { id: 86, name: "Sanam", hierarchyid: 0, relation: "", parentid: 82 },
        { id: 87, name: "Mohsin", hierarchyid: 0, relation: "", parentid: 83 },
        { id: 88, name: "S2", hierarchyid: 0, relation: "", parentid: 83 },
        { id: 89, name: "Arsh", hierarchyid: 0, relation: "", parentid: 84 },
        { id: 90, name: "D1", hierarchyid: 0, relation: "", parentid: 84 },
        { id: 91, name: "D2", hierarchyid: 0, relation: "", parentid: 84 },
        { id: 92, name: "Rehan", hierarchyid: 0, relation: "", parentid: 85 },
        { id: 93, name: "Sara", hierarchyid: 0, relation: "", parentid: 85 },
        { id: 94, name: "Ayub+Naseem", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 95, name: "Bebi+Ismail", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 96, name: "Isaq+Noorjan", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 97, name: "Nisar+Rizwana", hierarchyid: 0, relation: "", parentid: 6 },
        { id: 98, name: "Shirin", hierarchyid: 0, relation: "", parentid: 94 },
        { id: 99, name: "D2", hierarchyid: 0, relation: "", parentid: 94 },
        { id: 100, name: "S1", hierarchyid: 0, relation: "", parentid: 94 },
        { id: 101, name: "Asif+Rinaz", hierarchyid: 0, relation: "", parentid: 95 },
        { id: 102, name: "Firoz+Minaj", hierarchyid: 0, relation: "", parentid: 95 },
        { id: 103, name: "Farheen", hierarchyid: 0, relation: "", parentid: 101 },
        { id: 104, name: "D2", hierarchyid: 0, relation: "", parentid: 101 },
        { id: 105, name: "D1", hierarchyid: 0, relation: "", parentid: 102 },
        { id: 106, name: "D2", hierarchyid: 0, relation: "", parentid: 102 },
        { id: 107, name: "Shiraz+", hierarchyid: 0, relation: "", parentid: 96 },
        { id: 108, name: "Ajim+Jasmin", hierarchyid: 0, relation: "", parentid: 96 },
        { id: 109, name: "Zaheer+Jasmin", hierarchyid: 0, relation: "", parentid: 96 },
        { id: 110, name: "D1", hierarchyid: 0, relation: "", parentid: 107 },
        { id: 111, name: "D2", hierarchyid: 0, relation: "", parentid: 107 },
        { id: 112, name: "D", hierarchyid: 0, relation: "", parentid: 108 },
        { id: 113, name: "S", hierarchyid: 0, relation: "", parentid: 108 },
        { id: 114, name: "Amyra", hierarchyid: 0, relation: "", parentid: 109 },
        { id: 115, name: "D2", hierarchyid: 0, relation: "", parentid: 109 },
        { id: 116, name: "Rameez+", hierarchyid: 0, relation: "", parentid: 97 },
        { id: 117, name: "Asim", hierarchyid: 0, relation: "", parentid: 97 },
        { id: 118, name: "Alisha", hierarchyid: 0, relation: "", parentid: 116 },
        { id: 119, name: "D2", hierarchyid: 0, relation: "", parentid: 116 },
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
        { id: 1292, name: "Zakiya", hierarchyid: 0, relation: "", parentid: 129 },
        { id: 130, name: "Mubasshir", hierarchyid: 0, relation: "", parentid: 128 },
        { id: 131, name: "Tahir", hierarchyid: 0, relation: "", parentid: 128 },
        { id: 132, name: "Muneer", hierarchyid: 0, relation: "", parentid: 128 },
        { id: 133, name: "Sadik", hierarchyid: 0, relation: "", parentid: 13 },
        { id: 134, name: "Ayesha", hierarchyid: 0, relation: "", parentid: 13 },
        { id: 135, name: "Shamshad", hierarchyid: 0, relation: "", parentid: 13 },
        { id: 136, name: "Binno", hierarchyid: 0, relation: "", parentid: 13 },
        { id: 137, name: "Jasmin", hierarchyid: 0, relation: "", parentid: 13 },
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
        { id: 150, name: "Imtiyaz", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 151, name: "Shamshad+Shabbir", hierarchyid: 0, relation: "", parentid: 7 },
        { id: 152, name: "Shirin+", hierarchyid: 0, relation: "", parentid: 151 },
        { id: 153, name: "Suhail+", hierarchyid: 0, relation: "", parentid: 151 },
        { id: 154, name: "S", hierarchyid: 0, relation: "", parentid: 150 },
        { id: 155, name: "D", hierarchyid: 0, relation: "", parentid: 150 },
        { id: 156, name: "Anis", hierarchyid: 0, relation: "", parentid: 149 },
        { id: 157, name: "S2", hierarchyid: 0, relation: "", parentid: 149 },
        { id: 158, name: "Altaf", hierarchyid: 0, relation: "", parentid: 148 },
        { id: 159, name: "Nagina", hierarchyid: 0, relation: "", parentid: 148 },
        { id: 160, name: "Riyaz+", hierarchyid: 0, relation: "", parentid: 147 },
        { id: 161, name: "Shakila+", hierarchyid: 0, relation: "", parentid: 147 },
        { id: 162, name: "S", hierarchyid: 0, relation: "", parentid: 146 },
        { id: 163, name: "Sameer+Asma", hierarchyid: 0, relation: "", parentid: 145 },
        { id: 164, name: "Akil+", hierarchyid: 0, relation: "", parentid: 145 },
        { id: 165, name: "D", hierarchyid: 0, relation: "", parentid: 163 },
        { id: 166, name: "S", hierarchyid: 0, relation: "", parentid: 163 }
    ];
}