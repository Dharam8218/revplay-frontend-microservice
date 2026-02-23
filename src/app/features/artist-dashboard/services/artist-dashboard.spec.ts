import { TestBed } from '@angular/core/testing';

import { ArtistDashboard } from './artist-dashboard';

describe('ArtistDashboard', () => {
  let service: ArtistDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtistDashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
