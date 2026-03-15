import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
import { ListeningHistoryResponse } from '../models/listening-history';
import { PagedResult, SearchResponse, SongResponse } from '../models/serach';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  constructor(private http: HttpClient) {}

  private cachedSongs: any[] = [];
  private cachedPage = -1;

  baseUrl = 'http://localhost:8080/revplay';

  getSongs(page: number, size: number, sortBy: string, direction: string) {
    if (this.cachedSongs.length > 0 && this.cachedPage === page) {
      return of({
        content: this.cachedSongs,
        totalPages: 1,
        totalElements: this.cachedSongs.length,
      });
    }

    return this.http
      .get<any>(
        `${this.baseUrl}/catalog/get-all-songs?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      )
      .pipe(
        timeout(10000),
        tap((res) => {
          this.cachedSongs = res.content;
          this.cachedPage = page;
        }),
      );
  }

  playSong(songId: number) {
    return this.http.post(`${this.baseUrl}/playback/play/${songId}`, {});
  }

  pauseSong() {
    return this.http.post(`${this.baseUrl}/playback/pause`, {});
  }

  markFavorite(songId: number) {
    return this.http.post(`${this.baseUrl}/favorites`, { songId });
  }

  removeFavorite(songId: number) {
    return this.http.delete(`${this.baseUrl}/favorites/${songId}`);
  }

  getFavorites() {
    return this.http.get<any[]>(`${this.baseUrl}/favorites`);
  }

  getPlaylists(page: number, size: number) {
    return this.http.get<any>(
      `${this.baseUrl}/playlists?page=${page}&size=${size}&sortBy=id&direction=asc`,
    );
  }

  createPlaylist(payload: any) {
    return this.http.post(`${this.baseUrl}/playlists`, payload);
  }

  deletePlaylist(id: number) {
    return this.http.delete(`${this.baseUrl}/playlists/${id}`);
  }

  addSongToPlaylist(playlistId: number, songId: number) {
    return this.http.post(`${this.baseUrl}/playlists/${playlistId}/songs`, {
      songId: songId,
    });
  }

  removeSongFromPlaylist(playlistId: number, songId: number) {
    return this.http.delete(`${this.baseUrl}/playlists/${playlistId}/songs/${songId}`);
  }

  getPlaylistById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/playlists/${id}/songs`);
  }

  updatePlaylistPrivacy(id: number, visibility: string) {
    return this.http.patch(`${this.baseUrl}/playlists/${id}/visibility`, {
      visibility: visibility,
    });
  }

  updatePlaylist(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/playlists/${id}`, data);
  }

  getPublicPlaylists(page = 0, size = 20) {
    return this.http.get(
      `${this.baseUrl}/playlists/public/paged?page=${page}&size=${size}&sortBy=createdAt&direction=desc`,
    );
  }

  followPlaylist(id: number) {
    return this.http.post(`${this.baseUrl}/playlists/${id}/follow`, {});
  }

  unfollowPlaylist(id: number) {
    return this.http.delete(`${this.baseUrl}/playlists/${id}/unfollow`);
  }

  getRecentlyPlayed() {
    return this.http.get<ListeningHistoryResponse[]>(`${this.baseUrl}/playback/recent`);
  }

  getListeningHistory(page = 0, size = 20) {
    return this.http.get<{
      content: ListeningHistoryResponse[];
      totalPages: number;
    }>(`${this.baseUrl}/playback/history`);
  }

  clearHistory() {
    return this.http.delete(`${this.baseUrl}/playback/clear`);
  }

  search(query: string, page = 0, size = 10) {
    return this.http.get<SearchResponse>(`${this.baseUrl}/catalog/songs/search`, {
      params: {
        q: query,
        page: page,
        size: size,
      },
    });
  }

  getSongsByGenre(genre: string, page = 0, size = 10) {
    return this.http.get<PagedResult<SongResponse>>(`${this.baseUrl}/catalog/songs/genre/${genre}`, {
      params: { page, size },
    });
  }

  getAllArtists() {
    return this.http.get<any[]>(`${this.baseUrl}/auth/artist/get-all`);
  }

  getUserStatistics() {
    return this.http.get<{
      totalPlaylists: number;
      favoriteSongs: number;
      totalPlayCount: number;
    }>(`${this.baseUrl}/analytics/user/stats`);
  }
}
