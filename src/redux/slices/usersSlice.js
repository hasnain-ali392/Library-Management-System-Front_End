import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
// Admin Thunks
export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  // const { users } = useSelector((state) => state.users)
  try {
    const response = await api.get('/auth/users');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch directory registry');
  }
});

export const toggleUserSuspension = createAsyncThunk('users/toggleSuspension', async ({ userId, isSuspended }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/auth/users/${userId}/suspension`, { suspended: isSuspended });
    return response.data.data; // Returns updated user object
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to mutate account restriction state');
  }
});

// Self-Service User Thunks
export const updateSelfProfile = createAsyncThunk('users/updateSelf', async (profileData, { rejectWithValue }) => {
  try {
    const response = await api.put('/user/profile/update', profileData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update personal registry profile');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Suspension Mutation
      .addCase(toggleUserSuspension.pending, (state) => { state.actionLoading = true; })
      .addCase(toggleUserSuspension.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.list.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(toggleUserSuspension.rejected, (state) => { state.actionLoading = false; });
  },
});

export default usersSlice.reducer;