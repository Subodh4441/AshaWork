import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCarouselComponent } from './login-carousel.component';

describe('LoginCarouselComponent', () => {
  let component: LoginCarouselComponent;
  let fixture: ComponentFixture<LoginCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
