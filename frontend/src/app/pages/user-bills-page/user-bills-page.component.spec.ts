import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBillsPageComponent } from './user-bills-page.component';

describe('UserBillsPageComponent', () => {
  let component: UserBillsPageComponent;
  let fixture: ComponentFixture<UserBillsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBillsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserBillsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
