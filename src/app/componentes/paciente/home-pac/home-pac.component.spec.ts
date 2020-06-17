import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePacComponent } from './home-pac.component';

describe('HomePacComponent', () => {
  let component: HomePacComponent;
  let fixture: ComponentFixture<HomePacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
