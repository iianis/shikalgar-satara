import { CommonModule, Location, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-eventplanning',
  imports: [CommonModule],
  templateUrl: './eventplanning.component.html',
  standalone: true
})
export class EventplanningComponent implements OnInit {
  private authService = inject(AuthService);
  //private location = inject(Location);
  private router = inject(Router);

  loggedInPhone: string | null = null;

  async ngOnInit(): Promise<void> {
    this.loggedInPhone = await firstValueFrom(this.authService.getLoggedInPhone());
    if (!this.loggedInPhone) {
      this.router.navigateByUrl('login');
      return;
    }
  }

  studentsSSC = [
    { "sr": 1, "name": "ASHARAT DILAWAR+NASIMA SHIKALGAR", "marks": "95.20%", "location": "GURSALE", "phone": "9921125569", "photoUrl": "" },
    { "sr": 2, "name": "KHUSHI SADIK+SAMINA SHIKALGAR", "marks": "94.00%", "location": "SATARA", "phone": "9881550222", "photoUrl": "../../assets/images/students/khushi.jpeg" },
    { "sr": 3, "name": "SHIFA IQBAL+SHAMIM SHIKALGAR", "marks": "93.60%", "location": "GONDI-GAVTHAN", "phone": "9881550222", "photoUrl": "" },
    { "sr": 4, "name": "SHIFA TAJUDDIN+NASIMA SHIKALGAR", "marks": "91.80%", "location": "RETHRE KARKHANA", "phone": "9579679546", "photoUrl": "" },
    { "sr": 5, "name": "AAYAN FIROZKHAN SHIKALGAR", "marks": "90.80%", "location": "VANGI??", "phone": "", "photoUrl": "" },
    { "sr": 6, "name": "RIDA RAJU SHIKALGAR", "marks": "90.00%", "location": "", "phone": "9420141461", "photoUrl": "" },
    { "sr": 7, "name": "SHIFA SHAKIL SHIKALGAR-CBSC", "marks": "89.00%", "location": "NER", "phone": "9860837869", "photoUrl": "" },
    { "sr": 8, "name": "SIMRAN RAMEEJ+SALMA SHIKALGAR", "marks": "88.60%", "location": "NAGTHANE", "phone": "7888059768", "photoUrl": "" },
    { "sr": 9, "name": "AAYESHA MURAD+RUKAIYA SHIKALGAR", "marks": "88.20%", "location": "SATARA*", "phone": "", "photoUrl": "" },
    { "sr": 10, "name": "NAAZ SHERKHAN+NAFISA SHIKALGAR", "marks": "87.80%", "location": "KARANJE-SATARA", "phone": "9049658080", "photoUrl": "" },
    { "sr": 11, "name": "SIDDIK SALIM SHIKALGAR", "marks": "87.60%", "location": "ANDHALI", "phone": "9226460219", "photoUrl": "" },
    { "sr": 12, "name": "NOMAN SALIM+NASIM SHIKALGAR", "marks": "87.00%", "location": "VADGAON-HAVELI", "phone": "9922391232", "photoUrl": "" },
    { "sr": 13, "name": "AYAN FIROJ SHIKALGAR", "marks": "86.60%", "location": "KALEDHONE", "phone": "8552827683", "photoUrl": "" },
    { "sr": 14, "name": "SUHANA NAUSHAD+RAMIJA SHIKALGAR", "marks": "86.20%", "location": "KARVE", "phone": "9730934326", "photoUrl": "" },
    { "sr": 15, "name": "JISHAN MAJJID SHIKALGAR", "marks": "84.20%", "location": "KARAD", "phone": "7020489586", "photoUrl": "" },
    { "sr": 16, "name": "NAVEZ RAJU SHIKALGAR", "marks": "83.20%", "location": "", "phone": "8623045965", "photoUrl": "" },
    { "sr": 17, "name": "SUFIYAN ASLAM+AYESHA SHIKALGAR", "marks": "81.60%", "location": "VIRALI-SATARA", "phone": "", "photoUrl": "" },
    { "sr": 18, "name": "TASMIYA MAINUDDIN SHIKALGAR", "marks": "81.60%", "location": "", "phone": "", "photoUrl": "" },
    //{ "sr": 17, "name": "ARSH SALIM SHIKALGAR", "marks": "80.20%", "location": "PUNE*", "phone": "", "photoUrl": "" },
    { "sr": 19, "name": "FARHAN FARUK+NASRIN SHIKALGAR", "marks": "80.00%", "location": "SHIRWAL", "phone": "9822312195", "photoUrl": "" },
    //{ "sr": 19, "name": "SHIREEN RAFIQ SHIKALGAR", "marks": "79.80%", "location": "NAGEWADI", "phone": "9970630070", "photoUrl": "" },
    { "sr": 20, "name": "FAZAL SAMIR SHIKALGAR", "marks": "79.40%", "location": "SATARA*", "phone": "", "photoUrl": "" },
    { "sr": 21, "name": "TAIYYABA FIROJ SHIKLIKAR", "marks": "78.60%", "location": "", "phone": "8668713524", "photoUrl": "" },
    //{ "sr": 22, "name": "SHASMEEN RAFIQ SHIKALGAR", "marks": "77.60%", "location": "NAGEWADI", "phone": "9970630070", "photoUrl": "" },
    { "sr": 22, "name": "SABIYA VASIM+SALMA SHIKALGAR", "marks": "77.20%", "location": "KULAKJAI", "phone": "7385164086", "photoUrl": "" },
    //{ "sr": 24, "name": "ARSALAN FIROJ SHAIKH (SHIKALGAR)", "marks": "77.00%", "location": "DHAWADWADI SATARA", "phone": "8796206419", "photoUrl": "" },
    { "sr": 23, "name": "TASNIM MINAJ SHIKALGAR", "marks": "77.00%", "location": "VARDHANGAD", "phone": "9527262124", "photoUrl": "" },
    { "sr": 24, "name": "NIHAL SALIM+AYESHA SHIKALGAR", "marks": "74.80%", "location": "SATARA*", "phone": "", "photoUrl": "" },
    { "sr": 25, "name": "SAJID NISAR SHIKALGAR", "marks": "73.20%", "location": "VADUJ", "phone": "9423358286", "photoUrl": "" },
    { "sr": 26, "name": "ANAM IRFAN SHIKALGAR", "marks": "72.60%", "location": "SATARA*", "phone": "", "photoUrl": "" },
    //{ "sr": 29, "name": "SUFIYA DILAWAR+KARISHMA SHIKALGAR", "marks": "72.00%", "location": "TASGAON RAHIMATPUR", "phone": "9096530289", "photoUrl": "" },
    { "sr": 27, "name": "KHUSHI RIYAJ+HASINA SHIKALGAR", "marks": "71.60%", "location": "SATARAROAD-SATARA*", "phone": "8600446024", "photoUrl": "" },
    { "sr": 28, "name": "AARISH SHIKANDAR SHIKALGAR", "marks": "71.00%", "location": "WADGAON SHERI", "phone": "8888390466", "photoUrl": "" },
  ];

