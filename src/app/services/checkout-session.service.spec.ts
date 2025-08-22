import { TestBed } from '@angular/core/testing';

import { CheckoutSessionService } from './checkout-session.service';

describe('CheckoutSessionService', () => {
  let service: CheckoutSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
