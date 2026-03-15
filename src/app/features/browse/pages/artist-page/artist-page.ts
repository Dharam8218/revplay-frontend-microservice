import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../../user/services/library';
import { PlayerService } from '../../../../core/services/player';

@Component({
  selector: 'app-browse-by-artist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artist-page.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BrowseByArtistComponent {
  artists: any[] = [];
  selectedArtistId: number | null = null;
  selectedArtist: any = null;
  songs: any[] = [];
  loading = true;
  currentSong: any;
  isPlaying = false;

  constructor(
    private libraryService: LibraryService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  ngOnInit() {
    this.libraryService.getAllArtists().subscribe((res) => {
      this.artists = res;

      const artistId = this.route.snapshot.paramMap.get('id');

      if (artistId) {
        this.selectedArtistId = +artistId;
        this.loadSongs();
      }
      console.log('Artists:', res);
      this.cdr.markForCheck();
    });

    this.playerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.subscribe((state) => {
      this.isPlaying = state;
    });
  }

  loadSongs() {
    if (!this.selectedArtistId) return;

    this.loading = true;

    this.libraryService.browseByArtist(this.selectedArtistId).subscribe({
      next: (res) => {
        console.log('artist song', res);

        this.songs = res || [];

        const artist = this.artists.find((a) => a.id === this.selectedArtistId);

        this.selectedArtist = {
          ...artist,
          songs: this.songs,
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load songs', err);
        this.loading = false;
      },
    });
  }
}
