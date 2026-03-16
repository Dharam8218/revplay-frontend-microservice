import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtistDashboardService {
  private baseUrl = 'http://localhost:8080/revplay';

  constructor(private http: HttpClient) {}

  getDashboardOverview(): Observable<{
    totalSongs: number;
    totalPlays: number;
    totalListeners: number;
    totalAlbums: number;
  }> {
    return this.http.get<{
      totalSongs: number;
      totalPlays: number;
      totalListeners: number;
      totalAlbums: number;
    }>(`${this.baseUrl}/analytics/artist/summary`);
  }
}
