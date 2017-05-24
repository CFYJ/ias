import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KontaktyComponent } from './kontakty.component';

describe('KontaktyComponent', () => {
  let component: KontaktyComponent;
  let fixture: ComponentFixture<KontaktyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KontaktyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KontaktyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
