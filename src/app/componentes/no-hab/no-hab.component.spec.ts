import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoHabComponent } from './no-hab.component';

describe('NoHabComponent', () => {
  let component: NoHabComponent;
  let fixture: ComponentFixture<NoHabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoHabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoHabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
