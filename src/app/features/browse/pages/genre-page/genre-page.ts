import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../../../../core/services/music';
import { SongResponse, PagedResult } from '../../../../core/models/serach';
import { PlayerService } from '../../../../core/services/player';
@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.html',
  styleUrls: ['./genre-page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GenrePageComponent implements OnInit {
  genre = '';
  songs: SongResponse[] = [];
  loading = true;
  currentSong: any;
  isPlaying = false;

  constructor(
    private route: ActivatedRoute,
    private musicService: MusicService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
  ) {}

  play(song: any) {
    this.playerService.setPlaylist(this.songs);
    this.playerService.play(song);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const genreParam = params.get('genre');
      if (genreParam) {
        this.genre = genreParam;
        this.loadSongs();
      }
    });
    this.playerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.subscribe((state) => {
      this.isPlaying = state;
    });
  }

  loadSongs() {
    this.loading = true;
    this
    this.musicService.getSongsByGenre(this.genre).subscribe({
      next: (res) => {
        this.songs = res.content;
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
}
