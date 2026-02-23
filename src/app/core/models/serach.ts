export interface PagedResult<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

export interface SongResponse {
  id: number;
  title: string;
  artistName: string;
  coverImageUrl?: string;
}

export interface ArtistResponse {
  id: number;
  name: string;
}

export interface AlbumResponse {
  id: number;
  name: string;
}

export interface PlaylistResponse {
  id: number;
  name: string;
  isPublic: boolean;
}

export interface SearchResponse {
  query: string;
  songs: PagedResult<SongResponse>;
  artists: PagedResult<ArtistResponse>;
  albums: PagedResult<AlbumResponse>;
  playlists: PagedResult<PlaylistResponse>;
}
