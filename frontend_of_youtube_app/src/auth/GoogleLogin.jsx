import { useSelector } from "react-redux";

export default function GoogleLogin() {
    const backend_url = useSelector(     (state)   => state.harmeetsYoutube.YT_BACKEND_URL    );
  const login = () => {
    window.location.href = `${   backend_url      }/auth/google`;
  };

  return <button onClick={login}>Sign in with Google</button>;
}
