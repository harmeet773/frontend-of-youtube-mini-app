import { createSlice } from '@reduxjs/toolkit';

const harmeetsYoutubeSlice = createSlice({
  name: 'harmeetsYoutube',
  initialState: {
    videos: [],            
    user:[],
    isUserAuthenticated: false,
    currentVideo: null,
    YT_BACKEND_URL:""   
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
  },
});

export const { setVideos, setCurrentVideo, setBackendUrl } = harmeetsYoutubeSlice.actions;
export default harmeetsYoutubeSlice.reducer;
