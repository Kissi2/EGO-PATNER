import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerLib } from './partner-lib';

describe('PartnerLib', () => {
  let component: PartnerLib;
  let fixture: ComponentFixture<PartnerLib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerLib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerLib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
