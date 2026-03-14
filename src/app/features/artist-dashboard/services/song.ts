import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SongResponse } from '../../../core/models/song-response';

@Injectable({ providedIn: 'root' })
export class SongService {
  private baseUrl = 'http://localhost:8080/revplay/catalog/songs';

  constructor(private http: HttpClient) {}

  uploadSong(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  updateSong(songId: number, payload: any) {
    return this.http.put(`${this.baseUrl}/${songId}`, payload);
  }

  deleteSong(songId: number) {
    return this.http.delete(`${this.baseUrl}/${songId}`);
  }

  getArtistSongs() {
    return this.http.get<SongResponse[]>(`${this.baseUrl}`);
  }

  updateSongVisibility(songId: number, visibility: 'PUBLIC' | 'UNLISTED') {
    return this.http.patch<SongResponse>(`${this.baseUrl}/${songId}/visibility`, {
      visibility,
    });
  }
}
