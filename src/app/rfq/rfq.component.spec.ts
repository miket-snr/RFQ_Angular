import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqComponent } from './rfq.component';

describe('RfqComponent', () => {
  let component: RfqComponent;
  let fixture: ComponentFixture<RfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
