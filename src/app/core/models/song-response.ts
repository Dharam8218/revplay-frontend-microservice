export interface SongResponse {
  id: number;
  title: string;
  genre: string;
  duration: number;
  audioUrl: string;
  coverArtUrl: string;

  artistId: number;
  artistName: string;

  albumId: number | null;
  albumName: string | null;

  visibility: string;
}