  studentsHSC = [
    { "sr": 1, "name": "ALINA IMTIYAZ SHIKALGAR", "marks": "80.00%", "location": "PHALTAN-SATARA*", "phone": "9168798060", "photoUrl": "" },
    { "sr": 2, "name": "SANIYA KHUDBUDDIN SHIKALGAR", "marks": "70.83%", "location": "ANDHALI-SATARA*", "phone": "8975127230", "photoUrl": "" },
  ];

  studentsSSC2025 = [
    { "sr": 30, "name": "SAFIYA FIROZ+NASARIN SHIKALGAR", "marks": "96.00%", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 31, "name": "FAREEN KAMRAN+ARIFA SHIKALGAR", "marks": "93.40%", "location": "WADGAON-HAVELI", "phone": "", "photoUrl": "" },
    { "sr": 32, "name": "MADIHA NAVED+ABEDA SHIKALGAR", "marks": "91.60%", "location": "WADGAON-HAVELI", "phone": "", "photoUrl": "" },
    { "sr": 33, "name": "ALIYA ASLAM+SHABANA SHIKALGAR", "marks": "91.80%", "location": "SHENOLI", "phone": "", "photoUrl": "" },
    { "sr": 34, "name": "JOYA SHAKANDIN+NAJIRA SHIKALGAR", "marks": "91.00%", "location": "SHENOLI", "phone": "", "photoUrl": "" },
    { "sr": 35, "name": "AMAN ALTAF SHIKALGAR", "marks": "91.00%", "location": "KARAD", "phone": "", "photoUrl": "" },
    { "sr": 30, "name": "ANAM AARIF SHIKALGAR", "marks": "90.60%", "location": "KOREGAON", "phone": "", "photoUrl": "" },
    { "sr": 36, "name": "SAJIYA VASEEM SHIKALGAR", "marks": "89.40%", "location": "KOREGAON", "phone": "", "photoUrl": "" },
    { "sr": 36, "name": "FARHAN JANMOHAMAD+NAFISA SHIKALGAR", "marks": "84.80%", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 38, "name": "SHOIB RAJASAB+SHABANA SHIKALGAR", "marks": "82.00%", "location": "SHENOLI", "phone": "", "photoUrl": "" },
    { "sr": 39, "name": "AMANAT ANSAR+FARIDA SHIKALGAR", "marks": "78.60%", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 37, "name": "ALISHA RIYAJ+MINAJ SHIKALGAR", "marks": "75.00%", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 40, "name": "REHAN JAKIR+RIZWANA SHIKALGAR", "marks": "71.83%", "location": "?", "phone": "", "photoUrl": "" },
  ];

