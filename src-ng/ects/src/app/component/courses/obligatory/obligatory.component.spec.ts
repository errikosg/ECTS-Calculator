import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligatoryComponent } from './obligatory.component';

describe('ObligatoryComponent', () => {
  let component: ObligatoryComponent;
  let fixture: ComponentFixture<ObligatoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligatoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
