import { configureStore } from '@reduxjs/toolkit';
import harmeetsYoutubeReducer from './features/harmeetsYoutubeSlice';
  
export const store = configureStore({
  reducer: {
    harmeetsYoutube: harmeetsYoutubeReducer,
  },
});
                                





