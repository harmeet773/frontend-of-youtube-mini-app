import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export default function HarmeetsYoutube() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let BACKEND_URL = useSelector((state)=>   state.harmeetsYoutube.YT_BACKEND_URL);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/youtube/channel-videos`); 
        console.log("here i am ",  `${BACKEND_URL}/youtube/channel-videos`)
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        if (data.success) {
          setVideos(data.videos);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="container py-5"><p>Loading videos...</p></div>;
  }

  if (error) {
    return <div className="container py-5"><p>Error: {error}</p></div>;
  }

  return (   
    <div className="container py-5">      
      <h1 className="mb-4">My YouTube Videos</h1>
      <div className="row">
        {videos.map((video) => (
          <div key={video.videoId} className="col-md-4 mb-4">
            <Link to={`/video/${video.videoId}`} style={{ textDecoration: 'none' }}>      
              <div className="card">
                <img
                  src={video.thumbnail}
                  className="card-img-top"
                  alt={video.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{video.title}</h5>
                  <p className="card-text">
                    <strong>Views:</strong> {video.views} | <strong>Likes:</strong> {video.likes} | <strong>Comments:</strong> {video.comments}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Published: {new Date(video.publishedAt).toLocaleDateString()}</small>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
