import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamButtonComponent } from './cam-button.component';

describe('CamButtonComponent', () => {
  let component: CamButtonComponent;
  let fixture: ComponentFixture<CamButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CamButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
