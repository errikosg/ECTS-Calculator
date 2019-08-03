import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectiveComponent } from './elective.component';

describe('ElectiveComponent', () => {
  let component: ElectiveComponent;
  let fixture: ComponentFixture<ElectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
