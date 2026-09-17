import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sentences } from './sentences';

describe('Sentences', () => {
  let component: Sentences;
  let fixture: ComponentFixture<Sentences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sentences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sentences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
