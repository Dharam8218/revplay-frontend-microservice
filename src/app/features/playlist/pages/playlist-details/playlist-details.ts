import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../../../core/services/music';
import { PlayerService } from '../../../../core/services/player';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './playlist-details.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  playlist: any;
  songs: any[] = [];
  loading = true;

  currentSong: any;
  isPlaying = false;
  showSongs = false;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.playerService.currentSong$
      .pipe(takeUntil(this.destroy$))
      .subscribe((song) => (this.currentSong = song));

    this.playerService.isPlaying$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => (this.isPlaying = state));

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadPlaylist(+id);
      }
    });
  }

  loadPlaylist(id: number) {
    this.loading = true;
    this.cdr.markForCheck();
    this.musicService
      .getPlaylistById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.playlist = res;
          this.songs = res.songs || [];
          console.log('Playlist details loaded', res);
          console.log('Before false:', this.loading);
          this.loading = false;
          console.log('After false:', this.loading);
          this.cdr.detectChanges(); // Force view update immediately
        },
        error: () => (this.loading = false, this.cdr.detectChanges()), // Ensure loading state is updated on error
      });
  }

  play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  playAll() {
    if (this.songs.length > 0) {
      this.playerService.setPlaylist(this.songs);
      this.playerService.play(this.songs[0]);
    }
  }

  removeSong(songId: number) {
    this.cdr.markForCheck();
    this.musicService
      .removeSongFromPlaylist(this.playlist.id, songId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.songs = this.songs.filter((s) => s.id !== songId);
        this.cdr.detectChanges(); // Force view update immediately
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePrivacy() {
    if (!this.playlist) return;
     this.cdr.markForCheck();
    const newValue = !this.playlist.public;

    console.log('Calling PATCH with:', newValue); // DEBUG

    this.musicService.updatePlaylistPrivacy(this.playlist.id, newValue).subscribe({
      next: (updated) => {
        console.log('Updated response:', updated);
        this.playlist = updated;
        this.cdr.detectChanges(); // Force view update immediately  
      },
      error: (err) => console.error('Privacy update failed', err),
    });
  }

  updatePlaylist() {
    if (!this.playlist) return;
    this.cdr.markForCheck();
    const data = {
      name: this.playlist?.name,
      description: this.playlist?.description,
      public: this.playlist?.public,
    };

    this.musicService.updatePlaylist(this.playlist.id, data).subscribe({
      next: (updated) => {
        this.playlist = updated;
        this.cdr.detectChanges(); // Force view update immediately
      },
      error: (err) => console.error('PUT failed:', err),
    });
  }

  editMode = false;

  editData = {
    name: '',
    description: '',
    public: false,
  };

  enableEdit() {
    if (!this.playlist) return;
      this.cdr.markForCheck();
    this.editData = {
      name: this.playlist.name,
      description: this.playlist.description,
      public: this.playlist.public,
    };
    this.cdr.detectChanges(); // Force view update immediately  
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
  }

  saveUpdate() {
    if (!this.playlist) return;
      this.cdr.markForCheck();
    this.musicService.updatePlaylist(this.playlist.id, this.editData).subscribe({
      next: (updated) => {
        this.playlist = updated;
        this.editMode = false;
      },
      error: (err) => console.error('PUT failed:', err),
    });
  }
}
