import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { productInstance } from '@/services';

interface Image {
  id: number;
  url: string;
  userId: string;
  productId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface UploadedImage {
  id: number;
  url: string;
  userId: string;
}

interface ImageState {
  uploadedImages: UploadedImage[];
  isUploading: boolean;
  uploadError: string | null;
  uploadProgress: number;
}

const initialState: ImageState = {
  uploadedImages: [],
  isUploading: false,
  uploadError: null,
  uploadProgress: 0,
};

export const uploadImages = createAsyncThunk(
  'image/uploadImages',
  async (files: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Agregar todos los archivos al FormData
      files.forEach((file) => {
        formData.append('images', file);
      });

      console.log('Subiendo imágenes:', files.length, 'archivos');

      const response = await productInstance.post('/images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // El progress se manejará en un reducer separado si es necesario
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Progreso de subida: ${progress}%`);
          }
        },
      });

      return response.data as UploadedImage[];
    } catch (error: any) {
      console.error('Error al subir imágenes:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al subir las imágenes');
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
      state.uploadError = null;
    },
    resetUploadState: (state) => {
      state.uploadedImages = [];
      state.isUploading = false;
      state.uploadError = null;
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    removeUploadedImage: (state, action: PayloadAction<number>) => {
      state.uploadedImages = state.uploadedImages.filter(
        (image) => image.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.isUploading = true;
        state.uploadError = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadImages.fulfilled, (state, action: PayloadAction<UploadedImage[]>) => {
        state.uploadedImages = action.payload;
        state.isUploading = false;
        state.uploadError = null;
        state.uploadProgress = 100;
        console.log('Imágenes subidas exitosamente:', action.payload);
      })
      .addCase(uploadImages.rejected, (state, action: PayloadAction<any>) => {
        state.uploadError = action.payload;
        state.isUploading = false;
        state.uploadProgress = 0;
        state.uploadedImages = [];
      });
  },
});

export const {
  clearUploadedImages,
  resetUploadState,
  setUploadProgress,
  removeUploadedImage,
} = imageSlice.actions;

export default imageSlice.reducer;
