import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../../../core/services/music';
import { SearchResponse, SongResponse } from '../../../../core/models/serach';
import { PlayerService } from '../../../../core/services/player';
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
})
export class SearchResultsComponent implements OnInit {
  query = '';
  results?: SearchResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private playerService: PlayerService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'];
      this.performSearch();
    });
  }

  performSearch() {
    this.loading = true;

    this.musicService.search(this.query).subscribe({
      next: (res) => {
        this.results = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  play(song: SongResponse) {
    this.playerService.play(song.id);
  }
}
