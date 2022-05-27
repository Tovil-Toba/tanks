import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhaustComponent } from './exhaust.component';

describe('ExhaustComponent', () => {
  let component: ExhaustComponent;
  let fixture: ComponentFixture<ExhaustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhaustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhaustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
