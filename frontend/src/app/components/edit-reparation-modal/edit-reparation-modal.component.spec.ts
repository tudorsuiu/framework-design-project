import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReparationModalComponent } from './edit-reparation-modal.component';

describe('EditReparationModalComponent', () => {
  let component: EditReparationModalComponent;
  let fixture: ComponentFixture<EditReparationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditReparationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditReparationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
