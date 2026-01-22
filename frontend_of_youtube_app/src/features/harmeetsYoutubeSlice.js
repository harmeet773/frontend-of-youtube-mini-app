import { createSlice } from '@reduxjs/toolkit';

const harmeetsYoutubeSlice = createSlice({
  name: 'harmeetsYoutube',
  initialState: {
    videos: [],
    user:{ isProfileDataAvailable: false},
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
    setUserProfile: (state, action) => {
    state.user = {
    ...action.payload,
    isProfileDataAvailable: true
  };
  },
  setLogout: (state) => {
  state.token = null;
  state.isUserAuthenticated = false;
  state.user = { isProfileDataAvailable: false };
}

  },
});

export const { setVideos, setCurrentVideo, setBackendUrl, setToken, setLogout,setUserProfile   } = harmeetsYoutubeSlice.actions;
export default harmeetsYoutubeSlice.reducer;
