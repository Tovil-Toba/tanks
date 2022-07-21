import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPadComponent } from './d-pad.component';

describe('DPadComponent', () => {
  let component: DPadComponent;
  let fixture: ComponentFixture<DPadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DPadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
