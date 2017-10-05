import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpowaznieniaComponent } from './upowaznienia.component';

describe('UpowaznieniaComponent', () => {
  let component: UpowaznieniaComponent;
  let fixture: ComponentFixture<UpowaznieniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpowaznieniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpowaznieniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
