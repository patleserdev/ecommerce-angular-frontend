import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPromoBannerComponent } from './header-promo-banner.component';

describe('HeaderPromoBannerComponent', () => {
  let component: HeaderPromoBannerComponent;
  let fixture: ComponentFixture<HeaderPromoBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPromoBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderPromoBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
