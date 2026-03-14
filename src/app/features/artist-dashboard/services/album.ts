import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private baseUrl = 'http://localhost:8080/revplay/catalog/albums';

  constructor(private http: HttpClient) {}

  createAlbum(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, formData);
  }

  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  deleteAlbum(albumId: number) {
    return this.http.delete(`${this.baseUrl}/${albumId}`);
  }

  updateAlbum(albumId: number, formData: FormData) {
    return this.http.post(`${this.baseUrl}/${albumId}`, formData);
  }

  addSongToAlbum(albumId: number, songId: number) {
    return this.http.post(`${this.baseUrl}/${albumId}/songs/${songId}`, {});
  }

  removeSongFromAlbum(albumId: number, songId: number) {
    return this.http.delete(`${this.baseUrl}/${albumId}/songs/${songId}`);
  }
}
