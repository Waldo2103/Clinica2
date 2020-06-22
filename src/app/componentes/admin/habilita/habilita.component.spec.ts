import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitaComponent } from './habilita.component';

describe('HabilitaComponent', () => {
  let component: HabilitaComponent;
  let fixture: ComponentFixture<HabilitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
