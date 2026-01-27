import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { setUserProfile } from "../features/harmeetsYoutubeSlice";

// can be deleted , because OAuthSuccess is doing its work
function GetProfileDetails() {
  const backend_url = useSelector(
    (state) => state.harmeetsYoutube.YT_BACKEND_URL
  );
  const dispatch = useDispatch();
  
  const  isUserAuthenticated= useSelector(
    (state) => state.harmeetsYoutube.isUserAuthenticated
  );
const user = useSelector( (state ) => state.harmeetsYoutube.user  );

    function fetchUserProfileAndUpdateInStore(){
        // fetch user detail 
        
        axiosInstance.get(`${backend_url}/api/getUserProfile`) 

        setUserProfile();
    }
  useEffect(() => {
    if (isUserAuthenticated && user.isProfileDataAvailable === false) {
      fetchUserProfileAndUpdateInStore();

    }
  }, [isUserAuthenticated, user, dispatch]);

  return null; // no UI, logic-only component
}

export default GetProfileDetails;
