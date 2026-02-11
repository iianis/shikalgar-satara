import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentStandingsComponent } from './tournament-standings.component';

describe('TournamentStandingsComponent', () => {
  let component: TournamentStandingsComponent;
  let fixture: ComponentFixture<TournamentStandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentStandingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
