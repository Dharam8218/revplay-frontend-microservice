import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsManagement } from './albums-management';

describe('AlbumsManagement', () => {
  let component: AlbumsManagement;
  let fixture: ComponentFixture<AlbumsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumsManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
