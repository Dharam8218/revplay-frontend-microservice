import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';
import { UserProfileComponent } from './UserProfileComponent';
import { ArtistProfileComponent } from './ArtistProfileComponent';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UserProfileComponent, ArtistProfileComponent],
  template: `
    <app-artist-profile *ngIf="isArtist"></app-artist-profile>
    <app-user-profile *ngIf="!isArtist"></app-user-profile>
  `
})
export class ProfileComponent implements OnInit {

  isArtist = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const roles = this.authService.getRoles()
      .map(r => r.replace('ROLE_', ''));

    this.isArtist = roles.includes('ARTIST');
  }
}