import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizaGraficznaComponent } from './analiza-graficzna.component';

describe('AnalizaGraficznaComponent', () => {
  let component: AnalizaGraficznaComponent;
  let fixture: ComponentFixture<AnalizaGraficznaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalizaGraficznaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalizaGraficznaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
