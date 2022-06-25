import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerIndicatorComponent } from './player-indicator.component';

describe('PlayerIndicatorComponent', () => {
  let component: PlayerIndicatorComponent;
  let fixture: ComponentFixture<PlayerIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
