import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MusicService } from './music';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private musicService: MusicService) {}

  private audio = new Audio();

  private playlist: any[] = [];
  private currentIndex = -1;

  private currentSongSubject = new BehaviorSubject<any>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private volumeSubject = new BehaviorSubject<number>(1);
  volume$ = this.volumeSubject.asObservable();

  setVolume(value: number) {
    this.audio.volume = value;
    this.volumeSubject.next(value);
  }

  mute() {
    this.audio.volume = 0;
    this.volumeSubject.next(0);
  }

  unmute() {
    this.audio.volume = 1;
    this.volumeSubject.next(1);
  }

  // Set full playlist
  setPlaylist(songs: any[]) {
    this.playlist = songs;
  }

  play(song: any) {
    const index = this.playlist.findIndex((s) => s.id === song.id);
    this.currentIndex = index;

    this.startAudio(song);
  }

  private startAudio(song: any) {
    this.audio.pause();
    this.audio = new Audio(song.audioUrl);

    this.audio.play();

    this.currentSongSubject.next(song);
    this.isPlayingSubject.next(true);
    this.musicService.playSong(song.id).subscribe();

    // Auto play next when ends
    this.audio.onended = () => {
      this.next();
    };
  }

  pause() {
    this.audio.pause();
    this.isPlayingSubject.next(false);

    // notify backend
    this.musicService.pauseSong().subscribe({
      error: (err) => console.error('Pause failed', err),
    });
  }

  resume() {
    this.audio.play();
    this.isPlayingSubject.next(true);

    const song = this.currentSongSubject.value;

    if (song) {
      this.musicService.playSong(song.id).subscribe({
        error: (err) => console.error('Resume API failed', err),
      });
    }
  }

  next() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.startAudio(this.playlist[this.currentIndex]);
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.startAudio(this.playlist[this.currentIndex]);
    }
  }
}
