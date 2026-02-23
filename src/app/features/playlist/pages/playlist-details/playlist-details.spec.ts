import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDetails } from './playlist-details';

describe('PlaylistDetails', () => {
  let component: PlaylistDetails;
  let fixture: ComponentFixture<PlaylistDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
