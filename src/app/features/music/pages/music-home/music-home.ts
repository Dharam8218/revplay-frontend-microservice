import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../../core/services/music';
import { PlayerService } from '../../../../core/services/player';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-music-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './music-home.html',
  styleUrls: ['./music-home.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MusicHomeComponent implements OnInit {
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  songs: any[] = [];

  page = 0;
  size = 10;

  totalPages = 0;
  totalElements = 0;
  loading = true;

  currentSong: any;
  isPlaying = false;

  selectedSongForPlaylist: any = null;
  userPlaylists: any[] = [];
  showPlaylistPopup = false;
  favoriteIds = new Set<number>();
  addingPlaylistId: number | null = null;
  toastMessage: string | null = null;

  selectedGenre: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private musicService: MusicService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.playerService.currentSong$.pipe(takeUntil(this.destroy$)).subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.isPlaying = state;
    });

    this.loadSongs();

    // Load favorites separately
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.cdr.markForCheck();
    this.musicService
      .getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          this.favoriteIds = new Set(res.map((song) => song.id));
          this.loading = false;
          this.cdr.detectChanges(); // Force view update immediately
        },
        error: (err) => {
          console.error('Favorites failed', err);
        },
      });
  }

  loadSongs() {
    this.loading = true;
    this.cdr.markForCheck();

    if (this.selectedGenre) {
      this.musicService
        .getSongsByGenre(this.selectedGenre, this.page, this.size)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.songs = res.content;
            this.totalPages = res.totalPages;
            this.totalElements = res.totalElements;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            this.cdr.detectChanges();
          },
        });
    } else {
      this.musicService
        .getSongs(this.page, this.size, 'id', this.sortDirection)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.songs = res.content;
            this.totalPages = res.totalPages;
            this.totalElements = res.totalElements;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            this.cdr.detectChanges();
          },
        });
    }
  }
  applyFilters() {
    this.page = 0;
    this.loadSongs();
  }

  clearFilters() {
    this.selectedGenre = null;
    this.sortDirection = 'asc';
    this.page = 0;
    this.loadSongs();
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadSongs();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadSongs();
    }
  }

  play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);

    // Call history API
    //this.musicService.playSong(song.id).subscribe();
  }

  toggleFavorite(song: any) {
    this.cdr.markForCheck();
    const isFav = this.favoriteIds.has(song.id);

    if (!isFav) {
      this.favoriteIds.add(song.id);
      this.musicService
        .markFavorite(song.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cdr.detectChanges(); // Force view update immediately
          },
          error: () => {
            this.favoriteIds.delete(song.id);
            this.cdr.detectChanges(); // Force view update immediately
          },
        });
    } else {
      this.favoriteIds.delete(song.id);
      this.musicService
        .removeFavorite(song.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cdr.detectChanges(); // Force view update immediately
          },
          error: () => {
            this.favoriteIds.add(song.id);
            this.cdr.detectChanges(); // Force view update immediately
          },
        });
    }
  }

  openAddToPlaylist(song: any) {
    this.cdr.markForCheck();
    this.selectedSongForPlaylist = song;
    this.showPlaylistPopup = true;

    this.musicService
      .getPlaylists(0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.userPlaylists = res.content;
        this.cdr.detectChanges(); // Force view update immediately
      });
  }

  closePlaylistPopup() {
    this.selectedSongForPlaylist = null;
    this.showPlaylistPopup = false;
  }

  addSongToPlaylist(playlistId: number) {
    this.cdr.markForCheck();
    this.addingPlaylistId = playlistId;
    this.musicService
      .addSongToPlaylist(playlistId, this.selectedSongForPlaylist.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update playlist count locally
          const playlist = this.userPlaylists.find((p) => p.id === playlistId);
          if (playlist) {
            playlist.totalSongs += 1;
          }

          this.addingPlaylistId = null;
          this.closePlaylistPopup();
          this.showToast('Song added to playlist 🎵');
          this.cdr.detectChanges(); // Force view update immediately
        },
        error: () => {
          this.addingPlaylistId = null;
          this.showToast('Song already exists ⚠');
          this.cdr.detectChanges(); // Force view update immediately
        },
      });
  }

  showToast(message: string) {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }

  toggleSong(song: any) {
    // Same song currently playing → pause
    if (this.currentSong?.id === song.id && this.isPlaying) {
      this.playerService.pause();
      return;
    }

    // Same song paused → resume
    if (this.currentSong?.id === song.id && !this.isPlaying) {
      this.playerService.resume();
      return;
    }

    // Different song → play
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  genres = [
    'POP',
    'HIP_HOP',
    'RAP',
    'RNB',
    'ROCK',
    'METAL',
    'EDM',
    'TECHNO',
    'HOUSE',
    'TRANCE',
    'JAZZ',
    'BLUES',
    'CLASSICAL',
    'COUNTRY',
    'REGGAE',
    'AFROBEATS',
    'KPOP',
    'INDIE',
    'FOLK',
    'SOUL',
    'GOSPEL',
    'LATIN',
    'DANCEHALL',
    'LOFI',
    'INSTRUMENTAL',
    'ACOUSTIC',
    'PODCAST',
    'OTHER',
  ];
}
