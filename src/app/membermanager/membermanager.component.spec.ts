import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembermanagerComponent } from './membermanager.component';

describe('MembermanagerComponent', () => {
  let component: MembermanagerComponent;
  let fixture: ComponentFixture<MembermanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembermanagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembermanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
