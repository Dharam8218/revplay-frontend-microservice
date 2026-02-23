import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MusicService } from '../../../../core/services/music';

@Component({
  selector: 'app-public-playlists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-playlists.html',
})
export class PublicPlaylistsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  followedIds = new Set<number>();

  playlists: any[] = [];
  loading = true;

  page = 0;
  totalPages = 0;

  constructor(
    private musicService: MusicService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPublicPlaylists();
  }

  loadPublicPlaylists() {
    this.loading = true;

    this.musicService
      .getPublicPlaylists(this.page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.playlists = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  openPlaylist(id: number) {
    this.router.navigate(['/playlists', id]);
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadPublicPlaylists();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadPublicPlaylists();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFollow(playlist: any, event: Event) {
    event.stopPropagation();

    const isFollowed = this.followedIds.has(playlist.id);

    if (!isFollowed) {
      this.musicService.followPlaylist(playlist.id).subscribe({
        next: () => {
          this.followedIds.add(playlist.id);
        },
        error: (err) => console.error('Follow failed', err),
      });
    } else {
      this.musicService.unfollowPlaylist(playlist.id).subscribe({
        next: () => {
          this.followedIds.delete(playlist.id);
        },
        error: (err) => console.error('Unfollow failed', err),
      });
    }
  }
}
