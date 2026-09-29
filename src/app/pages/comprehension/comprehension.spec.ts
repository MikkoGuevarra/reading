import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comprehension } from './comprehension';

describe('Comprehension', () => {
  let component: Comprehension;
  let fixture: ComponentFixture<Comprehension>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comprehension]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comprehension);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
