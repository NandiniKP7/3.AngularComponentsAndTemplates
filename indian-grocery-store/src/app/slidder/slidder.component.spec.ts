import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidderComponent } from './slidder.component';

describe('SlidderComponent', () => {
  let component: SlidderComponent;
  let fixture: ComponentFixture<SlidderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlidderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
