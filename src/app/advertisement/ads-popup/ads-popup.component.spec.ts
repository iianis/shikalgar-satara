import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsPopupComponent } from './ads-popup.component';

describe('AdsPopupComponent', () => {
  let component: AdsPopupComponent;
  let fixture: ComponentFixture<AdsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
