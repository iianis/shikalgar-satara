import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KulakjaiComponent } from './kulakjai.component';

describe('KulakjaiComponent', () => {
  let component: KulakjaiComponent;
  let fixture: ComponentFixture<KulakjaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KulakjaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KulakjaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
