import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MusicService } from './music';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private audio = new Audio();

  private playlist: any[] = [];
  private currentIndex = -1;

  constructor(
    private musicService: MusicService,
    private ngZone: NgZone,
  ) {
    // 🔥 START SMOOTH PROGRESS LOOP
    this.startSmoothProgress();

    // 🔥 SET DURATION
    this.audio.onloadedmetadata = () => {
      this.ngZone.run(() => {
        this.durationSubject.next(this.audio.duration);
      });
    };

    // 🔥 AUTO NEXT
    this.audio.onended = () => {
      this.next();
    };
  }

  // ---------------- STATE ----------------

  private currentSongSubject = new BehaviorSubject<any>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private volumeSubject = new BehaviorSubject<number>(1);
  volume$ = this.volumeSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();

  // ---------------- SMOOTH PROGRESS ----------------

  private startSmoothProgress() {
    const update = () => {
      if (!this.audio.paused) {
        this.ngZone.run(() => {
          const current = this.audio.currentTime;
          const duration = this.audio.duration || 0;

          this.currentTimeSubject.next(current);

          if (duration > 0) {
            this.progressSubject.next((current / duration) * 100);
          }
        });
      }

      requestAnimationFrame(update); // 🔥 60fps smooth
    };

    update();
  }

  // ---------------- VOLUME ----------------

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

  // ---------------- PLAYLIST ----------------

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

    // ✅ REUSE AUDIO (IMPORTANT)
    this.audio.src = song.audioUrl;
    this.audio.load();

    this.audio.play();

    this.currentSongSubject.next(song);
    this.isPlayingSubject.next(true);

    this.musicService.playSong(song.id).subscribe();
  }

  // ---------------- CONTROLS ----------------

  pause() {
    this.audio.pause();
    this.isPlayingSubject.next(false);

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

  // ---------------- SEEK ----------------

  seek(percent: number) {
    if (!this.audio.duration) return;

    const newTime = (percent / 100) * this.audio.duration;

    this.audio.currentTime = newTime;

    // 🔥 instant UI update
    this.currentTimeSubject.next(newTime);
    this.progressSubject.next(percent);
  }
}
