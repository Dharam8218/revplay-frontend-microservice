import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../../user/services/library';
import { PlayerService } from '../../../../core/services/player';

@Component({
  selector: 'app-browse-by-album',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './album-page.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class BrowseByAlbumComponent {

  albums: any[] = [];
  selectedAlbumId: number | null = null;
  selectedAlbum: any = null;
  songs: any[] = [];
  loading = true;
  currentSong: any;
  isPlaying = false;

  constructor(
    private libraryService: LibraryService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
  ) {}

   play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  ngOnInit() {
    this.libraryService.getAllAlbums().subscribe(res => {
      this.albums = res;
      console.log('Albums:', res);
      this.cdr.markForCheck();
    });

     this.playerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.subscribe((state) => {
      this.isPlaying = state;
    });
  }

  loadAlbum() {
    this.cdr.markForCheck();
    if (!this.selectedAlbumId) return;

    this.selectedAlbum = this.albums.find(
    album => album.id === this.selectedAlbumId
    );
    this.cdr.detectChanges();
  }
}