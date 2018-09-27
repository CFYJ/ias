import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejestrBwipComponent } from './rejestr-bwip.component';

describe('RejestrBwipComponent', () => {
  let component: RejestrBwipComponent;
  let fixture: ComponentFixture<RejestrBwipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejestrBwipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejestrBwipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
