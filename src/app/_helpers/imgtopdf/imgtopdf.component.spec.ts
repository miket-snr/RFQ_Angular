import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgtopdfComponent } from './imgtopdf.component';

describe('ImgtopdfComponent', () => {
  let component: ImgtopdfComponent;
  let fixture: ComponentFixture<ImgtopdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgtopdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgtopdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
