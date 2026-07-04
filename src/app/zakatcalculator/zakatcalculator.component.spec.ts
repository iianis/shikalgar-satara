import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakatcalculatorComponent } from './zakatcalculator.component';

describe('ZakatcalculatorComponent', () => {
  let component: ZakatcalculatorComponent;
  let fixture: ComponentFixture<ZakatcalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZakatcalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZakatcalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
