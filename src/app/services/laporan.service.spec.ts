import { TestBed } from '@angular/core/testing';

import { LaporanService } from './laporan.service';

describe('LaporanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaporanService = TestBed.get(LaporanService);
    expect(service).toBeTruthy();
  });
});
