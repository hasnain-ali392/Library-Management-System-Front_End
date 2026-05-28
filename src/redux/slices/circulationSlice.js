import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

export const fetchCirculationRecords = createAsyncThunk('circulation/fetchAll', async (role, { rejectWithValue }) => {
  try {
    // If user role, fetches personal history; if admin, fetches global library ledger
    const endpoint = role === 'admin' ? '/circulation/admin/all' : '/circulation/user/history';
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch circulation matrices');
  }
});

export const processBookReturn = createAsyncThunk('circulation/return', async ({ recordId, calculatedFine }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/circulation/return/${recordId}`, { fine: calculatedFine });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to log return event');
  }
});

export const collectFinePayment = createAsyncThunk('circulation/payFine', async (recordId, { rejectWithValue }) => {
  try {
    const response = await api.put(`/circulation/pay-fine/${recordId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear fine allocation');
  }
});

const circulationSlice = createSlice({
  name: 'circulation',
  initialState: {
    records: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCirculationRecords.pending, (state) => { state.loading = true; })
      .addCase(fetchCirculationRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchCirculationRecords.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(processBookReturn.pending, (state) => { state.actionLoading = true; })
      .addCase(processBookReturn.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.records.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.records[idx] = action.payload;
      })
      
      .addCase(collectFinePayment.fulfilled, (state, action) => {
        const idx = state.records.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.records[idx] = action.payload;
      });
  },
});

export default circulationSlice.reducer;