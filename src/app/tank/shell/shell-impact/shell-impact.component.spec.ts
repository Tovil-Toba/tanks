import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellImpactComponent } from './shell-impact.component';

describe('ShellImpactComponent', () => {
  let component: ShellImpactComponent;
  let fixture: ComponentFixture<ShellImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShellImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
