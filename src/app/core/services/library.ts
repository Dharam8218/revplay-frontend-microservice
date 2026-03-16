import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song} from '../models/song.model';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private baseUrl = 'http://localhost:8080/revplay/catalog/songs';

  constructor(private http: HttpClient) {}

  // Browse by genre
  browseByGenre(genre: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/genre/${genre}`);
  }

  // Browse by artist
  browseByArtist(artistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/artist/${artistId}`);
  }

  // Browse by album
  browseByAlbum(albumId: number): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/albums/${albumId}`);
  }

  // Filter combined
  filter(params: {
    genre?: string;
    artistId?: number;
    year?: number;
  }): Observable<Song[]> {

    let httpParams = new HttpParams();

    if (params.genre) httpParams = httpParams.set('genre', params.genre);
    if (params.artistId) httpParams = httpParams.set('artistId', params.artistId);
    if (params.year) httpParams = httpParams.set('year', params.year);

    return this.http.get<Song[]>(`${this.baseUrl}/filter`, {
      params: httpParams
    });
  }
}