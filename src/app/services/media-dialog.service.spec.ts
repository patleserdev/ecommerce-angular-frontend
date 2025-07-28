import { TestBed } from '@angular/core/testing';

import { MediaDialogService } from './media-dialog.service';

describe('MediaDialogService', () => {
  let service: MediaDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
