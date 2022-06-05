import { TestBed } from '@angular/core/testing';

import { TankMovementService } from './tank-movement.service';

describe('TankMovementService', () => {
  let service: TankMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TankMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
