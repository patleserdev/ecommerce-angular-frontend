import { customerGuard } from './customer.guard';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

describe('customerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => customerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
