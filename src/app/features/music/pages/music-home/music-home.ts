import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../../core/services/music';
import { PlayerService } from '../../../../core/services/player';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-music-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './music-home.html',
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

    this.loadSongs();

    // Load favorites separately
    this.loadFavorites();
  }

  loadFavorites() {
    this.musicService
      .getFavorites()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any[]) => {
          this.favoriteIds = new Set(res.map((song) => song.id));
        },
        error: (err) => {
          console.error('Favorites failed', err);
        },
      });
  }

  loadSongs() {
    this.loading = true;

    this.musicService
      .getSongs(this.page, this.size, 'id', 'asc')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.songs = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;

          //this.playerService.setPlaylist(this.songs);

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading songs:', err);
          this.loading = false; // 🔥 IMPORTANT
        },
      });
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
    const isFav = this.favoriteIds.has(song.id);

    if (!isFav) {
      this.favoriteIds.add(song.id);

      this.musicService
        .markFavorite(song.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: () => this.favoriteIds.delete(song.id),
        });
    } else {
      this.favoriteIds.delete(song.id);

      this.musicService
        .removeFavorite(song.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: () => this.favoriteIds.add(song.id),
        });
    }
  }

  openAddToPlaylist(song: any) {
    this.selectedSongForPlaylist = song;
    this.showPlaylistPopup = true;

    this.musicService
      .getPlaylists(0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.userPlaylists = res.content;
      });
  }

  closePlaylistPopup() {
    this.selectedSongForPlaylist = null;
    this.showPlaylistPopup = false;
  }

  addSongToPlaylist(playlistId: number) {
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
        },
        error: () => {
          this.addingPlaylistId = null;
          this.showToast('Song already exists ⚠');
        },
      });
  }

  showToast(message: string) {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
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
