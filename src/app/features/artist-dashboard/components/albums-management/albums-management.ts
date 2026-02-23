import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AlbumService } from '../../services/album';
import { SongService } from '../../services/song';

@Component({
  selector: 'app-albums-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './albums-management.html',
  styleUrl: './albums-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsManagement implements OnInit {
  albums: any[] = [];
  selectedCover: File | null = null;
  creating = false;

  songs: any[] = []; // load artist songs
  selectedSongId: number | null = null;

  form;

  editingAlbumId: number | null = null;
  updateCover: File | null = null;

  editForm;

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef,
    private songService: SongService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      releaseDate: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      name: [''],
      description: [''],
    });
  }

  ngOnInit() {
    this.loadAlbums();
    this.loadSongs();
  }

  loadAlbums() {
    this.cdr.markForCheck();
    this.albumService.getAlbums().subscribe((res) => {
      this.albums = res;
      this.cdr.detectChanges();
    });
  }

  onCoverSelected(event: any) {
    this.selectedCover = event.target.files[0];
  }

  createAlbum() {
    const formData = new FormData();

    formData.append('data', JSON.stringify(this.form.value));

    if (this.selectedCover) {
      formData.append('cover', this.selectedCover);
    }

    this.creating = true;

    this.albumService.createAlbum(formData).subscribe({
      next: () => {
        this.creating = false;
        this.form.reset();
        this.selectedCover = null;
        alert('Album created successfully');
        this.loadAlbums();
      },
      error: () => {
        this.creating = false;
        alert('Failed to create album');
      },
    });
  }

  deleteAlbum(id: number) {
    if (!confirm('Delete this album?')) return;

    this.albumService.deleteAlbum(id).subscribe({
      next: () => {
        this.albums = this.albums.filter((album) => album.id != id);
        this.cdr.markForCheck(); // only if using OnPush
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Delete failed');
      },
    });
  }

  startEdit(album: any) {
    this.editingAlbumId = album.id;

    this.editForm.patchValue({
      name: album.name,
      description: album.description,
    });
  }

  onUpdateCoverSelected(event: any) {
    this.updateCover = event.target.files[0];
  }

  saveAlbumUpdate() {
    if (!this.editingAlbumId) return;

    const formData = new FormData();

    formData.append('data', JSON.stringify(this.editForm.value));

    if (this.updateCover) {
      formData.append('cover', this.updateCover);
    }

    this.albumService.updateAlbum(this.editingAlbumId, formData).subscribe({
      next: () => {
        this.editingAlbumId = null;
        this.updateCover = null;
        this.loadAlbums();
      },
      error: () => alert('Failed to update album'),
    });
  }

  loadSongs() {
    // use your SongService
    this.songService.getArtistSongs().subscribe((res) => {
      this.songs = res;
    });
  }

  addSong(albumId: number) {
    if (!this.selectedSongId) return;

    this.albumService.addSongToAlbum(albumId, this.selectedSongId).subscribe({
      next: () => {
        this.selectedSongId = null;
        this.loadAlbums();
      },
      error: () => alert('Failed to add song'),
    });
  }

  removeSong(albumId: number, songId: number) {
    this.albumService.removeSongFromAlbum(albumId, songId).subscribe(() => {
      this.loadAlbums();
    });
  }
}
