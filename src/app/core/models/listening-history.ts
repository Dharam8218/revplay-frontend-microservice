export interface ListeningHistoryResponse {
  songId: number;
  title: string;
  artistName: string;
  coverImageUrl: string;
  playedAt: string; // LocalDateTime comes as string
}
