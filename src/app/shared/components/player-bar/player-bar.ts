import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player-bar.html',
})
export class PlayerBarComponent implements OnInit {
  currentSong: any;
  isPlaying = false;
  volume = 1;

  // ✅ NEW
  progress = 0;
  currentTime = 0;
  duration = 0;

  constructor(
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cdr.markForCheck(); // 🔥 FIX
    this.playerService.currentTime$.subscribe((t) => {
      this.currentTime = t;
      this.cdr.detectChanges(); // 🔥 FIX
    });

    this.playerService.progress$.subscribe((p) => {
      this.progress = p;
      this.cdr.detectChanges(); // 🔥 FIX
    });

    this.playerService.duration$.subscribe((d) => {
      this.duration = d;
      this.cdr.detectChanges(); // 🔥 FIX
    });

    this.playerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.subscribe((state) => {
      this.isPlaying = state;
    });

    this.playerService.volume$.subscribe((v) => {
      this.volume = v;
    });

    // 🔥 PROGRESS DATA
    this.playerService.progress$.subscribe((p) => (this.progress = p));
    this.playerService.currentTime$.subscribe((t) => (this.currentTime = t));
    this.playerService.duration$.subscribe((d) => (this.duration = d));
  }

  toggle() {
    this.isPlaying ? this.playerService.pause() : this.playerService.resume();
  }

  next() {
    this.playerService.next();
  }

  previous() {
    this.playerService.previous();
  }

  changeVolume(event: any) {
    const value = parseFloat(event.target.value);
    this.playerService.setVolume(value);
  }

  toggleMute() {
    this.volume === 0 ? this.playerService.unmute() : this.playerService.mute();
  }

  // ✅ SEEK
  onSeek(event: any) {
    const value = parseFloat(event.target.value);
    this.playerService.seek(value);
  }

  // ✅ FORMAT TIME
  formatTime(seconds: number): string {
    if (!seconds) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onBarClick(event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;

    const percent = (clickX / width) * 100;

    this.playerService.seek(percent);
  }
}
