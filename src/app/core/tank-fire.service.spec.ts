import { TestBed } from '@angular/core/testing';

import { TankFireService } from './tank-fire.service';

describe('TankFireService', () => {
  let service: TankFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TankFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
