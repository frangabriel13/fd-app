import { videoInstance } from './axiosConfig';
import type { VideoFeedParams, VideoFeedResponse } from '@/types/videoFeed';

// GET /api/videos/feed — devuelve un lote paginado del feed de videos curado.
// videoInstance ya inyecta el Bearer token y maneja refresh en 401.
export const fetchVideoFeed = async (
  params: VideoFeedParams = {}
): Promise<VideoFeedResponse> => {
  const response = await videoInstance.get<VideoFeedResponse>('/feed', { params });
  return response.data;
};
