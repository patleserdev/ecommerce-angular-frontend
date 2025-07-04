import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMediasComponent } from './admin-medias.component';

describe('MediasComponent', () => {
  let component: AdminMediasComponent;
  let fixture: ComponentFixture<AdminMediasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMediasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
