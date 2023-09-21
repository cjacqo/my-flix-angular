import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogBasicComponent } from './info-dialog-basic.component';

describe('InfoDialogBasicComponent', () => {
  let component: InfoDialogBasicComponent;
  let fixture: ComponentFixture<InfoDialogBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogBasicComponent]
    });
    fixture = TestBed.createComponent(InfoDialogBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
