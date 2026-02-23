import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player-bar.html',
})
export class PlayerBarComponent {
  currentSong: any;
  isPlaying = false;
  volume = 1;

  constructor(private playerService: PlayerService) {
    this.playerService.currentSong$.subscribe((song) => {
      this.currentSong = song;
    });

    this.playerService.isPlaying$.subscribe((state) => {
      this.isPlaying = state;
    });

    this.playerService.volume$.subscribe((v) => {
      this.volume = v;
    });
  }

  toggle() {
    if (this.isPlaying) {
      this.playerService.pause();
    } else {
      this.playerService.resume();
    }
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
    if (this.volume === 0) {
      this.playerService.unmute();
    } else {
      this.playerService.mute();
    }
  }
}
