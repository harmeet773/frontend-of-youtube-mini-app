import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
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
        const res = await axiosInstance.get(
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
    <div className="container-fluid px-4 py-3">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          {/* ▶️ VIDEO PLAYER */}
          <div className="ratio ratio-16x9 rounded overflow-hidden mb-3">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}`}
              title={snippet.title}
              allowFullScreen
            />
          </div>

          {/* 🧾 TITLE */}
          <h5 className="fw-bold mb-2">{snippet.title}</h5>

          {/* 📊 META ROW */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <p className="text-muted mb-1">
              {formatNumber(statistics.viewCount)} views •{" "}
              {new Date(snippet.publishedAt).toDateString()}
            </p>

            <div className="d-flex gap-3">
              <span>👍 {formatNumber(statistics.likeCount)}</span>
              <span>💬 {formatNumber(statistics.commentCount)}</span>
            </div>
          </div>

          <hr />

          {/* 📺 CHANNEL INFO */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48 }}
            >
              {snippet.channelTitle[0]}
            </div>

            <div className="flex-grow-1">
              <p className="fw-bold mb-0">{snippet.channelTitle}</p>
              <small className="text-muted">YouTube Channel</small>
            </div>

            <button className="btn btn-dark btn-sm rounded-pill px-3">
              Subscribe
            </button>
          </div>

          {/* 📝 DESCRIPTION BOX */}
          <div className="bg-light rounded p-3 mb-4">
            <p className="mb-2 text-muted">
              {formatNumber(statistics.viewCount)} views •{" "}
              {new Date(snippet.publishedAt).toDateString()}
            </p>

            <p style={{ whiteSpace: "pre-line" }} className="mb-0">
              {snippet.description || "No description available"}
            </p>
          </div>

          {/* ⚙️ VIDEO DETAILS */}
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
  return [h && `${h}h`, m && `${m}m`, s && `${s}s`]
    .filter(Boolean)
    .join(" ");
}

function formatNumber(n) {
  return n ? Number(n).toLocaleString() : "0";
}
