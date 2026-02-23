import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrendResponse {
  period: string;
  playCount: number;
}
export interface TopListener {
  userId: number;
  username: string;
  displayName: string;
  playCount: number;
}

export interface TopListenerPage {
  content: TopListener[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface FavoritedUser {
  userId: number;
  username: string;
  displayName: string;
  profilePicture: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private baseUrl = 'http://localhost:8080/revplay/artist/analytics';

  constructor(private http: HttpClient) {}

  getTrends(type: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Observable<TrendResponse[]> {
    return this.http.get<TrendResponse[]>(`${this.baseUrl}/trends?type=${type}`);
  }

  getSongPlayCount(songId: number) {
    return this.http.get<number>(`${this.baseUrl}/songs/${songId}/play-count`);
  }

  getTopListeners(page: number = 0, size: number = 5) {
    return this.http.get<TopListenerPage>(
      `http://localhost:8080/revplay/artist/top-listeners?page=${page}&size=${size}`,
    );
  }

  getFavoritedUsers(songId: number) {
    return this.http.get<FavoritedUser[]>(
      `http://localhost:8080/revplay/artist/songs/${songId}/favorited-users`,
    );
  }
}
