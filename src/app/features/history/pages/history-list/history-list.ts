import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MusicService } from '../../../../core/services/music';
import { PlayerService } from '../../../../core/services/player';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-list.html',
})
export class HistoryListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  recentlyPlayed: any[] = [];
  history: any[] = [];

  page = 0;
  totalPages = 0;

  loading = true;

  constructor(
    private musicService: MusicService,
    private playerService: PlayerService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Recently Played (simple list)
    this.musicService
      .getRecentlyPlayed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.recentlyPlayed = res || [];
      });

    // Full History (Page object)
    this.musicService
      .getListeningHistory(this.page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.history = res.content || [];
        this.totalPages = res.totalPages;
        this.loading = false;
      });
  }
  play(song: any) {
    const mapped = {
      id: song.songId,
      title: song.title,
      artistName: song.artistName,
      coverImageUrl: song.coverImageUrl,
    };

    this.playerService.setPlaylist(
      this.history.map((h) => ({
        id: h.songId,
        title: h.title,
        artistName: h.artistName,
        coverImageUrl: h.coverImageUrl,
      })),
    );

    this.playerService.play(mapped);
  }

  clearHistory() {
    const confirmClear = confirm('Clear listening history?');
    if (!confirmClear) return;

    this.musicService
      .clearHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.history = [];
        this.recentlyPlayed = [];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextPage() {
  if (this.page < this.totalPages - 1) {
    this.page++;
    this.loadData();
  }
}

prevPage() {
  if (this.page > 0) {
    this.page--;
    this.loadData();
  }
}
}
