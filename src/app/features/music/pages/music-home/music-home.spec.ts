import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicHome } from './music-home';

describe('MusicHome', () => {
  let component: MusicHome;
  let fixture: ComponentFixture<MusicHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
