import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesDatasComponent } from './categoriesDatas.component';

describe('CategoriesDatasComponent', () => {
  let component: CategoriesDatasComponent;
  let fixture: ComponentFixture<CategoriesDatasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesDatasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesDatasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
