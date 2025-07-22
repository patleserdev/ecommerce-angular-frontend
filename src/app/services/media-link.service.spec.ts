import { TestBed } from '@angular/core/testing';

import { MediaLinkService } from './media-link.service';

describe('MediaLinkService', () => {
  let service: MediaLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
