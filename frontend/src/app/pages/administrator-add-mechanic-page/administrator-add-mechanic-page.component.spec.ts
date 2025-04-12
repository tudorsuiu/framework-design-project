import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorAddMechanicPageComponent } from './administrator-add-mechanic-page.component';

describe('AdministratorAddMechanicPageComponent', () => {
  let component: AdministratorAddMechanicPageComponent;
  let fixture: ComponentFixture<AdministratorAddMechanicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministratorAddMechanicPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministratorAddMechanicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
