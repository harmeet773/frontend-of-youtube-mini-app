import { useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../features/harmeetsYoutubeSlice';
import axiosInstance from '../api/axiosInstance';
// this component is called at path /oauth-success
export default function OAuthSuccess() {
  const backend_url = useSelector(
    (state) => state.harmeetsYoutube.YT_BACKEND_URL
  );
  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const isProfileDataAvailable = useSelector((state) => state.harmeetsYoutube.user.isProfileDataAvailable);
  useEffect(() => {
    // Extract token from URL query parametersres.toke
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (token) {
      // Save token to Redux store   
      dispatch(setToken(token));   
      if (isProfileDataAvailable){
        // If profile data is available   
      }else{
        // If profile data is not available, fetch it first and then save to Redux store
        axiosInstance.get(`${backend_url}/api/getUserProfile`)
          .then((response) => {
            const userProfile = response.data;
            console.log("token is" , token);
            console.log("url is " ,  `${backend_url}/api/getUserProfile` )       ;
            console.log("neeed to work here with out data" , response, JSON.stringify(response));
            console.log("neeed to work here ",response.data );
            dispatch({ type: 'harmeetsYoutube/setUserProfile', payload: userProfile });
          })
          .catch((error) => {
            console.error('Error fetching user profile:', error);
          });
      }

      // Redirect to home page
      navigate('/');
    } else {
      // If no token found, redirect to homepage
      navigate('/');
    }
  }, [dispatch, navigate]);

  // Show a loading message while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Authenticating... Please wait.</p>
    </div>
  );
}

