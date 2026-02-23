import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlaylists } from './public-playlists';

describe('PublicPlaylists', () => {
  let component: PublicPlaylists;
  let fixture: ComponentFixture<PublicPlaylists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPlaylists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPlaylists);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
