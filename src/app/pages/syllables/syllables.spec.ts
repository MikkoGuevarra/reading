import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Syllables } from './syllables';

describe('Syllables', () => {
  let component: Syllables;
  let fixture: ComponentFixture<Syllables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Syllables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Syllables);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
