import { Song } from './song.model';

export interface Album {
  id: number;
  albumName: string;
  description?: string;
  releaseDate: string;
  coverArtUrl?: string;
  tracks: Song[];
}