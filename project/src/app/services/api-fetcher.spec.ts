import { TestBed } from '@angular/core/testing';

import { ApiFetcher } from './api-fetcher';

describe('ApiFetcher', () => {
  let service: ApiFetcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFetcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
