import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../../user/services/library';
import { PlayerService } from '../../../../core/services/player';

@Component({
  selector: 'app-browse-by-artist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artist-page.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class BrowseByArtistComponent {

  artists: any[] = [];
  selectedArtistId: number | null = null;
  songs: any[] = [];
  loading = true;
  currentSong: any;
  isPlaying = false;

  constructor(
    private libraryService: LibraryService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
  ) {}

   play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  ngOnInit() {
    this.libraryService.getAllArtists().subscribe(res => {
      this.artists = res;
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
    this.cdr.markForCheck();
    console.log('Selected Artist:', this.selectedArtistId);
    if (!this.selectedArtistId) return;

    this.libraryService.browseByArtist(this.selectedArtistId)
      .subscribe(res => {
        this.songs = res.content;
        this.cdr.detectChanges();
      });
  }
}
