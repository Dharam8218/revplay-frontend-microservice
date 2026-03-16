import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistDashboardService } from '../../services/artist-dashboard';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOverview implements OnInit {

  loading = false;

  totalSongs = 0;
  totalPlays = 0;
  totalListeners = 0;
  totalAlbums = 0;

  constructor(
    private artistDashboardService: ArtistDashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview() {
    this.loading = true;
    this.cdr.markForCheck();

    this.artistDashboardService.getDashboardOverview().subscribe({
      next: (res) => {
        this.totalSongs = res.totalSongs;
        this.totalPlays = res.totalPlays;
        this.totalListeners = res.totalListeners;
        this.totalAlbums = res.totalAlbums;
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}