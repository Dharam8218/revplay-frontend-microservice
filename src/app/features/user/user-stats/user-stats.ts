import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../core/services/music';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-stats.html',
  styleUrls: ['./user-stats.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserStatsComponent implements OnInit {
  totalPlaylists = 0;
  totalFavorites = 0;
  totalPlayCount = 0;
  loading = true;

  constructor(
    private musicService: MusicService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cdr.markForCheck();

    this.musicService.getUserStatistics().subscribe({
      next: (res) => {
        this.totalPlaylists = res.totalPlaylists;
        this.totalFavorites = res.favoriteSongs;
        this.totalPlayCount = res.totalPlayCount;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Stats failed', err);
        this.loading = false;
      },
    });
  }
}
