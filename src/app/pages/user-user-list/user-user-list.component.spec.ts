import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUserListComponent } from './user-user-list.component';

describe('UserUserListComponent', () => {
  let component: UserUserListComponent;
  let fixture: ComponentFixture<UserUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
