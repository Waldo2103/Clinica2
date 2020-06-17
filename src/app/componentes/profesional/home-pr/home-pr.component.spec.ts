import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePrComponent } from './home-pr.component';

describe('HomePrComponent', () => {
  let component: HomePrComponent;
  let fixture: ComponentFixture<HomePrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
