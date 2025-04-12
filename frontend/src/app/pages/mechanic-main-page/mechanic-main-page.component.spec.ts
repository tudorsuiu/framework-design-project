import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicMainPageComponent } from './mechanic-main-page.component';

describe('MechanicMainPageComponent', () => {
  let component: MechanicMainPageComponent;
  let fixture: ComponentFixture<MechanicMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicMainPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechanicMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
