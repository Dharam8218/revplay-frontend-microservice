import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MusicService } from '../../../../core/services/music';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playlist-list.html',
  styleUrls: ['./playlist-list.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  playlists: any[] = [];
  loading = true;

  page = 0;
  size = 10;
  totalPages = 0;

  constructor(
    private musicService: MusicService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.loading = true;
    this.cdr.markForCheck();
    this.musicService
      .getPlaylists(this.page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.playlists = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
          this.cdr.detectChanges(); // Force view update immediately
          console.log('Playlist loaded', res);
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  openPlaylist(id: number) {
    this.router.navigate(['/playlists', id]);
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadPlaylists();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadPlaylists();
    }
  }

  deletePlaylist(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this playlist?');

    if (!confirmDelete) return;

    this.musicService.deletePlaylist(id).subscribe({
      next: () => {
        this.playlists = this.playlists.filter((p) => p.id !== id);
      },
      error: (err) => console.error('Delete failed:', err),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showCreateModal = false;

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  newPlaylist = {
    name: '',
    description: '',
    isPublic: false,
  };

  createPlaylist() {
    const payload = {
      name: this.newPlaylist.name,
      description: this.newPlaylist.description,
      visibility: this.newPlaylist.isPublic ? 'PUBLIC' : 'PRIVATE',
    };

    this.musicService.createPlaylist(payload).subscribe(() => {
      this.closeCreateModal();
      this.loadPlaylists();

      this.newPlaylist = {
        name: '',
        description: '',
        isPublic: false,
      };
    });
  }
}
