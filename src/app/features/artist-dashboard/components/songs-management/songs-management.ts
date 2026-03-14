import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { SongService } from '../../services/song';
import { Genre } from '../../../../core/models/genre.enum';

@Component({
  selector: 'app-songs-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './songs-management.html',
  styleUrl: './songs-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsManagement {
  genres = Object.values(Genre);

  selectedAudio: File | null = null;
  selectedCover: File | null = null;

  uploading = false;

  form;

  songs: any[] = [];
  editingSongId: number | null = null;
  editForm;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: [0, Validators.required],
      albumId: [null],
      releaseDate: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      title: [''],
      genre: [''],
      albumId: [null],
    });
  }

  ngOnInit() {
    this.loadSongs();
  }

  onAudioSelected(event: any) {
    this.selectedAudio = event.target.files[0];
  }

  onCoverSelected(event: any) {
    this.selectedCover = event.target.files[0];
  }

  uploadSong() {
    this.cdr.markForCheck();
    if (!this.selectedAudio) {
      alert('Audio file is required');
      return;
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(this.form.value));

    formData.append('audio', this.selectedAudio);

    if (this.selectedCover) {
      formData.append('cover', this.selectedCover);
    }

    this.uploading = true;

    this.songService.uploadSong(formData).subscribe({
      next: (newSong) => {
        this.songs = [...this.songs, newSong];
        this.uploading = false;
        alert('Song uploaded successfully');
        this.resetUploadForm();
        //this.loadSongs();
        this.cdr.markForCheck();
      },
      error: () => {
        this.uploading = false;
        alert('Upload failed');
        this.cdr.markForCheck();
      },
    });
  }

  resetUploadForm() {
    this.form.reset({
      title: '',
      genre: '',
      duration: null,
      albumId: null,
      releaseDate: '',
    });

    this.selectedAudio = null;
    this.selectedCover = null;
  }

  startEdit(song: any) {
    this.editingSongId = song.id;

    this.editForm.patchValue({
      title: song.title,
      genre: song.genre,
      albumId: song.albumId,
    });
  }

  saveUpdate() {
    if (!this.editingSongId) return;

    this.songService.updateSong(this.editingSongId, this.editForm.value).subscribe({
      next: () => {
        alert('Song updated');
        this.editingSongId = null;
        this.loadSongs();
        this.cdr.markForCheck();
      },
      error: () => alert('Update failed'),
    });
  }

  loadSongs() {
    this.cdr.markForCheck();
    this.songService.getArtistSongs().subscribe({
      next: (res) => {
        this.songs = res;
        this.cdr.detectChanges();
      },
      error: () => {
        console.error('Failed to load songs');
        this.cdr.detectChanges();
      },
    });
  }

  deleteSong(songId: number) {
    if (!confirm('Are you sure?')) return;

    this.songService.deleteSong(songId).subscribe({
      next: () => {
        this.songs = this.songs.filter((song) => song.id != songId);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('Delete failed');
      },
    });
  }

  changeVisibility(song: any, newVisibility: 'PUBLIC' | 'UNLISTED') {
    const oldVisibility = song.visibility;

    // Optimistic update
    this.songs = this.songs.map((s) =>
      s.id === song.id ? { ...s, visibility: newVisibility } : s,
    );

    this.cdr.markForCheck();

    this.songService.updateSongVisibility(song.id, newVisibility).subscribe({
      error: () => {
        // revert if backend fails
        this.songs = this.songs.map((s) =>
          s.id === song.id ? { ...s, visibility: oldVisibility } : s,
        );
        this.cdr.markForCheck();
        alert('Failed to update visibility');
      },
    });
  }
}
