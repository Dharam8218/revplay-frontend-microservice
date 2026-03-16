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
  private baseUrl = 'http://localhost:8080/revplay/analytics';

  constructor(private http: HttpClient) {}

  getTrends(type: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Observable<TrendResponse[]> {
    const map: Record<'DAILY' | 'WEEKLY' | 'MONTHLY', string> = {
      DAILY: 'daily',
      WEEKLY: 'weekly',
      MONTHLY: 'monthly',
    };

    return this.http.get<TrendResponse[]>(`${this.baseUrl}/artist/trends/${map[type]}`);
  }

  getSongPlayCount(songId: number) {
    return this.http.get<number>(`${this.baseUrl}/songs/${songId}/play-count`);
  }

  getTopListeners(page: number = 0, size: number = 5) {
    return this.http.get<TopListenerPage>(
      `http://localhost:8080/revplay/analytics/artist/top-listeners?page=${page}&size=${size}`,
    );
  }

  getFavoritedUsers(songId: number) {
    return this.http.get<FavoritedUser[]>(
      `http://localhost:8080/revplay/analytics/artist/songs/${songId}/favorited-users`,
    );
  }
}
