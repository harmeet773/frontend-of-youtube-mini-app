import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../features/harmeetsYoutubeSlice';

export default function OAuthSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    if (token) {
      // Save token to Redux store
      dispatch(setToken(token));

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

