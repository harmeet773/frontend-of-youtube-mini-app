import { createSlice } from '@reduxjs/toolkit';

const harmeetsYoutubeSlice = createSlice({
  name: 'harmeetsYoutube',
  initialState: {
    videos: [],
    user:[],
    isUserAuthenticated: false,
    currentVideo: null,
    YT_BACKEND_URL:"",
    token: null
  },
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    setBackendUrl: (state, action) => {
      state.YT_BACKEND_URL = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isUserAuthenticated = true;
    },
  },
});

export const { setVideos, setCurrentVideo, setBackendUrl, setToken } = harmeetsYoutubeSlice.actions;
export default harmeetsYoutubeSlice.reducer;
