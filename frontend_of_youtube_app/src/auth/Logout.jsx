import { useDispatch } from "react-redux";
import { setToken } from "../features/harmeetsYoutubeSlice";

export default function Logout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear token from Redux store
    dispatch(setToken(null));
    // Optionally clear from localStorage/sessionStorage if you're storing it there too
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return <button onClick={handleLogout}>Sign out</button>;
}
