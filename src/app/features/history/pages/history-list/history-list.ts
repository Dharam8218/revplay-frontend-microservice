import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Default,
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.cdr.markForCheck();
    // Recently Played (simple list)
    this.musicService
      .getRecentlyPlayed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.recentlyPlayed = res || [];
        this.loading = false;
        this.cdr.detectChanges(); // Force view update immediately
      });

    // Full History (Page object)
    this.musicService
      .getListeningHistory(this.page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.history = res.content || [];
        this.totalPages = res.totalPages;
        this.loading = false;
        this.cdr.detectChanges(); // Force view update immediately

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
