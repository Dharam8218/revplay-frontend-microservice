import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private baseUrl = 'http://localhost:8080/revplay/library';

  constructor(private http: HttpClient) {}

  // Browse
  browseByGenre(genre: string) {
    return this.http.get<any>(`${this.baseUrl}/genre/${genre}`);
  }

  browseByArtist(artistId: number) {
    return this.http.get<PageResponse<any>>(`${this.baseUrl}/artist/${artistId}`);
  }

  browseByAlbum(albumId: number) {
    return this.http.get<any>(`${this.baseUrl}/albums/${albumId}`);
  }

  // Filters
  filter(params: { genre?: string; artistId?: number; year?: number }) {
    return this.http.get<any[]>(`${this.baseUrl}/filter`, { params });
  }

  // Get all artists
  getAllArtists() {
    return this.http.get<any[]>(`http://localhost:8080/revplay/artist/get-all`);
  }

  // Get all albums
  getAllAlbums() {
    return this.http.get<any[]>(`http://localhost:8080/revplay/albums/get-all-albums`);
  }
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}