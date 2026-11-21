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
    { "sr": 1, "name": "अशरत दिलावर + नसीमा शिकलगार", "marks": "९५.२०%", "location": "गुरसाळे", "phone": "9921125569", "photoUrl": "" },
    { "sr": 2, "name": "खुशी सादिक + समीना शिकलगार", "marks": "९४.००%", "location": "सातारा", "phone": "9881550222", "photoUrl": "../../assets/images/students/khushi.jpeg" },
    { "sr": 3, "name": "शिफा इक्बाल + शमीम शिकलगार", "marks": "९३.६०%", "location": "गोंदी-गावठाण", "phone": "9881550222", "photoUrl": "" },
    { "sr": 4, "name": "शिफा ताजुद्दीन + नसीमा शिकलगार", "marks": "९१.८०%", "location": "रेठरे कारखाना शिवनगर", "phone": "9579679546", "photoUrl": "" },
    { "sr": 6, "name": "अहाद जावेद शिकलगार", "marks": "९१.००%", "location": "कराड", "phone": "", "photoUrl": "" },
    { "sr": 7, "name": "शिफा शकील शिकलगार - सी.बी.एस.ई. (CBSE)", "marks": "८९.००%", "location": "नेर", "phone": "9860837869", "photoUrl": "" },
    { "sr": 8, "name": "सिमरन रमीज + सलमा शिकलगार", "marks": "८८.६०%", "location": "नागठाणे", "phone": "7888059768", "photoUrl": "" },
    { "sr": 10, "name": "नाझ शेरखान + नफिसा शिकलगार", "marks": "८७.८०%", "location": "करंजे-सातारा", "phone": "9049658080", "photoUrl": "" },
    { "sr": 12, "name": "नोमान सलीम + नसीम शिकलगार", "marks": "८७.००%", "location": "वडगाव-हवेली", "phone": "9922391232", "photoUrl": "" },
    { "sr": 13, "name": "अयान फिरोज शिकलगार", "marks": "८६.६०%", "location": "कलेढोण", "phone": "8552827683", "photoUrl": "" },
    { "sr": 14, "name": "सुहाना नौशाद + रमिजा शिकलगार", "marks": "८६.२०%", "location": "कार्वे", "phone": "9730934326", "photoUrl": "" },
    { "sr": 15, "name": "झिशान मजीद शिकलगार", "marks": "८४.२०%", "location": "कराड", "phone": "7020489586", "photoUrl": "" },
    { "sr": 17, "name": "सुफियान अस्लम + आयेशा शिकलगार", "marks": "८१.६०%", "location": "विरळी-सातारा", "phone": "", "photoUrl": "" },
    { "sr": 19, "name": "फरहान फारूक + नसरीन शिकलगार", "marks": "८०.००%", "location": "शिरवळ", "phone": "9822312195", "photoUrl": "" },
    { "sr": 20, "name": "फझल समीर शिकलगार", "marks": "७९.४०%", "location": "कराड", "phone": "", "photoUrl": "" },
    { "sr": 29, "name": "करिश्मा सलीम + मिनाज शिकलगार", "marks": "७९.००%", "location": "दरुज - खटाव", "phone": "8888390466", "photoUrl": "" },
    { "sr": 22, "name": "सबिया वसीम + सलमा शिकलगार", "marks": "७७.२०%", "location": "कुळकजाई", "phone": "7385164086", "photoUrl": "" },
    { "sr": 23, "name": "तस्नीम मिनाज शिकलगार", "marks": "७७.००%", "location": "वर्धनगड", "phone": "9527262124", "photoUrl": "" },
    { "sr": 25, "name": "साजिद निसार शिकलगार", "marks": "७३.२०%", "location": "वडूज", "phone": "9423358286", "photoUrl": "" },
    { "sr": 27, "name": "खुशी रियाज + हसीना शिकलगार", "marks": "७१.६०%", "location": "सातारा रोड", "phone": "8600446024", "photoUrl": "" },
    { "sr": 29, "name": "जैनब इक्बाल + यास्मीन शिकलगार", "marks": "७१.२०%", "location": "वडूज", "phone": "", "photoUrl": "" },
  ];

  studentsHSC = [
    { "sr": 1, "name": "अलिना इम्तियाज शिकलगार", "marks": "८०.००%", "location": "फलटण-सातारा*", "phone": "9168798060", "photoUrl": "" },
  ];
  studentsSSC2025 = [
    { "sr": 31, "name": "फरीन कामरान + आरिफा शिकलगार", "marks": "९३.४०%", "location": "वडगाव-हवेली", "phone": "", "photoUrl": "" },
    { "sr": 32, "name": "मदिहा नावेद + आबेदा शिकलगार", "marks": "९१.६०%", "location": "वडगाव-हवेली", "phone": "", "photoUrl": "" },
    { "sr": 33, "name": "आलिया अस्लम + शबाना शिकलगार", "marks": "९१.८०%", "location": "शेणोली", "phone": "", "photoUrl": "" },
    { "sr": 34, "name": "जोया शकानुद्दीन + नाजिरा शिकलगार", "marks": "९१.००%", "location": "कराड", "phone": "", "photoUrl": "" },
    { "sr": 35, "name": "अमान अल्ताफ शिकलगार", "marks": "९१.००%", "location": "विरळी", "phone": "", "photoUrl": "" },
    { "sr": 30, "name": "अनम आरिफ शिकलगार", "marks": "९०.६०%", "location": "कोरेगाव", "phone": "", "photoUrl": "" },
    { "sr": 36, "name": "साजिया वसीम शिकलगार", "marks": "८९.४०%", "location": "कोरेगाव", "phone": "", "photoUrl": "" },
    { "sr": 36, "name": "फरहान जानमोहम्मद + नफिसा शिकलगार", "marks": "८४.८०%", "location": "विरळी", "phone": "", "photoUrl": "" },
    { "sr": 41, "name": "जुबेर आमीन + तबस्सुम शिकलगार", "marks": "८३.६०%", "location": "शेणोली", "phone": "", "photoUrl": "" },
    { "sr": 38, "name": "शोएब राजासाब + शबाना शिकलगार", "marks": "८२.००%", "location": "विरळी", "phone": "", "photoUrl": "" },
    { "sr": 39, "name": "असिम मुनीर + तबस्सुम शिकलगार", "marks": "७८.००%", "location": "दरूज", "phone": "", "photoUrl": "" },
    { "sr": 42, "name": "महेक राजु + आस्मा शिकलगार", "marks": "७६.४०%", "location": "रेठरे", "phone": "", "photoUrl": "" },
  ];

  studentsHSC2025 = [
    { "sr": 1, "name": "सुफियान फैयाज + तबस्सुम शिकलगार", "marks": "८३%", "location": "सातारा", "phone": "9823323193", "photoUrl": "" },
    { "sr": 2, "name": "झोया फैयाज + तबस्सुम शिकलगार", "marks": "८२.५%", "location": "सातारा", "phone": "9823323193", "photoUrl": "" },
    { "sr": 3, "name": "शिफा जहांगीर शिकलगार", "marks": "७७%", "location": "शेणोली स्टेशन", "phone": "7498879343", "photoUrl": "" },
    { "sr": 4, "name": "अरमान राजेखान शिकलगार", "marks": "७३.३३%", "location": "भाडळे", "phone": "9156418576", "photoUrl": "" }
  ];

  outstandingAchievements = [
    // समाजातील अनेक महिला सदस्यांनी लग्नानंतर आणि प्रदीर्घ खंडानंतर १२ वी पूर्ण केली आहे.
    { "sr": 26, "name": "झीनत अरबाज शिकलगार", "area": "शिक्षण", "achivement": "लग्नानंतर २ वर्षांच्या मुलाचा सांभाळ करत ८३% गुणांसह एम.बी.ए. (MBA) पूर्ण केले.", "location": "कोरेगाव", "phone": "", "photoUrl": "" },
    { "sr": 30, "name": "सौ. आफरीन नईम शिकलगार", "area": "शिक्षण", "achivement": "वय २९, १२ वी पास. परिवारात दोन मुले, पती, सासू-सासरे, मोठे दीर व त्यांचा परिवार यांचा सांभाळ तसेच शिलाई काम करत सन २०२४-२०२५ मध्ये मिळवलेले अभिनंदनीय सुयश.", "location": "कराड", "phone": "", "photoUrl": "" },
    { "sr": 31, "name": "सौ. नूरजहाँ जमीर शिकलगार", "area": "शिक्षण", "achivement": "वय ४०, १२ वी पास. परिवारात दोन मुले.", "location": "ओगलेवाडी", "phone": "", "photoUrl": "" },
    { "sr": 32, "name": "सौ. रिझवाना कलिम शिकलगार", "area": "शिक्षण", "achivement": "१२ वी पास", "location": "", "phone": "", "photoUrl": "" },
    { "sr": 33, "name": "सौ. बिस्मिल्ला इरफान शिकलगार", "area": "शिक्षण", "achivement": "१२ वी पास, परिवारात विशीतील दोन मुली.", "location": "केसे पाडळी", "phone": "", "photoUrl": "" },

    { "sr": 34, "name": "फैज रियाज शिकलगार", "area": "शिक्षण", "achivement": ".", "location": "गोळेश्वर - कराड", "phone": "इयत्ता ४ थी च्या विद्यार्थ्याची विविध प्रमाणपत्र परीक्षेत उल्लेखनिय यश जिल्हयात २८ वा. महाराष्ट्र राज्य परिक्षा परिषद शिष्यवृत्ती, मंथन राज्य स्तरीय जनरल नॉलेज परीक्षा, नॅशनल स्पीड मॅथेमॅटिक्स परिक्षा, नॅशनल स्कॉलर सर्च परिक्षा, Brain development scholarship exam.", "photoUrl": "" },
    { "sr": 21, "name": "डॉ. साहिल अनिस + शबाना शिकलगार", "area": "शिक्षण", "achivement": "कॉझल इन्फरन्स - डेटा सायन्स (Causal Inference - Data Science) या विषयात पीएच.डी. (PhD) संपादन.", "location": "सातारा", "phone": "9886174607", "photoUrl": "" },
    { "sr": 25, "name": "सफिया नियाज शिकलगार", "area": "शिक्षण", "achivement": "NT-B प्रवर्गातून एम.बी.बी.एस. (MBBS) प्रवेश.", "location": "नेर", "phone": "", "photoUrl": "" },
    { "sr": 27, "name": "डॅा. सानिया आमीन शिकलगार", "area": "शिक्षण", "achivement": "Passed Master of Dental Surgery exam", "location": "शेणोली", "phone": "", "photoUrl": "" },
    { "sr": 28, "name": "हबीबा करीम शिकलगार", "area": "शिक्षण", "achivement": "Got admission to Bachelor of Dental Surgery - July 2026", "location": "कराड", "phone": "", "photoUrl": "" },
    { "sr": 29, "name": "समरीन सलीम + नसीमा शिकलगार", "area": "शिक्षण", "achivement": "सी.ई.टी. (CET) परीक्षेत ९८ पर्सेन्टाईल गुण.", "location": "कार्वे?", "phone": "", "photoUrl": "" },
    { "sr": 10, "name": "अलीशा सलीम शिकलगार", "area": "शिक्षण", "achivement": "M.Tech Bitechnology - Passed SET Exam. सिनिअर कॅालेज प्रोफेसर पदासाठी पात्र. सध्या ती ENZENE Bio-Science चाकण येथे executive पदावर कार्यरत", "location": "वडगांव हवेली", "phone": "", "photoUrl": "" },
    { "sr": 23, "name": "मोहम्मदअली रुस्तुम शिकलगार", "area": "शिक्षण", "achivement": "महाराष्ट्र राज्य शिक्षण मंडळ इयत्ता ७ वी शिष्यवृत्ती प्राप्त.", "location": "शेणोली", "phone": "", "photoUrl": "" },
    { "sr": 19, "name": "उमर रुस्तुम शिकलगार", "area": "शिक्षण", "achivement": "महाराष्ट्र राज्य शिक्षण मंडळ इयत्ता ५ वी शिष्यवृत्ती प्राप्त.", "location": "शेणोली - खटाव - चितळी", "phone": "", "photoUrl": "" },

    { "sr": 1, "name": "नजरुद्दीन रमजान शिकलगार", "area": "उद्योग / व्यवसाय", "achivement": "महाराष्ट्र उद्योग भूषण पुरस्कार प्राप्त.", "location": "पारगाव", "phone": "", "photoUrl": "" },
    { "sr": 2, "name": "मुजीब शमशुद्दीन शिकलगार", "area": "उद्योग / व्यवसाय", "achivement": "", "location": "इचलकरंजी - शेणोली", "phone": "", "photoUrl": "" },

    { "sr": 6, "name": "अब्बास अमीर शिकलगार", "area": "सामाजिक", "achivement": "वयाची १०० वर्षे पूर्ण (१५ जुलै २०२५).", "location": "दरुज - खटाव", "phone": "", "photoUrl": "" },
    { "sr": 3, "name": "मेहबूब भाई शिकलगार", "area": "सामाजिक", "achivement": "'सदका डब्बा' उपक्रम सुरू करण्यासाठी विशेष आग्रह व पुढाकार. ते गरजू कुटुंबांच्या मदतीसाठी नेहमीच पुढाकार घेतात व नावे सुचवतात.", "location": "सातारा", "phone": "9960729386", "photoUrl": "" },
    { "sr": 4, "name": "मौलाअली शिकलगार", "area": "सामाजिक", "achivement": "गेल्या ४ वर्षांपासून संचालक म्हणून उल्लेखनीय कार्य.", "location": "शेणोली", "phone": "9730934326", "photoUrl": "" },
    { "sr": 5, "name": "हाजरा आझम शिकलगार", "area": "सामाजिक", "achivement": "सातारा जिल्हा कार्याध्यक्षा - भारतीय राष्ट्रीय काँग्रेस (अल्पसंख्याक विभाग).", "location": "सातारा", "phone": "", "photoUrl": "" },
    { "sr": 34, "name": "दिलेरखान शिकलगार", "area": "सामाजिक", "achivement": " मानव अधिकार अँड अँटीकरप्शन वाई तालुका अध्यक्ष पदी नियुक्ती", "location": "वाई", "phone": "", "photoUrl": "" },
    { "sr": 35, "name": "रफिक मकबूल शिकलगार", "area": "सामाजिक", "achivement": "मानव अधिकार अँड अँटीकरप्शन कोरेगांव तालुका अध्यक्ष पदी नियुक्ती.", "location": "कोरेगाव", "phone": "", "photoUrl": "" },
    { "sr": 8, "name": "बेनझीर दिलावर शिकलगार", "area": "सामाजिक", "achivement": "रोटरॅक्ट क्लब, मलकापूरच्या अध्यक्षपदी निवड.", "location": "कराड", "phone": "", "photoUrl": "" },

    { "sr": 9, "name": "साकिब नासिरहुसेन शिकलगार", "area": "वैद्यकीय", "achivement": "कामतें (चिपळूण) येथे नर्सिंग ऑफिसर म्हणून सर्वोत्कृष्ट कामगिरी.", "location": "कलेढोण", "phone": "", "photoUrl": "" },

    { "sr": 11, "name": "समीर अली शिकलगार", "area": "शासकीय सेवा", "achivement": "शासकीय परीक्षेद्वारे वैद्यकीय प्रयोगशाळा वैज्ञानिक अधिकारी (Medical Lab Scientific Officer) पदी निवड.", "location": "कलेढोण", "phone": "", "photoUrl": "" },
    { "sr": 12, "name": "अंजुम हसन शिकलगार", "area": "शासकीय सेवा", "achivement": "मंडल अधिकारी (Circle Officer).", "location": "कराड", "phone": "", "photoUrl": "" },
    { "sr": 16, "name": "नेहा अमीन तांबोळी", "area": "शासकीय सेवा", "achivement": "अत्यंत सामान्य कुटुंबातून येऊन यूपीएससी (UPSC) परीक्षा उत्तीर्ण व उपजिल्हाधिकारी (Deputy Collector) पदी निवड.", "location": "पुसेगाव - खटाव", "phone": "", "photoUrl": "" },
    { "sr": 24, "name": "श्री. जुबेर सिकंदर शिकलगार", "area": "शासकीय सेवा", "achivement": "भारतीय सैन्यात अधिकारी (Army Officer) म्हणून रुजू.", "location": "नागठाणे", "phone": "", "photoUrl": "" },
    { "sr": 14, "name": "श्री. फैजान अमीन शिकलगार", "area": "शासकीय सेवा", "achivement": "पुणे येथे पोलीस अधिकारी म्हणून रुजू, तसेच विभागीय व्हॉलीबॉल चॅम्पियन.", "location": "नागठाणे", "phone": "", "photoUrl": "" },
    { "sr": 18, "name": "साहिल जाहिद शिकलगार", "area": "शासकीय सेवा", "achivement": "सहाय्यक रासायनिक विश्लेषक - न्यायवैद्यक तज्ज्ञ (Assistant Chemical Analyst - Forensic Expert).", "location": "दरुज - खटाव", "phone": "", "photoUrl": "" }
  ]; //Rajkumar Gani Shikalgar - Sameer Gafurbhai Shikalgar - Shirwal.. Sarole ..Aslam Yusuf Shikalgar
  //
}
