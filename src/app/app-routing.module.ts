import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MembersComponent } from './members/members.component';
import { RemembranceComponent } from './remembrance/remembrance.component';
import { MemberslistComponent } from './memberslist/memberslist.component';
//import { RegisterComponent } from './register/register.component';
import { EventslistComponent } from './eventslist/eventslist.component';
import { MembernewComponent } from './membersnew/membersnew.component';
import { CharityComponent } from './charity/charity.component';
import { RequestsComponent } from './requests/requests.component';
import { EventsDataCollectorComponent } from './eventsdatacollector/eventsdatacollector.component';
import { AffiliatesComponent } from './affiliates/affiliates.component';
import { UpscComponent } from './upsc/upsc.component';
import { AdsPopupComponent } from './advertisement/ads-popup/ads-popup.component';
import { AnnouncementComponent } from './announcement/announcement.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent
  // },
  {
    path: 'register',
    component: MembernewComponent
  },
  {
    path: 'eventsdatacollector',
    component: EventsDataCollectorComponent
  },
  {
    path: 'announcement',
    component: AnnouncementComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'remembrance',
        component: RemembranceComponent
      },
      {
        path: 'member',
        component: MembersComponent
      },
      {
        path: 'memberslist',
        component: MemberslistComponent
      },
      {
        path: 'eventslist',
        component: EventslistComponent
      },
      {
        path: 'membersnew',
        component: MembernewComponent
      },
      {
        path: 'charity',
        component: CharityComponent
      },
      {
        path: 'requests',
        component: RequestsComponent
      },
      {
        path: 'affiliates',
        component: AffiliatesComponent
      },
      {
        path: 'education',
        component: UpscComponent
      },
      {
        path: 'adspopup',
        component: AdsPopupComponent
      }
    ]
  },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'logo', loadChildren: () => import('./logo/logo.module').then(m => m.LogoModule) },
  { path: 'slideshow', loadChildren: () => import('./slideshow/slideshow.module').then(m => m.SlideshowModule) },
  { path: 'logodescription', loadChildren: () => import('./logodescription/logodescription.module').then(m => m.LogodescriptionModule) },
  { path: 'members', loadChildren: () => import('./members/members.module').then(m => m.MembersModule) },
  { path: 'memberslist', loadChildren: () => import('./memberslist/memberslist.module').then(m => m.MemberslistModule) },
  { path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule) },
  { path: 'recommendation', loadChildren: () => import('./recommendation/recommendation.module').then(m => m.RecommendationModule) },
  { path: 'activities', loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule) },
  { path: 'upipayment', loadChildren: () => import('./upipayment/upipayment.module').then(m => m.UpipaymentModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./membersnew/membersnew.module').then(m => m.MembersnewModule) },
  { path: 'education', loadChildren: () => import('./upsc/upsc.module').then(m => m.UpscModule) },
  { path: 'adspopup', loadChildren: () => import('./advertisement/advertisement.module').then(m => m.AdvertisementModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
