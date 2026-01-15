import { useParams } from "react-router-dom";
import VideoComponent from "./VideoPageComponents/VideoComponent"
import CommentComponent from "./VideoPageComponents/CommentComponent"
import AddCommentForm  from "./VideoPageComponents/AddCommentForm"
import { useSelector } from "react-redux";

export default function VideoPage(props) {
const { videoId } = useParams();


  return (
    <>   
      <VideoComponent videoId={videoId} />
      <AddCommentForm />
      <CommentComponent videoId={videoId} />
    </>
  );
}
  