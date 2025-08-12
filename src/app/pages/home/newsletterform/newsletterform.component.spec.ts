import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterformComponent } from './newsletterform.component';

describe('NewsletterformComponent', () => {
  let component: NewsletterformComponent;
  let fixture: ComponentFixture<NewsletterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsletterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
