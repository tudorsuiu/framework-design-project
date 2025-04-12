import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicHeaderComponent } from './mechanic-header.component';

describe('MechanicHeaderComponent', () => {
  let component: MechanicHeaderComponent;
  let fixture: ComponentFixture<MechanicHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechanicHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
