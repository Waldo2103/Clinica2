import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReseniasPrComponent } from './resenias-pr.component';

describe('ReseniasPrComponent', () => {
  let component: ReseniasPrComponent;
  let fixture: ComponentFixture<ReseniasPrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReseniasPrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReseniasPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
