import { Component } from '@angular/core';
import { DashboardOverview } from '../../../artist-dashboard/components/dashboard-overview/dashboard-overview';
import { AlbumsManagement } from '../../../artist-dashboard/components/albums-management/albums-management';
import { AnalyticsComponent } from '../../../artist-dashboard/components/analytics/analytics';
import { Listeners } from '../../../artist-dashboard/components/listeners/listeners';
import { SongsManagement } from '../../../artist-dashboard/components/songs-management/songs-management';
import { CommonModule } from '@angular/common';
import { FavoritedUsers } from '../../../artist-dashboard/components/favorited-users/favorited-users';

@Component({
  selector: 'app-artist-dashboard',
  imports: [DashboardOverview,AlbumsManagement,AnalyticsComponent,Listeners,SongsManagement,FavoritedUsers,CommonModule],
  templateUrl: './artist-dashboard.html',
  styleUrl: './artist-dashboard.scss',
})
export class ArtistDashboardComponent {
  activeTab: 'overview' | 'songs' | 'albums' | 'analytics' | 'listeners' | 'favorites' = 'overview';

  setTab(tab: any) {
    this.activeTab = tab;
  }
}
