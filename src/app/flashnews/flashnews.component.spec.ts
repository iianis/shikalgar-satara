import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashnewsComponent } from './flashnews.component';

describe('FlashnewsComponent', () => {
  let component: FlashnewsComponent;
  let fixture: ComponentFixture<FlashnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashnewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
