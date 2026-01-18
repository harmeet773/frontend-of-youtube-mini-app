import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function GoogleLogin() {
  const backend_url = useSelector(
    (state) => state.harmeetsYoutube.YT_BACKEND_URL
  );

  const location = useLocation();

  const login = () => {
    // Fallback: ensure redirect is set
    const existingRedirect =
      sessionStorage.getItem("redirectAfterAuth");

    if (!existingRedirect) {
      sessionStorage.setItem(
        "redirectAfterAuth",
        location.pathname + location.search
      );
    }

    window.location.href = `${backend_url}/auth/google`;
  };

  return <button onClick={login}>Sign in with Google</button>;
}
