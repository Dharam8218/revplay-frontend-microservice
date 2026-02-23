import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../../core/services/music';
import { PlayerService } from '../../../../core/services/player';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-list.html',
})
export class FavoritesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  songs: any[] = [];
  loading = true;

  currentSong: any;
  isPlaying = false;

  constructor(
    private musicService: MusicService,
    private playerService: PlayerService,
  ) {}

  ngOnInit(): void {
    this.playerService.currentSong$.pipe(takeUntil(this.destroy$)).subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.isPlaying = state;
    });

    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;

    this.musicService
      .getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          this.songs = [...res]; // ✅ force new array reference
          this.loading = false;
        },
        // next: (res: any[]) => {
        //   this.songs = res;
        //   this.loading = false;
        // },
        error: (err) => {
          console.error('Favorites failed:', err);
          this.loading = false;
        },
      });
  }

  play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
