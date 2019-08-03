import { TestBed } from '@angular/core/testing';

import { TotalService } from './total.service';

describe('TotalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TotalService = TestBed.get(TotalService);
    expect(service).toBeTruthy();
  });
});
