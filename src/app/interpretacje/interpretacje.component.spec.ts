import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretacjeComponent } from './interpretacje.component';

describe('InterpretacjeComponent', () => {
  let component: InterpretacjeComponent;
  let fixture: ComponentFixture<InterpretacjeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterpretacjeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretacjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
