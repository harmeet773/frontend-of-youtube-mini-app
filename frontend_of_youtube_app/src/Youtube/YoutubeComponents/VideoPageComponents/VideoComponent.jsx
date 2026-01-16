import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function VideoComponent() {
  const { videoId } = useParams();
  const BACKEND_URL = useSelector(
    (state) => state.harmeetsYoutube.YT_BACKEND_URL
  );

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId || !BACKEND_URL) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/youtube/video/${videoId}`
        );
        setVideo(res.data.video);
      } catch (err) {
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, BACKEND_URL]);

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (!video) return <p>No video found</p>;

  const { snippet, statistics, contentDetails } = video;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-8">

          {/* ▶️ VIDEO PLAYER */}
          <div className="card mb-3">
            <iframe
              height="420"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={snippet.title}
              allowFullScreen
              className="w-100"
            />
          </div>

          {/* 🧾 TITLE */}
          <h4>{snippet.title}</h4>

          {/* 📊 STATS */}
          <p className="text-muted mb-1">
            {formatNumber(statistics.viewCount)} views •{" "}
            {new Date(snippet.publishedAt).toDateString()}
          </p>

          <p className="mb-2">
            👍 {formatNumber(statistics.likeCount)} likes • 💬{" "}
            {formatNumber(statistics.commentCount)} comments
          </p>

          <hr />

          {/* 📺 CHANNEL */}
          <p className="fw-bold">{snippet.channelTitle}</p>

          {/* 📝 DESCRIPTION */}
          <p style={{ whiteSpace: "pre-line" }}>
            {snippet.description || "No description available"}
          </p>

          <hr />

          {/* ⚙️ VIDEO META */}
          <div className="row text-muted small">
            <div className="col-md-6">
              <p><strong>Duration:</strong> {formatDuration(contentDetails.duration)}</p>
              <p><strong>Definition:</strong> {contentDetails.definition.toUpperCase()}</p>
              <p><strong>Dimension:</strong> {contentDetails.dimension}</p>
            </div>

            <div className="col-md-6">
              <p><strong>Captions:</strong> {contentDetails.caption === "true" ? "Yes" : "No"}</p>
              <p><strong>Licensed:</strong> {contentDetails.licensedContent ? "Yes" : "No"}</p>
              <p><strong>Category ID:</strong> {snippet.categoryId}</p>
            </div>
          </div>

          <hr />

          {/* 🖼️ THUMBNAILS */}
          <div>
            <p className="fw-bold mb-2">Thumbnails</p>
            <div className="d-flex gap-2 flex-wrap">
              {Object.values(snippet.thumbnails).map((thumb, i) => (
                <img
                  key={i}
                  src={thumb.url}
                  alt="thumbnail"
                  height="90"
                  className="rounded border"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Helpers */
function formatDuration(iso) {
  if (!iso) return "N/A";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = match[1] || 0;
  const m = match[2] || 0;
  const s = match[3] || 0;
  return [h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(" ");
}

function formatNumber(n) {
  return n ? Number(n).toLocaleString() : "0";
}
