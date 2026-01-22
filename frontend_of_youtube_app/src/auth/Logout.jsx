import { useDispatch } from "react-redux";
import {  setLogout } from "../features/harmeetsYoutubeSlice";

export default function Logout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear token from Redux store
    dispatch(setLogout());
    // Optionally clear from localStorage/sessionStorage if you're storing it there too
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  return <button onClick={handleLogout}>Sign out</button>;
}
  