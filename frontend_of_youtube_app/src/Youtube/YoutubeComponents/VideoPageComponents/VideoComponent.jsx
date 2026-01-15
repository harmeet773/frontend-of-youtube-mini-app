import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function VideoComponent() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
   let BACKEND_URL = useSelector((state)=>   state.harmeetsYoutube.YT_BACKEND_URL  );
  console.log("video component ");   
  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/youtube/video/${videoId}`
        );http://localhost:5173/video/PBHw53cPkE0
        console.log(  "heeeeeee",   `${BACKEND_URL}/youtube/video/${videoId}`  );
        setVideo("sdf");
        console.log("video details are ",video);
      } catch (err) {
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (!video) return <p>No video found</p>;

  return (
    <div className="container py-4">
      <div className="row">
        {/* Video Player */}
        <div className="col-md-8">
          <div className="card mb-3">
            <iframe
              height="420"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.snippet.title}
              allowFullScreen
              className="w-100"
            />
          </div>

          {/* Video Details */}
          <h4>{video.snippet.title}</h4>

          <p className="text-muted mb-1">
            {Number(video.statistics.viewCount).toLocaleString()} views •{" "}
            {new Date(video.snippet.publishedAt).toDateString()}
          </p>

          <p className="mb-2">
            👍 {Number(video.statistics.likeCount).toLocaleString()} likes
          </p>

          <hr />

          <p className="fw-bold">{video.snippet.channelTitle}</p>
          <p style={{ whiteSpace: "pre-line" }}>
            {video.snippet.description}
          </p>
        </div>
      </div>
    </div>
  );
}
