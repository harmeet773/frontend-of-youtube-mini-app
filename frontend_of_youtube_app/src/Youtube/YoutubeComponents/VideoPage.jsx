import { useParams } from "react-router-dom";
import VideoComponent from "./VideoPageComponents/VideoComponent";
import CommentComponent from "./VideoPageComponents/CommentComponent";

export default function VideoPage(props) {
  const { videoId } = useParams();

  return (
    <>   
      <VideoComponent videoId={videoId} />
      <CommentComponent videoId={videoId} />
    </>
  );
}
  
