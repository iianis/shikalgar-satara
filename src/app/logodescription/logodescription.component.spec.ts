import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogodescriptionComponent } from './logodescription.component';

describe('LogodescriptionComponent', () => {
  let component: LogodescriptionComponent;
  let fixture: ComponentFixture<LogodescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogodescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogodescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