  studentsHSC2025 = [
    { "sr": 1, "name": "SUFIYAN FAIYAZ+TABASSUM SHIKALGAR", "marks": "83%", "location": "SATARA", "phone": "9823323193", "photoUrl": "" },
    { "sr": 2, "name": "JOYA FAIYAZ+TABASSUM SHIKALGAR", "marks": "82.5%", "location": "SATARA", "phone": "9823323193", "photoUrl": "" },
    { "sr": 3, "name": "SHIFA JAHANGIR SHIKALGAR", "marks": "77%", "location": "SHENOLI STATION", "phone": "7498879343", "photoUrl": "" },
    { "sr": 4, "name": "ARMAN RAJEKHAN SHIKALGAR", "marks": "73.33%", "location": "BHADALE", "phone": "9156418576", "photoUrl": "" },
  ];

  outstandingAchievements = [
    { "sr": 1, "name": "NAJARUDDIN RAMJAN SHIKALGAR", area: "BUSINESS", "achivement": "MAHARASHTRA UDYOG BHUSHAN.", "location": "PARGAON", "phone": "", "photoUrl": "" },
    { "sr": 12, "name": "AJIM SHIKALGAR", area: "BUSINESS", "achivement": "YOUNG BUSINESSMAN AWARD FROM START TV", "location": "Bhendwade?", "phone": "", "photoUrl": "" },

    { "sr": 2, "name": "MEHBOOB BHAI SHIKALGAR", area: "SOCIAL", "achivement": "Insisted on introducing SADKA DABBA", "location": "SATARA", "phone": "9960729386", "photoUrl": "" },
    { "sr": 3, "name": "MAULAALI SHIKALGAR", area: "SOCIAL", "achivement": "Outstatnding performance throught director bodies 4 years.", "location": "SHENOLI", "phone": "9730934326", "photoUrl": "" },
    { "sr": 15, "name": "HAZARA AZAM SHIKALGAR", area: "SOCIAL-POLITICAL", "achivement": "satara jilha karyadhaksha - INC - minority section", "location": "satara", "phone": "", "photoUrl": "" },
    { "sr": 26, "name": "AMIR ABBAS SHIKALGAR", area: "SOCIAL", "achivement": "100 years - 15 July 2025", "location": "DARUJ", "phone": "", "photoUrl": "" },
    { "sr": 4, "name": "YASMIN JAHANGIR SHIKALGAR", area: "SOCIAL", "achivement": "पुण्यश्लोक अहिल्यादेवी होळकर पुरस्कार.", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 18, "name": "BENAZIR DILAWAR SHIKALGAR", area: "SOCIAL", "achivement": "ELECTED AS president rotaract club, malkapur", "location": "karad", "phone": "", "photoUrl": "" },

    { "sr": 5, "name": "SAKIB NASIRHUSEN SHIKALGAR", area: "MEDICAL", "achivement": "BEST PERFORMANCE AS NURSING OFFICER, KAMTHE CHIPLUN.", "location": "KALEDHON", "phone": "", "photoUrl": "" },
    { "sr": 6, "name": "DR VASEEM SHIKALGAR", area: "MEDICAL", "achivement": "Permanent registrtion as Doctor.", "location": "?", "phone": "", "photoUrl": "" },

    { "sr": 7, "name": "SAMEER ALLI SHIKALGAR", area: "GOVT", "achivement": "from pathalogy lab, to appearing for govt exam and now medical lab scientific officer.", "location": "KALEDHON", "phone": "", "photoUrl": "" },
    { "sr": 8, "name": "ANJUM HASAN SHIKALGAR", area: "GOVT", "achivement": "CIRCLE OFFIER - MANDAL.", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 14, "name": "SARGENT ANSAR SHAUKAT SHIKALGAR", area: "GOVT", "achivement": "successfully participated in united nations mission in south sudan - certificate of commendation", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 19, "name": "MR. FAIZAN AMIN SHIKALGAR", area: "GOVT", "achivement": "joined as police officer at Pune. He is zonal volleyball champion as well", "location": "nagthane", "phone": "", "photoUrl": "" },
    { "sr": 21, "name": "RAMJAN SHIKALGAR", area: "GOVT", "achivement": "retired teacher", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 24, "name": "NEHA AMIN TAMBOLI", area: "GOVT", "achivement": "comes from a very humble family. has passed UPSC, and to join as Deputy Collector", "location": "pusegaon-khatav", "phone": "", "photoUrl": "" },
    { "sr": 25, "name": "ZARINA NOORAHAMAD BAGWAN", area: "GOVT", "achivement": "promoted as API", "location": "solapur", "phone": "", "photoUrl": "" },
    { "sr": 32, "name": "साहिल जाहिद शिकलगार", area: "GOVT", "achivement": "Assistant Checmical Analyser - Forensic Expert", "location": "", "phone": "", "photoUrl": "" },

    { "sr": 9, "name": "UMAR RUSTUM SHIKALGAR", area: "EDUCATION", "achivement": "SCHOLARSHIP AT NAV MAHARASHTRA VIDYALAYA, CHITALI.", "location": "CHITALI", "phone": "", "photoUrl": "" },
    { "sr": 10, "name": "TOSIM HASAN SHIKALGAR", area: "EDUCATION", "achivement": "Appointed as Teacher.", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 11, "name": "DR. SAHIL ANIS+SHABANA SHIKALGAR", area: "EDUCATION", "achivement": "PhD in Casual Inference - Data Science", "location": "SATARA", "phone": "9886174607", "photoUrl": "" },
    { "sr": 13, "name": "IQBAL SHIKALGAR", area: "EDUCATION", "achivement": "appointed as teacher at palghar jilha parishad", "location": "?", "phone": "", "photoUrl": "" },
    { "sr": 16, "name": "MOHAMADALI RUSTUM SHIKALGAR", area: "EDUCATION", "achivement": "maharashtra state education board 7th std scholarship", "location": "shenoli", "phone": "", "photoUrl": "" },
    { "sr": 17, "name": "UMAR RUSTUM SHIKALGAR", area: "EDUCATION", "achivement": "eligible for scholarship - nav maha vidyalaya - chitali", "location": "khatav-shenoli", "phone": "", "photoUrl": "" },
    { "sr": 22, "name": "SUFIYA NIYAJ SHIKALGAR", area: "EDUCATION", "achivement": "NT-B MBBS admission", "location": "NER", "phone": "", "photoUrl": "" },
    { "sr": 23, "name": "ZEENAT ARMAAN SHIKALGAR", area: "EDUCATION", "achivement": "Completed MBA after marriage WITH 83%, she is mother of 2 year old son", "location": "KOREGAON", "phone": "", "photoUrl": "" },
    { "sr": 27, "name": "SIMRAN MUSHTAQ ATTAR", area: "EDUCATION", "achivement": "passed CA exam", "location": "Savargaon", "phone": "", "photoUrl": "" },
    { "sr": 28, "name": "SADDAM AZAD SHIKALGAR", area: "EDUCATION", "achivement": "appointed as deputy/asst teacher", "location": "kaledhone", "phone": "", "photoUrl": "" },
    { "sr": 29, "name": "SAMRIN SALIM+NASIMA SHIKALGAR", area: "EDUCATION", "achivement": "CET 98%", "location": "SHENOLI?", "phone": "", "photoUrl": "" },
    { "sr": 30, "name": "सौ आफरीन नईम शिकलगार", area: "EDUCATION", "achivement": " वय 29 348 मंगळवारपेठ 12 वी पास 54% परीवार दोन मुले पती सासू सासरे मोठे दिर त्यांचा परीवार वशिलाई काम करत अभिनंदनीय सुयश सन.2024 - 2025", "location": "KARAD", "phone": "", "photoUrl": "" },
    { "sr": 31, "name": "NOORJAHAN JAMEER SHIKALGAR", area: "EDUCATION", "achivement": "AGE 40 - PASSED 12TH, SHE HAS 2 KIDS", "location": "OGLEWADI", "phone": "", "photoUrl": "" },
    { "sr": 32, "name": "सौ रिजवाना कलिम शिकलगार", area: "EDUCATION", "achivement": " 12 वी पास ५०% 349 मंगळवार पेठ अभिनंदनीय सुयश सन.2024 -2025", "location": "", "phone": "", "photoUrl": "" },
    { "sr": 32, "name": "सौ बिस्मिल्ला इरफान शिकलगार", area: "EDUCATION", "achivement": "12 वी पास ५०% 349 मंगळवार पेठ अभिनंदनीय सुयश सन.2024 -2025", "location": "केसे पाडळी", "phone": "", "photoUrl": "" },
  ];
}

/*

lot of members completed 12th after their marriage and a long gap.


*/