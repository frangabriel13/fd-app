import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchVideoFeed } from '@/services/videoFeedService';
import type { VideoFeedItem, VideoFeedResponse } from '@/types/videoFeed';

// Tamaños de página: 5 para el carrusel del Home, 10 para el feed Reels, 18 para la grilla.
const CAROUSEL_PAGE_SIZE = 5;
const FEED_PAGE_SIZE = 10;
const GRID_PAGE_SIZE = 18;

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

  // Grilla "Videos Destacados" paginada (independiente del feed fullscreen para
  // que reels.resetFeed() no la pise y se mantenga el scroll al volver).
  gridVideos: VideoFeedItem[];
  gridSeed: string | null;
  gridCurrentPage: number;
  gridPageSize: number;
  gridTotalVideos: number;
  gridHasMore: boolean;
  gridLoading: boolean;
  gridLoadingMore: boolean;
  gridError: string | null;
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

  gridVideos: [],
  gridSeed: null,
  gridCurrentPage: 0,
  gridPageSize: GRID_PAGE_SIZE,
  gridTotalVideos: 0,
  gridHasMore: true,
  gridLoading: false,
  gridLoadingMore: false,
  gridError: null,
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

export const fetchGridFirstPage = createAsyncThunk(
  'videoFeed/fetchGridFirstPage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchVideoFeed({ page: 1, pageSize: GRID_PAGE_SIZE });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error al cargar la grilla de videos'
      );
    }
  }
);

export const fetchGridNextPage = createAsyncThunk(
  'videoFeed/fetchGridNextPage',
  async (_, { getState, rejectWithValue }) => {
    const { gridSeed, gridCurrentPage, gridPageSize, gridHasMore } = (
      getState() as { videoFeed: VideoFeedState }
    ).videoFeed;
    if (!gridHasMore || !gridSeed) {
      return rejectWithValue('No hay más videos disponibles');
    }
    try {
      const response = await fetchVideoFeed({
        page: gridCurrentPage + 1,
        pageSize: gridPageSize,
        seed: gridSeed,
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
    resetGrid: (state) => {
      state.gridVideos = [];
      state.gridSeed = null;
      state.gridCurrentPage = 0;
      state.gridTotalVideos = 0;
      state.gridHasMore = true;
      state.gridLoading = false;
      state.gridLoadingMore = false;
      state.gridError = null;
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
      })

      // fetchGridFirstPage
      .addCase(fetchGridFirstPage.pending, (state) => {
        state.gridLoading = true;
        state.gridError = null;
      })
      .addCase(
        fetchGridFirstPage.fulfilled,
        (state, action: PayloadAction<VideoFeedResponse>) => {
          const { videos, currentPage, pageSize, totalVideos, seed } = action.payload;
          state.gridLoading = false;
          state.gridVideos = videos;
          state.gridSeed = seed;
          state.gridCurrentPage = currentPage;
          state.gridPageSize = pageSize;
          state.gridTotalVideos = totalVideos;
          state.gridHasMore = computeHasMore(videos.length, totalVideos);
        }
      )
      .addCase(fetchGridFirstPage.rejected, (state, action) => {
        state.gridLoading = false;
        state.gridError = (action.payload as string) ?? action.error.message ?? null;
      })

      // fetchGridNextPage
      .addCase(fetchGridNextPage.pending, (state) => {
        state.gridLoadingMore = true;
        state.gridError = null;
      })
      .addCase(
        fetchGridNextPage.fulfilled,
        (state, action: PayloadAction<VideoFeedResponse>) => {
          const { videos, currentPage, totalVideos } = action.payload;
          state.gridLoadingMore = false;
          state.gridCurrentPage = currentPage;
          state.gridTotalVideos = totalVideos;

          // Dedupe defensivo por si el backend devuelve algún id ya visto.
          const existingIds = new Set(state.gridVideos.map((v) => v.id));
          const newOnes = videos.filter((v) => !existingIds.has(v.id));
          state.gridVideos = state.gridVideos.concat(newOnes);

          state.gridHasMore = computeHasMore(state.gridVideos.length, totalVideos);
        }
      )
      .addCase(fetchGridNextPage.rejected, (state, action) => {
        state.gridLoadingMore = false;
        state.gridError = (action.payload as string) ?? action.error.message ?? null;
      });
  },
});

export const { resetFeed, resetGrid, clearCarouselError } = videoFeedSlice.actions;

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

export const selectGridVideos = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.gridVideos;
export const selectGridLoading = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.gridLoading;
export const selectGridLoadingMore = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.gridLoadingMore;
export const selectGridHasMore = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.gridHasMore;
export const selectGridError = (state: { videoFeed: VideoFeedState }) =>
  state.videoFeed.gridError;

export default videoFeedSlice.reducer;
