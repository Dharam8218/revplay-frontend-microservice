import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { Genre } from '../../../../core/models/genre.enum';

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artist-profile.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ArtistProfileComponent implements OnInit {
  profile: any;
  editMode = false;
  loading = true;

  selectedProfile: File | null = null;
  selectedBanner: File | null = null;

  genres = Object.values(Genre);

  editForm;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.editForm = this.fb.group({
      artistName: [''],
      bio: [''],
      genre: [''],
      instagram: [''],
      twitter: [''],
      youtube: [''],
      spotify: [''],
      website: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.cdr.markForCheck();
    this.authService.getArtistProfile().subscribe((res) => {
      this.profile = res;
      this.editForm.patchValue(res);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  onProfileSelected(event: any) {
    this.selectedProfile = event.target.files[0];
  }

  onBannerSelected(event: any) {
    this.selectedBanner = event.target.files[0];
  }

  saveChanges() {
    const formData = new FormData();

    formData.append('artist', JSON.stringify(this.editForm.value));

    if (this.selectedProfile) {
      formData.append('profilePicture', this.selectedProfile);
    }

    if (this.selectedBanner) {
      formData.append('bannerImage', this.selectedBanner);
    }

    this.authService.updateArtistProfile(formData).subscribe(() => {
      this.editMode = false;
      this.loadProfile();
    });
  }

  formatGenre(genre: string): string {
    return genre
      .toLowerCase()
      .replace('_', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
