import { TestBed } from '@angular/core/testing';

import { PesanService } from './pesan.service';

describe('PesanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PesanService = TestBed.get(PesanService);
    expect(service).toBeTruthy();
  });
});
