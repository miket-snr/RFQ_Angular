import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsourcingComponent } from './esourcing.component';

describe('EsourcingComponent', () => {
  let component: EsourcingComponent;
  let fixture: ComponentFixture<EsourcingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsourcingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsourcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
