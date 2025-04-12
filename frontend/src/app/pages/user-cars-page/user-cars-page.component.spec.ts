import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCarsPageComponent } from './user-cars-page.component';

describe('UserCarsPageComponent', () => {
  let component: UserCarsPageComponent;
  let fixture: ComponentFixture<UserCarsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCarsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCarsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
