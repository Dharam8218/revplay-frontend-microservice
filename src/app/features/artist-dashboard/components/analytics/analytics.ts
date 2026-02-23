import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AnalyticsService,
  TrendResponse,
  TopListener,
  FavoritedUser,
} from '../../services/analytics';
import { FormsModule } from '@angular/forms';
import { SongService } from '../../services/song';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  trends: TrendResponse[] = [];
  selectedType: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'MONTHLY';
  loading = false;

  topListeners: TopListener[] = [];
  favoritedUsers: FavoritedUser[] = [];
  songs: any[] = [];

  currentPage = 0;
  totalPages = 0;

  selectedSongId: number | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef,
    private songService: SongService,
  ) {}

  ngOnInit() {
    this.loadTrends();
    this.loadTopListeners();
    this.loadSongs();
  }

  changeType(type: 'DAILY' | 'WEEKLY' | 'MONTHLY') {
    this.selectedType = type;
    this.loadTrends();
  }

  loadTrends() {
    this.loading = true;
    this.cdr.markForCheck();
    this.analyticsService.getTrends(this.selectedType).subscribe({
      next: (res) => {
        this.trends = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        alert('Failed to load analytics');
      },
    });
  }

  getTotalPlays(): number {
    return this.trends.reduce((sum, t) => sum + t.playCount, 0);
  }

  loadTopListeners(page: number = 0) {
    this.cdr.markForCheck();
    this.analyticsService.getTopListeners(page).subscribe((res) => {
      this.topListeners = res.content;
      this.totalPages = res.totalPages;
      this.currentPage = res.number;
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

  loadSongs() {
    this.cdr.markForCheck();
    this.songService.getArtistSongs().subscribe({
      next: (res) => {
        this.songs = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load songs', err);
      },
    });
  }
}
