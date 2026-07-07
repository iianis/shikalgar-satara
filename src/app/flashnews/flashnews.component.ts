import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { charities } from '../../data/misc';

@Component({
  selector: 'app-flashnews',
  //imports: [],
  templateUrl: './flashnews.component.html',
  styleUrl: './flashnews.component.css',
  standalone: false
})
export class FlashnewsComponent {

  location = inject(Location);

  goBack(): void {
    this.location.back();
  }

  isFlashNewsShow = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isFlashNewsShow = false;
    }, 3000000)
  }

  studentsSSC = [
    { "sr": 1, "name": "ASHARAT DILAWAR+NASIMA SHIKALGAR", "marks": "95.20%", "location": "GURSALE", "phone": "9921125569", "photoUrl": "" },
    { "sr": 2, "name": "KHUSHI SADIK+SAMINA SHIKALGAR", "marks": "94.00%", "location": "SATARA", "phone": "9881550222", "photoUrl": "../../assets/images/students/khushi.jpeg" },
    { "sr": 3, "name": "SHIFA IQBAL+SHAMIM SHIKALGAR", "marks": "93.60%", "location": "GONDI-GAVTHAN", "phone": "9881550222", "photoUrl": "" },
    { "sr": 4, "name": "SHIFA TAJUDDIN+NASIMA SHIKALGAR", "marks": "91.80%", "location": "RETHRE KARKHANA", "phone": "9579679546", "photoUrl": "" },
    { "sr": 5, "name": "AAYAN FIROZKHAN SHIKALGAR", "marks": "90.80%", "location": "SATARA*", "phone": "", "photoUrl": "" },
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
    { "sr": 29, "name": "NADIM HASHAM SHIKALGAR", "marks": "66.20%", "location": "MAYANI", "phone": "9011455886", "photoUrl": "" },
    { "sr": 30, "name": "FATIMA DADASO+SADIYA SHIKALGAR", "marks": "64.00%", "location": "SATARA*", "phone": "", "photoUrl": "" },
    { "sr": 31, "name": "ARMAN ALTAF+BISMILLA SHIKALGAR", "marks": "62.80%", "location": "NAGTHANE", "phone": "9168530001", "photoUrl": "" },
    { "sr": 32, "name": "SUHANA MUKTAR SHIKALGAR", "marks": "62.60%", "location": "SHENOLI", "phone": "8788380773", "photoUrl": "" },
    { "sr": 33, "name": "SUMAIYA NAJIRHUSEN SHIKALGAR", "marks": "61.20%", "location": "", "phone": "9168530001", "photoUrl": "" },
    { "sr": 34, "name": "ADIL JAMIR SIKALKAR", "marks": "61.20%", "location": "", "phone": "9833260055", "photoUrl": "" },
    //{ "sr": 38, "name": "ALISHA DASTAGIR SHIKALGAR", "marks": "56.80%", "location": "BORGAON", "phone": "9604045340", "photoUrl": "" },
    { "sr": 35, "name": "NAUMAN MUSTAK SHIKALGAR", "marks": "50.00%", "location": "KHATAV", "phone": "9975016060", "photoUrl": "" },
    { "sr": 36, "name": "AMINA ASLAM+RESHMA SHIKALGAR", "marks": "48.60%", "location": "SATARA*", "phone": "", "photoUrl": "" },
    //{ "sr": 41, "name": "MAHEK RAFIK SHIKALGAR", "marks": "43.20%", "location": "KODOLI", "phone": "9322367232", "photoUrl": "" },
    { "sr": 37, "name": "JAYNAB MUJAHID SHIKALGAR", "marks": "39.60%", "location": "SATARA*", "phone": "", "photoUrl": "" },
  ];

  studentsHSC = [
    { "sr": 1, "name": "ALINA IMTIYAZ SHIKALGAR (HSC)", "marks": "80.00%", "location": "PHALTAN-SATARA*", "phone": "9168798060", "photoUrl": "" },
    { "sr": 2, "name": "SANIYA KHUDBUDDIN SHIKALGAR (HSC)", "marks": "70.83%", "location": "ANDHALI-SATARA*", "phone": "8975127230", "photoUrl": "" },
    { "sr": 3, "name": "ZAIBAN AMJAD SHIKALGAR (HSC)", "marks": "57.00%", "location": "KARAD-SATARA*", "phone": "9967580500", "photoUrl": "" },
    //{ "sr": 4, "name": "FAIZAN NIJAM SHIKALGAR (HSC)", "marks": "42.67%", "location": "KILLE-MACHINDRAGAD-SATARA*", "phone": "9637614929", "photoUrl": "" },
    //{ "sr": 34, "name": "SHIKALGAR", "marks": "%", "location": "SATARA*", "phone": "" },
  ];
  studentsORG = [
    //{ "sr": 1, "name": "AYASHA ALLAMIN SHIKALKAR", "marks": "96.00%", "location": "MURUD-LATUR", "phone": "7820981250" },
    //{ "sr": 2, "name": "SHAIKH AYESHA SHAIKH AMJAD AHMED", "marks": "95.60%", "location": "AURANGABAD", "phone": "9850127659" },
    { "sr": 3, "name": "ASHARAT DILAWAR SHIKALGAR", "marks": "95.20%", "location": "GURSALE", "phone": "9921125569" },
    // { "sr": 4, "name": "NAJNEEN IMTIYAJ SHIKALGAR", "marks": "94.60%", "location": "GARDI-GHANWAD", "phone": "9226358047" },
    { "sr": 5, "name": "KHUSHI SADIK SHIKALGAR", "marks": "94.00%", "location": "SATARA", "phone": "9881550222" },
    // { "sr": 6, "name": "HUJEF IKBAL SHIKALGAR", "marks": "94.00%", "location": "KASBA BAWDA", "phone": "9158450122" },
    // { "sr": 7, "name": "SHIFA IQBAL SHIKALGAR", "marks": "93.60%", "location": "GONDI", "phone": "9822258127" },
    // { "sr": 8, "name": "BDUL SAMAD FARUKH SHIKALGAR", "marks": "92.40%", "location": "ALSAND", "phone": "8530027946" },
    // { "sr": 9, "name": "ALONI DASTAGIR SHIKALGAR", "marks": "92.00%", "location": "PED", "phone": "9689616116" },
    { "sr": 10, "name": "SIFA TAJUDDIN SHIKALGAR", "marks": "91.80%", "location": "RETHRE KARKHANA", "phone": "9579679546" },
    // { "sr": 11, "name": "AAYAN FIROJKHAN SHIKALGAR", "marks": "90.80%", "location": "VANGI", "phone": "9922578760" },
    // { "sr": 12, "name": "NUZHAT IMRAN SHIKALGAR", "marks": "90.20%", "location": "ISLAMPUR", "phone": "9850524844" },
    // { "sr": 13, "name": "MUBEEN BABAJI SHIKALGAR", "marks": "90.00%", "location": "BHENDAVADE VITA", "phone": "9423837869" },
    { "sr": 14, "name": "RIDA RAJU SHIKALGAR", "marks": "90.00%", "location": "", "phone": "9420141461" },
    { "sr": 15, "name": "SHIFA SHAKIL SHIKALGAR-CBSC", "marks": "89.00%", "location": "NER", "phone": "9860837869" },
    // { "sr": 16, "name": "SALMAN TOFIK SHIKALKAR", "marks": "89.00%", "location": "PAT KUROLI", "phone": "9130277827" },
    { "sr": 17, "name": "SIMRAN RAMEEJ SHIKALGAR", "marks": "88.60%", "location": "NAGTHANE", "phone": "7888059768" },
    // { "sr": 18, "name": "MISBAH NEEYAZ SHIKALGAR", "marks": "88.40%", "location": "CHINCHWAD PUNE", "phone": "9822618233" },
    //{ "sr": 19, "name": "JUNAID SIKANDAR SHIKALKAR", "marks": "88.20%", "location": "PAT. KUROLI", "phone": "8459492954" },
    //  { "sr": 20, "name": "AAYSHA MURAD SHIKALGAR", "marks": "88.20%", "location": "VILE PARLE MUMBAI", "phone": "9768285805" },
    // { "sr": 21, "name": "MUHAMMAD SAIM MOHD WASEEM SIKILKAR", "marks": "88.20%", "location": "NANDURBAR", "phone": "7020383850" },
    { "sr": 22, "name": "NAAZ SHERKHAN SHIKALGAR", "marks": "87.80%", "location": "KARANJE-SATARA", "phone": "9049658080" },
    { "sr": 23, "name": "SIDDIK SALIM SHIKALGAR", "marks": "87.60%", "location": "ANDHALI", "phone": "9226460219" },
    { "sr": 24, "name": "NOMAN SALIM SHIKALGAR", "marks": "87.00%", "location": "VADGAON-HAVELI", "phone": "9922391232" },
    { "sr": 25, "name": "AYAN FIROJ SHIKALGAR", "marks": "86.60%", "location": "KALEDHONE", "phone": "8552827683" },
    // { "sr": 26, "name": "RIZAA UMARFARUKH SHIKALGAR", "marks": "86.40%", "location": "VITA", "phone": "9604355655" },
    // { "sr": 27, "name": "AADIL AZIM SHIKILKAR", "marks": "86.20%", "location": "GHANSOLI", "phone": "8169086209" },
    { "sr": 28, "name": "SUHANA NAUSHAD SHIKALGAR", "marks": "86.20%", "location": "KARVE", "phone": "9730934326" },
    //{ "sr": 29, "name": "ZAHIR ASHRAF SHIKALGAR", "marks": "85.80%", "location": "PALUS", "phone": "7385364286" },
    // { "sr": 30, "name": "BUSHRA JAMEER SHIKALGAR", "marks": "84.80%", "location": "ISLAMPUR", "phone": "9270226227" },
    // { "sr": 31, "name": "ZUHA FATEMA SHAIKH AYYUB", "marks": "84.60%", "location": "NANDUR CITY", "phone": "9921282619" },
    // { "sr": 32, "name": "SUFIYA ASHAPAK SHIKALGAR", "marks": "84.40%", "location": "KIRLOSKARWADI", "phone": "9766485130" },
    { "sr": 33, "name": "JISHAN MAJJID SHIKALGAR", "marks": "84.20%", "location": "KARAD", "phone": "7020489586" },
    //{ "sr": 34, "name": "MUKHTAR MIRASAHEB SHIKALGAR", "marks": "83.80%", "location": "WANGI", "phone": "9552709795" },
    // { "sr": 35, "name": "RAISA SHAKIL SHIKALGAR", "marks": "83.60%", "location": "ALSAND", "phone": "9970279147" },
    { "sr": 36, "name": "NAVEZ RAJU SHIKALGAR", "marks": "83.20%", "location": "", "phone": "8623045965" },
    // { "sr": 37, "name": "TAHESEEN MOH HANIF SHIKALKAR", "marks": "82.40%", "location": "ULHASNAGAR-MUMBAI", "phone": "8451965055" },
    // { "sr": 38, "name": "TASMIYA DASTGIR SHIKALGAR", "marks": "82.00%", "location": "KURLA-MUMBAI", "phone": "9820808018" },
    //{ "sr": 39, "name": "TAMANNA PIRSAHEB SHIKALGAR", "marks": "82.00%", "location": "VANGI", "phone": "7219445319" },
    // { "sr": 40, "name": "SUHANA JAVED SHIKALGAR-CBSC", "marks": "82.00%", "location": "DOMBIWALI-MUMBAI", "phone": "8879991821" },
    // { "sr": 41, "name": "HEENA SALIM SHIKALGAR", "marks": "81.80%", "location": "DOMBIWALI MUMBAI", "phone": "9224600459" },
    { "sr": 42, "name": "SUFIYAN ASLAM SHIKALGAR", "marks": "81.60%", "location": "VIRALI-SATARA", "phone": "" },
    { "sr": 43, "name": "TASMIYA MAINUDDIN SHIKALGAR", "marks": "81.60%", "location": "", "phone": "" },
    //  { "sr": 44, "name": "ASIYA JABBAR SHIKALGAR", "marks": "80.80%", "location": "WADALA-MUMBAI", "phone": "9699334961" },
    // { "sr": 45, "name": "AAYESHA JAVED SHIKALGAR", "marks": "80.80%", "location": "MALKHED", "phone": "8262013256" },
    // { "sr": 46, "name": "ARSH SALIM SHIKALGAR", "marks": "80.20%", "location": "CHINCHWAD PUNE", "phone": "7972025974" },
    // { "sr": 47, "name": "AASIYA YASIN SHIKALGAR", "marks": "80.00%", "location": "BILATE-PARANDA", "phone": "9921786071" },
    { "sr": 48, "name": "FARHAN FARUK SHIKALGAR", "marks": "80.00%", "location": "SHIRWAL", "phone": "9822312195" },
    { "sr": 49, "name": "SHIREEN RAFIQ SHIKALGAR", "marks": "79.80%", "location": "NAGEWADI", "phone": "9970630070" },
    // { "sr": 50, "name": "ZUBAIR ARIF SHIKALGAR", "marks": "79.00%", "location": "KURLA-MUMBAI", "phone": "9820808018" },
    { "sr": 51, "name": "TAIYYABA FIROJ SHIKLIKAR", "marks": "78.60%", "location": "", "phone": "8668713524" },
    // { "sr": 52, "name": "AATIF MOHAMMAD AABID KHAN SIKLIGAR", "marks": "78.60%", "location": "NANDURBAR", "phone": "7020383850" },
    { "sr": 53, "name": "SHASMEEN RAFIQ SHIKALGAR", "marks": "77.60%", "location": "NAGEWADI", "phone": "9970630070" },
    // { "sr": 54, "name": "MAHEK SURAJ SHIKALGAR", "marks": "77.40%", "location": "VANGI", "phone": "7507547070" },
    { "sr": 55, "name": "SABIYA VASIM SHIKALGAR", "marks": "77.20%", "location": "KULAKJAI", "phone": "7385164086" },
    { "sr": 56, "name": "ARSALAN FIROJ SHAIKH (SHIKALGAR)", "marks": "77.00%", "location": "DHAWADWADI SATARA", "phone": "8796206419" },
    { "sr": 57, "name": "TASNIM MINAJ SHIKALGAR", "marks": "77.00%", "location": "VARDHANGAD", "phone": "9527262124" },
    // { "sr": 58, "name": "AAYMAN SHAHID SHIKALKAR", "marks": "76.20%", "location": "MALEGAON", "phone": "9850948893" },
    //  { "sr": 59, "name": "SHAISTA FIROJ SHIKALGAR", "marks": "75.40%", "location": "ANKALKHOP", "phone": "9890509232" },
    //  { "sr": 60, "name": "SUHANI YAKUB SHIKALGAR", "marks": "75.00%", "location": "LENGRE", "phone": "9975684070" },
    // { "sr": 61, "name": "SAJID RAFIK SHIKALGAR", "marks": "74.60%", "location": "BHIKAWADI", "phone": "9960735310" },
    //  { "sr": 62, "name": "AYAN SIKANDAR SHIKALGAR", "marks": "74.00%", "location": "KURLA MUMBAI", "phone": "9664305178" },
    { "sr": 63, "name": "SAJID NISAR SHIKALGAR", "marks": "73.20%", "location": "VADUJ", "phone": "9423358286" },
    //{ "sr": 64, "name": "RIJVANA RAFIK SHIKALGAR", "marks": "72.80%", "location": "BHIKAWADI", "phone": "9960735310" },
    // { "sr": 65, "name": "SALIK DILAWAR SHIKALGAR", "marks": "72.40%", "location": "PUNE", "phone": "9860119618" },
    { "sr": 66, "name": "SUFIYA DILAWAR SHIKALGAR", "marks": "72.00%", "location": "TASGAON RAHIMATPUR", "phone": "9096530289" },
    { "sr": 67, "name": "KHUSHI RIYAJ SHIKALGAR", "marks": "71.60%", "location": "", "phone": "8600446024" },
    // { "sr": 68, "name": "ANIS IQBAL SHIKALGAR", "marks": "71.40%", "location": "THANE", "phone": "9833626371" },
    // { "sr": 69, "name": "JAINAB IQBAL SHIKALGAR", "marks": "71.20%", "location": "DHARAVI MUMBAI", "phone": "9987838980" },
    { "sr": 70, "name": "AARISH SHIKANDAR SHIKALGAR", "marks": "71.00%", "location": "WADGAON SHERI", "phone": "8888390466" },
    // { "sr": 71, "name": "ALISBA SADIK SHIKALKAR", "marks": "70.80%", "location": "KURDUVADI-SOLAPUR", "phone": "" },
    // { "sr": 72, "name": "NIHAL KADAR SHIKALGAR", "marks": "70.60%", "location": "BALAWADI (KHAL)", "phone": "9764218497" },
    // { "sr": 73, "name": "ALFIYA MURAD SHIKALGAR", "marks": "69.80%", "location": "JARIMARI-MUMBAI", "phone": "9702971100" },
    // { "sr": 74, "name": "AFFAN NAEEM SHIKAL GAR", "marks": "69.20%", "location": "KHARSUNDI", "phone": "9921472506" },
    //{ "sr": 75, "name": "TARANNUM IRFAN SHIKALKAR", "marks": "67.60%", "location": "PAT KUROLI", "phone": "9011689861" },
    //  { "sr": 76, "name": "ANIS YASIN SHIKALGAR", "marks": "67.40%", "location": "PED", "phone": "8208365353" },
    { "sr": 77, "name": "NADIM HASHAM SHIKALGAR", "marks": "66.20%", "location": "MAYANI", "phone": "9011455886" },
    // { "sr": 78, "name": "AFSANA NASIR SHIKALGAR", "marks": "65.00%", "location": "PED", "phone": "7038867690" },
    { "sr": 79, "name": "ARMAN ALTAF SHIKALGAR", "marks": "62.80%", "location": "NAGTHANE", "phone": "9168530001" },
    //  { "sr": 80, "name": "SUFIYA SAMIR SHIKALGAR", "marks": "62.60%", "location": "MUMBAI", "phone": "8291788177" },
    { "sr": 81, "name": "SUHANA MUKTAR SHIKALGAR", "marks": "62.60%", "location": "SHENOLI", "phone": "8788380773" },
    { "sr": 82, "name": "SUMAIYA NAJIRHUSEN SHIKALGAR", "marks": "61.20%", "location": "", "phone": "9168530001" },
    { "sr": 83, "name": "ADIL JAMIR SIKALKAR", "marks": "61.20%", "location": "", "phone": "9833260055" },
    // { "sr": 84, "name": "SUFIYAN SALIM SHIKALGAR", "marks": "61.00%", "location": "TASGAON-RAHIMATPUR", "phone": "9561498561" },
    // { "sr": 85, "name": "MOHAMMED ZORAN AMEER SHIKALKAR", "marks": "60.00%", "location": "CHINCHWAD PUNE", "phone": "8788169159" },
    // { "sr": 86, "name": "MOHAMMADKAIS FIROJ SHIKALGAR", "marks": "59.00%", "location": "TALANGADE KOLHAPUR", "phone": "9922181891" },
    { "sr": 87, "name": "ALISHA DASTAGIR SHIKALGAR", "marks": "56.80%", "location": "BORGAON", "phone": "9604045340" },
    // { "sr": 88, "name": "MOHAMMAD ALFAIZ RAHEMATULLA SIKLIKAR", "marks": "54.60%", "location": "NANDURBAR", "phone": "7020383850" },
    //  { "sr": 89, "name": "ABUZAR ABDUL SABUR SIKLIGAR", "marks": "54.40%", "location": "NANDURBAR", "phone": "7020383850" },
    // { "sr": 90, "name": "ALISHA IMRAN SHIKALGAR", "marks": "52.60%", "location": "PED", "phone": "9422892351" },
    // { "sr": 91, "name": "JUNED SAMIR SHIKALGAR", "marks": "51.60%", "location": "PED", "phone": "9767158858" },
    { "sr": 92, "name": "NAUMAN MUSTAK SHIKALGAR", "marks": "50.00%", "location": "KHATAV", "phone": "9975016060" },
    //{ "sr": 93, "name": "RISHI VIKAS KAMBLE", "marks": "49.80%", "location": "KURLA-MUMBAI", "phone": "8291477637" },
    //{ "sr": 94, "name": "FAREEN SHAHNAWAZ SHIKALGAR", "marks": "46.20%", "location": "KURLA-MUMBAI", "phone": "8691821846" },
    // { "sr": 95, "name": "FAIZAN RAFIK SHIKALGAR", "marks": "45.20%", "location": "BANDRA-MUMBAI", "phone": "8655595321" },
    { "sr": 96, "name": "MAHEK RAFIK SHIKALGAR", "marks": "43.20%", "location": "KODOLI", "phone": "9322367232" }
  ];


  charityCount = 0;
  charities = charities;

  getTotalCount() {
    let totalCount = 0;
    let totalCountEducation = 0;
    let totalCountMedical = 0;
    let totalCountFinancial = 0;
    let totalCountBusiness = 0;
    let totalCountOther = 0;

    this.charities.forEach(charity => {
      charity.familiesByTaluka.forEach((family: any) => {
        totalCount += family.count;
      });
      if (charity.name == "शैक्षणिक मदत") totalCountEducation = totalCount;
      if (charity.name == "वैद्यकीय मदत") totalCountMedical = totalCount;
      if (charity.name == "आर्थिक मदत") totalCountFinancial = totalCount;
      if (charity.name == "लघुउद्योग मदत") totalCountBusiness = totalCount;
      //if (charity.name == "") totalCountOther = totalCount;
    });

    this.charityCount = totalCount;
    localStorage.setItem('charityCount', totalCount.toString());
  }

  charityChart: CharityRecord[] = [
    { year: "2026-27", type: "आर्थिक", charityCount: 2, charityAmount: 10000 },
    { year: "2026-27", type: "शैक्षणिक", charityCount: 1, charityAmount: 10000 },
    { year: "2026-27", type: "वैद्यकीय", charityCount: 1, charityAmount: 5000 },
    { year: "2026-27", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
    { year: "2026-27", type: "इतर", charityCount: 1, charityAmount: 0 },

    { year: "2025-26", type: "आर्थिक", charityCount: 22, charityAmount: 110000 },
    { year: "2025-26", type: "शैक्षणिक", charityCount: 4, charityAmount: 40000 },
    { year: "2025-26", type: "वैद्यकीय", charityCount: 1, charityAmount: 5000 },
    { year: "2025-26", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
    { year: "2025-26", type: "इतर", charityCount: 1, charityAmount: 10000 },

    { year: "2024-25", type: "आर्थिक", charityCount: 16, charityAmount: 80000 },
    { year: "2024-25", type: "शैक्षणिक", charityCount: 3, charityAmount: 15000 },
    { year: "2024-25", type: "वैद्यकीय", charityCount: 4, charityAmount: 20000 },
    { year: "2024-25", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
    { year: "2024-25", type: "इतर", charityCount: 0, charityAmount: 0 },

    { year: "2023-24", type: "आर्थिक", charityCount: 15, charityAmount: 45000 },
    { year: "2023-24", type: "शैक्षणिक", charityCount: 0, charityAmount: 0 },
    { year: "2023-24", type: "वैद्यकीय", charityCount: 2, charityAmount: 10000 },
    { year: "2023-24", type: "लघुउद्योग", charityCount: 0, charityAmount: 0 },
    { year: "2023-24", type: "इतर", charityCount: 0, charityAmount: 0 },

  ];

  // Grouped data structure
  get groupedByYear() {
    const groups: { [key: string]: CharityRecord[] } = {};

    this.charityChart.forEach(item => {
      if (!groups[item.year]) {
        groups[item.year] = [];
      }
      groups[item.year].push(item);
    });

    // Convert back to array of objects for easier iteration in HTML
    return Object.keys(groups).map(year => ({
      year: year,
      data: groups[year],
      // Calculate total per year
      totalAmount: groups[year].reduce((sum, current) => sum + current.charityAmount, 0),
      totalCount: groups[year].reduce((sum, current) => sum + (current.charityCount || 0), 0)
    }));
  }
  // Checks if this index is the first row that actually has an amount > 0
  isFirstVisible(data: any[], currentIndex: number): boolean {
    const firstVisibleIndex = data.findIndex(item => item.charityAmount !== 0);
    return currentIndex === firstVisibleIndex;
  }

  // Dynamically scales down the rowspan box so it matches only the rows showing up
  getVisibleCount(data: any[]): number {
    return data.filter(item => item.charityAmount !== 0).length;
  }
}

// Interface for type safety
interface CharityRecord {
  year: string;
  type: string;
  charityCount: number;
  charityAmount: number;
}