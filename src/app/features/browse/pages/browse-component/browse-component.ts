import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../../../core/services/library';
import { Song } from '../../../../core/models/song.model';
import { Album } from '../../../../core/models/album.model';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-component.html',
  styleUrl: './browse-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseComponent {

  songs: Song[] = [];
  selectedAlbum: Album | null = null;

  // Filters
  selectedGenre: string | null = null;
  selectedArtistId: number | null = null;
  selectedYear: number | null = null;

  genres = ['POP', 'ROCK', 'HIP_HOP', 'COUNTRY', 'JAZZ'];

  constructor(
    private libraryService: LibraryService,
    private cdr: ChangeDetectorRef
  ) {}

  browseByGenre() {
    if (!this.selectedGenre) return;

    this.libraryService.browseByGenre(this.selectedGenre)
      .subscribe(res => {
        this.songs = res;
        this.selectedAlbum = null;
        this.cdr.markForCheck();
      });
  }

  browseByArtist() {
    if (!this.selectedArtistId) return;

    this.libraryService.browseByArtist(this.selectedArtistId)
      .subscribe(res => {
        this.songs = res;
        this.selectedAlbum = null;
        this.cdr.markForCheck();
      });
  }

  browseByAlbum(albumId: number) {
    this.libraryService.browseByAlbum(albumId)
      .subscribe(res => {
        this.selectedAlbum = res;
        this.songs = [];
        this.cdr.markForCheck();
      });
  }

  applyFilters() {
    this.libraryService.filter({
      genre: this.selectedGenre ?? undefined,
      artistId: this.selectedArtistId ?? undefined,
      year: this.selectedYear ?? undefined
    }).subscribe(res => {
      this.songs = res;
      this.selectedAlbum = null;
      this.cdr.markForCheck();
    });
  }
}