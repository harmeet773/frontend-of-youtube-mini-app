import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch , useSelector} from 'react-redux';

import { setBackendUrl } from "./features/harmeetsYoutubeSlice";
const CheckBackendConnectivity = ({setBackendStatus}) => {
  const BACKEND_URL_1 = import.meta.env.VITE_BACKEND_URL_1;
  const BACKEND_URL_2 = import.meta.env.VITE_BACKEND_URL_2;
  const dispatch = useDispatch();
  const [status, setStatus] = useState("checking");
 
  const YT_BACKEND_URL = useSelector((state) => state.harmeetsYoutube.YT_BACKEND_URL);
  console.log(YT_BACKEND_URL , "is backend url"); 

  const checkBackend = async () => {
    try {
      const res1 = await axios.get(`${BACKEND_URL_1}/api/serverStatus`, {
        timeout: 3000,
      });
      if (res1.data?.status === "ok" || res1.data?.message === "Server is running") {
        setBackendStatus(true);
        setStatus("live");
        dispatch({type:"harmeetsYoutube/setBackendUrl"  , payload : import.meta.env.VITE_BACKEND_URL_1 });
        return;
      }
    } catch (e) {console.log("error is", e);}


    try {
      const res2 = await axios.get(`${BACKEND_URL_2}/api/serverStatus`, {
        timeout: 3000,
      });

      if (res2.data?.status === "ok" || res2.data?.message === "Server is running") {
        setBackendStatus(true);
        setStatus("live");
        dispatch(setBackendUrl(import.meta.env.VITE_BACKEND_URL_2));
        return;
      }
    } catch (e) {console.log("error is", e);}
    setStatus("down");
  };

  useEffect(() => {
    checkBackend();    
    console.log("useEffect ran");
  }, []);

  // 🚫 Do not render anything if backend is live
  if (status === "live") { return null;}

  const statusStyles = {
    down: { color: "red" },
    checking: { color: "orange" },
  
  };

  return (
    <div>
      <h4>
        Backend Status:{" "}
        <span style={statusStyles[status]}>
          {status.toUpperCase()}
        </span>
      </h4>
    </div>
  );
};

export default CheckBackendConnectivity;
