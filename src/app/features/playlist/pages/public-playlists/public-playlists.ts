import { Component, OnInit, OnDestroy,ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Default,

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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPublicPlaylists();
  }

  loadPublicPlaylists() {
    this.loading = true;
    this.cdr.markForCheck();
    this.musicService
      .getPublicPlaylists(this.page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.playlists = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
          this.cdr.detectChanges(); // Force view update immediately
          console.log('Public playlists loaded', res);
        },
        error: () => (this.loading = false, this.cdr.detectChanges()), // Ensure loading state is updated on error
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
    this
    const isFollowed = this.followedIds.has(playlist.id);

    if (!isFollowed) {
      this.musicService.followPlaylist(playlist.id).subscribe({
        next: () => {
          this.followedIds.add(playlist.id);
          this.cdr.detectChanges(); // Force view update immediately
        },
        error: (err) => console.error('Follow failed', err),
      });
    } else {
      this.musicService.unfollowPlaylist(playlist.id).subscribe({
        next: () => {
          this.followedIds.delete(playlist.id);
          this.cdr.detectChanges(); // Force view update immediately
        },
        error: (err) => console.error('Unfollow failed', err),
      });
    }
  }
}
