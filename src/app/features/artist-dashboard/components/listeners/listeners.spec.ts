import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listeners } from './listeners';

describe('Listeners', () => {
  let component: Listeners;
  let fixture: ComponentFixture<Listeners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listeners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listeners);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
