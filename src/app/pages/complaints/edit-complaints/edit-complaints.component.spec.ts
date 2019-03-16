import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComplaintsComponent } from './edit-complaints.component';

describe('EditComplaintsComponent', () => {
  let component: EditComplaintsComponent;
  let fixture: ComponentFixture<EditComplaintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditComplaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
