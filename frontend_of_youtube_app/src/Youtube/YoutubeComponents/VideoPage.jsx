import { useParams } from "react-router-dom";
import VideoComponent from "./VideoPageComponents/VideoComponent"
import CommentComponent from "./VideoPageComponents/CommentComponent"
import AddCommentForm  from "./VideoPageComponents/AddCommentForm"
import { useSelector } from "react-redux";

export default function VideoPage(props) {
const { videoId } = useParams();
const UserProfilePhoto = useSelector(  (state) => state.harmeetsYoutube.user.picture   );


  return (
    <>   
      <VideoComponent videoId={videoId} />
      <AddCommentForm UserProfilePhoto= {UserProfilePhoto  }    />
      <CommentComponent videoId={videoId} />
    </>
  );
}
  