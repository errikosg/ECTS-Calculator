import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BychoiceComponent } from './bychoice.component';

describe('BychoiceComponent', () => {
  let component: BychoiceComponent;
  let fixture: ComponentFixture<BychoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BychoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BychoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
