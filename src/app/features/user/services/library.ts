import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private baseUrl = 'http://localhost:8080/revplay';

  constructor(private http: HttpClient) {}

  // Browse
  browseByGenre(genre: string) {
    return this.http.get<any>(`${this.baseUrl}/genre/${genre}`);
  }

  browseByArtist(artistId: number) {
    return this.http.get<any>(`${this.baseUrl}/catalog/songs/artists/${artistId}`);
  }

  browseByAlbum(albumId: number) {
    return this.http.get<any>(`${this.baseUrl}/catalog/songs/albums/${albumId}`);
  }

  // Filters
  filter(params: { genre?: string; artistId?: number; year?: number }) {
    return this.http.get<any[]>(`${this.baseUrl}/filter`, { params });
  }

  // Get all artists
  getAllArtists() {
    return this.http.get<any[]>(`${this.baseUrl}/auth/artist/get-all`);
  }

  // Get all albums
  getAllAlbums() {
    return this.http.get<any[]>(`${this.baseUrl}/catalog/albums/get-all`);
  }
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}