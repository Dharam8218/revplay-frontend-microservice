import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MusicService } from '../../../../core/services/music';
import { SearchResponse, SongResponse } from '../../../../core/models/serach';
import { PlayerService } from '../../../../core/services/player';
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchResultsComponent implements OnInit {
  query = '';
  results?: SearchResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private playerService: PlayerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.performSearch();
    });
  }

  openArtist(id: number) {
    this.router.navigate(['/browse-artist', id]);
  }

  openAlbum(id: number) {
    this.router.navigate(['/browse-album', id]);
  }

  openPlaylist(id: number) {
    this.router.navigate(['/playlists', id]);
  }

  performSearch() {
    this.loading = true;
    this.cdr.markForCheck();
    this.musicService.search(this.query).subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
        this.cdr.detectChanges(); // Force view update immediately
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges(); // Force view update immediately
      },
    });
  }

  play(song: SongResponse) {
    this.playerService.play(song.id);
  }
}
