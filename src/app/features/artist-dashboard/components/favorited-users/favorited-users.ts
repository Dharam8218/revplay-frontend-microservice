import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, FavoritedUser } from '../../services/analytics';
import { SongService } from '../../services/song';

@Component({
  selector: 'app-favorited-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorited-users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritedUsers implements OnInit {
  songs: any[] = [];
  favoritedUsers: FavoritedUser[] = [];
  selectedSongId: number | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private songService: SongService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadSongs();
  }

  loadSongs() {
    this.cdr.markForCheck();
    this.songService.getArtistSongs().subscribe((res) => {
      this.songs = res;
      this.cdr.detectChanges();
    });
  }

  loadFavoritedUsers() {
    this.cdr.markForCheck();
    if (!this.selectedSongId) return;

    this.analyticsService.getFavoritedUsers(this.selectedSongId).subscribe((res) => {
      this.favoritedUsers = res;
      this.cdr.detectChanges();
    });
  }
}
