import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsManagement } from './songs-management';

describe('SongsManagement', () => {
  let component: SongsManagement;
  let fixture: ComponentFixture<SongsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongsManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
