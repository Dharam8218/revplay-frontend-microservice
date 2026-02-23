import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritedUsers } from './favorited-users';

describe('FavoritedUsers', () => {
  let component: FavoritedUsers;
  let fixture: ComponentFixture<FavoritedUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritedUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritedUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
