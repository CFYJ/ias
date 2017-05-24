import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegacjeComponent } from './delegacje.component';

describe('DelegacjeComponent', () => {
  let component: DelegacjeComponent;
  let fixture: ComponentFixture<DelegacjeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelegacjeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegacjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
