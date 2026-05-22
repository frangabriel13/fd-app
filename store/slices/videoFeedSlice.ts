import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchVideoFeed } from '@/services/videoFeedService';
import type { VideoFeedItem, VideoFeedResponse } from '@/types/videoFeed';

// Tamaños de página: 5 para el carrusel del Home, 10 para el feed Reels.
const CAROUSEL_PAGE_SIZE = 5;
const FEED_PAGE_SIZE = 10;

interface VideoFeedState {
  // Carrusel del Home (5 videos, sin paginación ni seed).
  carouselVideos: VideoFeedItem[];
  carouselLoading: boolean;
  carouselError: string | null;

  // Feed Reels fullscreen paginado.
  feedVideos: VideoFeedItem[];
  feedSeed: string | null;
  feedCurrentPage: number;
  feedPageSize: number;
  feedTotalVideos: number;
  feedHasMore: boolean;
  feedLoading: boolean;
  feedLoadingMore: boolean;
  feedError: string | null;
}

const initialState: VideoFeedState = {
  carouselVideos: [],
  carouselLoading: false,
  carouselError: null,

  feedVideos: [],
  feedSeed: null,
  feedCurrentPage: 0,
  feedPageSize: FEED_PAGE_SIZE,
  feedTotalVideos: 0,
  feedHasMore: true,
  feedLoading: false,
  feedLoadingMore: false,
  feedError: null,
};

export const fetchCarouselVideos = createAsyncThunk(
  'videoFeed/fetchCarouselVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchVideoFeed({ page: 1, pageSize: CAROUSEL_PAGE_SIZE });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error al cargar el carrusel de videos'
      );
    }
  }
);

interface FetchFeedFirstPageArg {
  startWith?: number;
}

export const fetchFeedFirstPage = createAsyncThunk(
  'videoFeed/fetchFeedFirstPage',
  async ({ startWith }: FetchFeedFirstPageArg, { rejectWithValue }) => {
    try {
      const response = await fetchVideoFeed({
        page: 1,
        pageSize: FEED_PAGE_SIZE,
        startWith,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error al cargar el feed'
      );
    }
  }
);

export const fetchFeedNextPage = createAsyncThunk(
  'videoFeed/fetchFeedNextPage',
  async (_, { getState, rejectWithValue }) => {
    const { feedSeed, feedCurrentPage, feedPageSize, feedHasMore } = (
      getState() as { videoFeed: VideoFeedState }
    ).videoFeed;
    if (!feedHasMore || !feedSeed) {
      return rejectWithValue('No hay más videos disponibles');
    }
    try {
      const response = await fetchVideoFeed({
        page: feedCurrentPage + 1,
        pageSize: feedPageSize,
        seed: feedSeed,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error al cargar la próxima página'
      );
    }
  }
);

// Recalcula hasMore comparando los items acumulados contra el total reportado por el backend.
const computeHasMore = (accumulated: number, total: number) => accumulated < total;

const videoFeedSlice = createSlice({
  name: 'videoFeed',
  initialState,
  reducers: {
    resetFeed: (state) => {
      state.feedVideos = [];
      state.feedSeed = null;
      state.feedCurrentPage = 0;
      state.feedTotalVideos = 0;
      state.feedHasMore = true;
      state.feedLoading = false;
      state.feedLoadingMore = false;
      state.feedError = null;
    },
    clearCarouselError: (state) => {
      state.carouselError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCarouselVideos
      .addCase(fetchCarouselVideos.pending, (state) => {
        state.carouselLoading = true;
        state.carouselError = null;
      })
      .addCase(
        fetchCarouselVideos.fulfilled,
        (state, action: PayloadAction<VideoFeedResponse>) => {
          state.carouselLoading = false;
          state.carouselVideos = action.payload.videos;
        }
      )
      .addCase(fetchCarouselVideos.rejected, (state, action) => {
        state.carouselLoading = false;
        state.carouselError = (action.payload as string) ?? action.error.message ?? null;
      })

      // fetchFeedFirstPage
      .addCase(fetchFeedFirstPage.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(
        fetchFeedFirstPage.fulfilled,
        (state, action: PayloadAction<VideoFeedResponse>) => {
          const { videos, currentPage, pageSize, totalVideos, seed } = action.payload;
          state.feedLoading = false;
          state.feedVideos = videos;
          state.feedSeed = seed;
          state.feedCurrentPage = currentPage;
          state.feedPageSize = pageSize;
          state.feedTotalVideos = totalVideos;
          state.feedHasMore = computeHasMore(videos.length, totalVideos);
        }
      )
      .addCase(fetchFeedFirstPage.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = (action.payload as string) ?? action.error.message ?? null;
      })

      // fetchFeedNextPage
      .addCase(fetchFeedNextPage.pending, (state) => {
        state.feedLoadingMore = true;
        state.feedError = null;
      })
      .addCase(
        fetchFeedNextPage.fulfilled,
        (state, action: PayloadAction<VideoFeedResponse>) => {
          const { videos, currentPage, totalVideos } = action.payload;
          state.feedLoadingMore = false;
          state.feedCurrentPage = currentPage;
          state.feedTotalVideos = totalVideos;

          // Dedupe defensivo: descarta IDs ya presentes (puede pasar con startWith en edge cases).
          const existingIds = new Set(state.feedVideos.map((v) => v.id));
          const newOnes = videos.filter((v) => !existingIds.has(v.id));
          state.feedVideos = state.feedVideos.concat(newOnes);

          state.feedHasMore = computeHasMore(state.feedVideos.length, totalVideos);
        }
      )
      .addCase(fetchFeedNextPage.rejected, (state, action) => {
        state.feedLoadingMore = false;
        state.feedError = (action.payload as string) ?? action.error.message ?? null;
      });
  },
});

export const { resetFeed, clearCarouselError } = videoFeedSlice.actions;

// Selectores
export const selectCarouselVideos = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.carouselVideos;
export const selectCarouselLoading = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.carouselLoading;
export const selectCarouselError = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.carouselError;

export const selectFeedVideos = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.feedVideos;
export const selectFeedLoading = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.feedLoading;
export const selectFeedLoadingMore = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.feedLoadingMore;
export const selectFeedHasMore = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.feedHasMore;
export const selectFeedError = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.feedError;

export default videoFeedSlice.reducer;
