import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HullComponent } from './hull.component';

describe('HullComponent', () => {
  let component: HullComponent;
  let fixture: ComponentFixture<HullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
