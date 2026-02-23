export interface Song {
  id: number;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  visibility: string;
  audioUrl: string;
  coverImageUrl?: string;
}