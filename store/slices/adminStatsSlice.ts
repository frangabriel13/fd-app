import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { manufacturerInstance } from '../../services/axiosConfig';

// Tipos
export type StatsPeriod = 'week' | 'month' | 'year';

interface RankingItem {
  manufacturerId: number;
  name: string;
  image: string | null;
  views: number;
}

interface ManufacturerStats {
  manufacturerId: number;
  period: StatsPeriod;
  views: number;
}

interface AdminStatsState {
  ranking: RankingItem[];
  loadingRanking: boolean;
  errorRanking: string | null;

  selectedManufacturerId: number | null;
  selectedPeriod: StatsPeriod;
  stats: ManufacturerStats | null;
  loadingStats: boolean;
  errorStats: string | null;
}

const initialState: AdminStatsState = {
  ranking: [],
  loadingRanking: false,
  errorRanking: null,

  selectedManufacturerId: null,
  selectedPeriod: 'month',
  stats: null,
  loadingStats: false,
  errorStats: null,
};

// Thunks
export const fetchManufacturersRanking = createAsyncThunk(
  'adminStats/fetchManufacturersRanking',
  async (_, { rejectWithValue }) => {
    try {
      const response = await manufacturerInstance.get('/stats/ranking');
      return response.data as RankingItem[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el ranking');
    }
  }
);

export const fetchManufacturerStats = createAsyncThunk(
  'adminStats/fetchManufacturerStats',
  async (
    { manufacturerId, period }: { manufacturerId: number; period: StatsPeriod },
    { rejectWithValue }
  ) => {
    try {
      const response = await manufacturerInstance.get(`/${manufacturerId}/stats`, {
        params: { period },
      });
      return response.data as ManufacturerStats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }
);

// Slice
const adminStatsSlice = createSlice({
  name: 'adminStats',
  initialState,
  reducers: {
    setSelectedManufacturer(state, action: PayloadAction<number>) {
      state.selectedManufacturerId = action.payload;
      state.stats = null;
      state.errorStats = null;
    },
    setSelectedPeriod(state, action: PayloadAction<StatsPeriod>) {
      state.selectedPeriod = action.payload;
    },
    clearAdminStats(state) {
      state.selectedManufacturerId = null;
      state.stats = null;
      state.errorStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Ranking
      .addCase(fetchManufacturersRanking.pending, (state) => {
        state.loadingRanking = true;
        state.errorRanking = null;
      })
      .addCase(fetchManufacturersRanking.fulfilled, (state, action: PayloadAction<RankingItem[]>) => {
        state.loadingRanking = false;
        state.ranking = action.payload;
      })
      .addCase(fetchManufacturersRanking.rejected, (state, action) => {
        state.loadingRanking = false;
        state.errorRanking = action.payload as string || 'Error al obtener el ranking';
      })
      // Stats por período
      .addCase(fetchManufacturerStats.pending, (state) => {
        state.loadingStats = true;
        state.errorStats = null;
      })
      .addCase(fetchManufacturerStats.fulfilled, (state, action: PayloadAction<ManufacturerStats>) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchManufacturerStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.errorStats = action.payload as string || 'Error al obtener estadísticas';
      });
  },
});

export const { setSelectedManufacturer, setSelectedPeriod, clearAdminStats } = adminStatsSlice.actions;
export default adminStatsSlice.reducer;
