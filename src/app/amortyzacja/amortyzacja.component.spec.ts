import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortyzacjaComponent } from './amortyzacja.component';

describe('AmortyzacjaComponent', () => {
  let component: AmortyzacjaComponent;
  let fixture: ComponentFixture<AmortyzacjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmortyzacjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmortyzacjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
