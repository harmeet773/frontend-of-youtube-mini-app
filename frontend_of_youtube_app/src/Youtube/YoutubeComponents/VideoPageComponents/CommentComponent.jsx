import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axiosInstance from "../../../api/axiosInstance";
import AddCommentForm from "./AddCommentForm";
import "./CommentComponent.css";

const DEFAULT_BACKEND_URL = "http://localhost:10000";

function toSafeDisplay(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br/>");
}

function getTimestamp(value) {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function formatCount(value) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "0";
  if (num < 1000) return String(num);
  if (num < 1000000) {
    const rounded = (num / 1000).toFixed(num >= 10000 ? 0 : 1);
    return `${rounded.replace(/\.0$/, "")}K`;
  }
  const rounded = (num / 1000000).toFixed(num >= 10000000 ? 0 : 1);
  return `${rounded.replace(/\.0$/, "")}M`;
}

function formatTimeAgo(value) {
  if (!value) return "Unknown";
  const timestamp = getTimestamp(value);
  if (!timestamp) return "Unknown";

  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) {
    return diffSeconds < 0 ? "In a moment" : "Just now";
  }

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];

  const unit = units.find((entry) => absSeconds >= entry.seconds) || units[units.length - 1];
  const count = Math.floor(absSeconds / unit.seconds);
  const label = count === 1 ? unit.label : `${unit.label}s`;

  return diffSeconds < 0 ? `in ${count} ${label}` : `${count} ${label} ago`;
}

function normalizeReply(reply) {
  if (!reply) return null;

  const snippet = reply.snippet || {};
  return {
    replyId: reply.replyId || reply.id,
    parentId: reply.parentId || snippet.parentId,
    textDisplay: reply.textDisplay || snippet.textDisplay || snippet.textOriginal || "",
    textOriginal: reply.textOriginal || snippet.textOriginal || snippet.textDisplay || "",
    authorName: reply.authorName || snippet.authorDisplayName || "Unknown",
    authorProfileImage:
      reply.authorProfileImage ||
      reply.authorProfileImageUrl ||
      snippet.authorProfileImageUrl,
    authorChannelId: reply.authorChannelId || snippet.authorChannelId?.value,
    authorChannelUrl: reply.authorChannelUrl || snippet.authorChannelUrl,
    likeCount: reply.likeCount ?? snippet.likeCount ?? 0,
    publishedAt: reply.publishedAt || snippet.publishedAt,
    updatedAt: reply.updatedAt || snippet.updatedAt,
    replies: Array.isArray(reply.replies) ? reply.replies.map(normalizeReply) : []
  };
}

function buildReplyTree(replies, topLevelId) {
  const nodes = new Map();

  replies.forEach((reply) => {
    nodes.set(reply.replyId, {
      ...reply,
      replies: Array.isArray(reply.replies) ? [...reply.replies] : []
    });
  });

  const roots = [];

  replies.forEach((reply) => {
    const node = nodes.get(reply.replyId);
    const parentId = reply.parentId;

    if (parentId && parentId !== topLevelId && nodes.has(parentId)) {
      const parent = nodes.get(parentId);
      parent.replies = [...(parent.replies || []), node];
      return;
    }

    roots.push(node);
  });

  return roots;
}

function normalizeComment(comment) {
  if (!comment) return null;

  if (comment.commentId) {
    const normalizedReplies = (comment.replies || [])
      .map(normalizeReply)
      .filter(Boolean);
    const hasNested = normalizedReplies.some(
      (reply) =>
        reply.parentId &&
        reply.parentId !== comment.commentId &&
        normalizedReplies.some((candidate) => candidate.replyId === reply.parentId)
    );
    return {
      ...comment,
      replies: hasNested
        ? buildReplyTree(normalizedReplies, comment.commentId)
        : normalizedReplies
    };
  }

  const snippet = comment.snippet?.topLevelComment?.snippet || {};
  const replies = comment.replies?.comments || [];
  return {
    commentThreadId: comment.commentThreadId || comment.id,
    commentId: comment.snippet?.topLevelComment?.id || comment.id,
    textDisplay: snippet.textDisplay || snippet.textOriginal || "",
    textOriginal: snippet.textOriginal || snippet.textDisplay || "",
    authorName: snippet.authorDisplayName || "Unknown",
    authorProfileImage: snippet.authorProfileImageUrl,
    authorChannelId: snippet.authorChannelId?.value,
    authorChannelUrl: snippet.authorChannelUrl,
    likeCount: snippet.likeCount ?? 0,
    publishedAt: snippet.publishedAt,
    updatedAt: snippet.updatedAt,
    viewerRating: snippet.viewerRating,
    canReply: comment.snippet?.canReply,
    totalReplyCount: comment.snippet?.totalReplyCount ?? replies.length,
    isPublic: comment.snippet?.isPublic,
    replies: replies.map(normalizeReply).filter(Boolean)
  };
}

function updateCommentTree(items, commentId, updater) {
  return items.map((item) => {
    if (item.commentId === commentId || item.replyId === commentId) {
      return updater(item);
    }

    if (item.replies?.length) {
      return {
        ...item,
        replies: updateCommentTree(item.replies, commentId, updater)
      };
    }

    return item;
  });
}

function removeCommentFromTree(items, commentId) {
  const next = [];

  items.forEach((item) => {
    if (item.commentId === commentId || item.replyId === commentId) {
      return;
    }

    if (item.replies?.length) {
      const updatedReplies = removeCommentFromTree(item.replies, commentId);
      const removedCount = item.replies.length - updatedReplies.length;
      const totalReplyCount = Math.max(
        0,
        (item.totalReplyCount ?? item.replies.length) - removedCount
      );
      next.push({
        ...item,
        totalReplyCount,
        replies: updatedReplies
      });
      return;
    }

    next.push(item);
  });

  return next;
}

// Recursive Comment Thread Component
function CommentThread({
  comment,
  depth = 0,
  editingId,
  setEditingId,
  editingText,
  setEditingText,
  replyBox,
  setReplyBox,
  replyTexts,
  setReplyTexts,
  expandedReplies,
  setExpandedReplies,
  requireAuth,
  onDelete,
  onEdit,
  onLike,
  onDislike,
  onReply
}) {
  const commentId = comment.commentId || comment.replyId;
  const isEditing = editingId === commentId;
  const isExpanded = expandedReplies[commentId];
  const displayName = comment.authorName || "Unknown";
  const avatarUrl = comment.authorProfileImage || comment.authorProfileImageUrl;
  const safeText = toSafeDisplay(comment.textOriginal || comment.textDisplay || "");
  const likeCount = comment.likeCount || 0;
  const replyCount = comment.totalReplyCount ?? comment.replies?.length ?? 0;
  const isEdited =
    comment.updatedAt &&
    comment.publishedAt &&
    comment.updatedAt !== comment.publishedAt;
  const commentClassName = `yt-comment${depth > 0 ? " yt-comment--reply" : ""}`;
  const avatarClassName = `yt-avatar${depth > 0 ? " yt-avatar--small" : ""}`;
  const indentStyle = { "--indent": `${depth * 24}px` };

  const handleEditSave = () => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      return;
    }
    requireAuth(() => {
      onEdit(commentId, trimmed);
      setEditingId(null);
      setEditingText("");
    });
  };

  const handleReplySubmit = () => {
    const replyText = (replyTexts[commentId] || "").trim();
    if (!replyText) {
      return;
    }
    requireAuth(() => {
      onReply(commentId, replyText);
      setReplyTexts({ ...replyTexts, [commentId]: "" });
      setReplyBox({ ...replyBox, [commentId]: false });
    });
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={commentClassName} style={indentStyle}>
      <div className="yt-comment__body">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName} avatar`}
            className={avatarClassName}
          />
        ) : (
          <div className={`${avatarClassName} yt-avatar--placeholder`}>
            {displayName[0]?.toUpperCase() || "U"}
          </div>
        )}

        <div className="yt-comment__content">
          <div className="yt-comment__meta">
            {comment.authorChannelUrl ? (
              <a
                className="yt-comment__author"
                href={comment.authorChannelUrl}
                target="_blank"
                rel="noreferrer"
              >
                {displayName}
              </a>
            ) : (
              <span className="yt-comment__author">{displayName}</span>
            )}
            <span className="yt-comment__time">
              {formatTimeAgo(comment.publishedAt)}
            </span>
            {isEdited && <span className="yt-comment__edited">(edited)</span>}
          </div>

          {!isEditing ? (
            <p
              className="yt-comment__text"
              dangerouslySetInnerHTML={{ __html: safeText }}
            />
          ) : (
            <div className="yt-comment__edit">
              <textarea
                className="yt-textarea"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <div className="yt-edit-actions">
                <button
                  type="button"
                  className="yt-button yt-button--ghost"
                  onClick={() => {
                    setEditingId(null);
                    setEditingText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="yt-button yt-button--primary"
                  onClick={handleEditSave}
                  disabled={!editingText.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="yt-comment__actions">
              <button
                type="button"
                className="yt-action-button"
                onClick={() => requireAuth(() => onLike(commentId))}
              >
                Like
              </button>
              {likeCount > 0 && (
                <span className="yt-action-count">{formatCount(likeCount)}</span>
              )}
              <button
                type="button"
                className="yt-action-button"
                onClick={() => requireAuth(() => onDislike(commentId))}
              >
                Dislike
              </button>
              <button
                type="button"
                className="yt-action-button"
                onClick={() =>
                  requireAuth(() =>
                    setReplyBox({
                      ...replyBox,
                      [commentId]: !replyBox[commentId]
                    })
                  )
                }
              >
                Reply
              </button>
              <button
                type="button"
                className="yt-action-button"
                onClick={() => {
                  setEditingId(commentId);
                  setEditingText(comment.textOriginal || comment.textDisplay || "");
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="yt-action-button yt-action-button--danger"
                onClick={() => requireAuth(() => onDelete(commentId))}
              >
                Delete
              </button>
            </div>
          )}

          {replyBox[commentId] && (
            <div className="yt-reply-box">
              <textarea
                className="yt-textarea"
                placeholder="Add a reply..."
                value={replyTexts[commentId] || ""}
                onChange={(e) =>
                  setReplyTexts({
                    ...replyTexts,
                    [commentId]: e.target.value
                  })
                }
              />
              <div className="yt-reply-actions">
                <button
                  type="button"
                  className="yt-button yt-button--ghost"
                  onClick={() => {
                    setReplyBox({ ...replyBox, [commentId]: false });
                    setReplyTexts({ ...replyTexts, [commentId]: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="yt-button yt-button--primary"
                  onClick={handleReplySubmit}
                  disabled={!replyTexts[commentId]?.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasReplies && (
        <div className="yt-comment__replies">
          <button
            type="button"
            className="yt-replies-toggle"
            onClick={() =>
              setExpandedReplies({
                ...expandedReplies,
                [commentId]: !isExpanded
              })
            }
          >
            {isExpanded ? "Hide" : "View"} {formatCount(replyCount)}{" "}
            {replyCount === 1 ? "reply" : "replies"}
          </button>

          {isExpanded && (
            <div className="yt-replies-list">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.replyId}
                  comment={reply}
                  depth={depth + 1}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  replyBox={replyBox}
                  setReplyBox={setReplyBox}
                  replyTexts={replyTexts}
                  setReplyTexts={setReplyTexts}
                  expandedReplies={expandedReplies}
                  setExpandedReplies={setExpandedReplies}
                  requireAuth={requireAuth}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onLike={onLike}
                  onDislike={onDislike}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CommentComponent({ videoId }) {
  const isUserAuthenticated = useSelector(
    (state) => state.harmeetsYoutube.isUserAuthenticated
  );
  const backendUrl = useSelector(
    (state) => state.harmeetsYoutube.YT_BACKEND_URL
  );
  const userProfilePhoto = useSelector(
    (state) => state.harmeetsYoutube.user.picture
  );

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [replyBox, setReplyBox] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [sortMode, setSortMode] = useState("top");

  const resolvedBackendUrl = backendUrl || DEFAULT_BACKEND_URL;
  const sortedComments = [...comments].sort((first, second) => {
    if (sortMode === "newest") {
      return getTimestamp(second.publishedAt) - getTimestamp(first.publishedAt);
    }
    const scoreFirst = (first.likeCount || 0) + (first.totalReplyCount || 0);
    const scoreSecond = (second.likeCount || 0) + (second.totalReplyCount || 0);
    if (scoreSecond !== scoreFirst) {
      return scoreSecond - scoreFirst;
    }
    return getTimestamp(second.publishedAt) - getTimestamp(first.publishedAt);
  });

  const fetchComments = async ({ showLoader } = { showLoader: true }) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await axiosInstance.get(
        `${resolvedBackendUrl}/api/video/${videoId}/comments`
      );
      const commentsData = response.data.comments || response.data || [];
      setComments(commentsData.map(normalizeComment).filter(Boolean));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching comments:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load comments",
        confirmButtonText: "OK"
      });
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (videoId) {
      setComments([]);
      setReplyBox({});
      setReplyTexts({});
      setExpandedReplies({});
      setEditingId(null);
      setEditingText("");
      setSortMode("top");
      setError(null);
      fetchComments({ showLoader: true });
    }
  }, [videoId, resolvedBackendUrl]);

  const requireAuth = (action) => {
    if (!isUserAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please login to perform this action.",
        confirmButtonText: "OK"
      });
      return;
    }
    action();
  };

  const handleAddComment = (text) => {
    requireAuth(async () => {
      try {
        setIsSubmitting(true);
        await axiosInstance.post(`${resolvedBackendUrl}/api/add-comment`, {
          videoId,
          commentText: text
        });
        await fetchComments({ showLoader: false });
      } catch (err) {
        console.error("Error adding comment:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add comment",
          confirmButtonText: "OK"
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleReply = (commentId, replyText) => {
    requireAuth(async () => {
      try {
        await axiosInstance.post(`${resolvedBackendUrl}/api/reply-comment`, {
          parentId: commentId,
          replyText
        });
        await fetchComments({ showLoader: false });
      } catch (err) {
        console.error("Error adding reply:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add reply",
          confirmButtonText: "OK"
        });
      }
    });
  };

  const handleEdit = (commentId, newText) => {
    requireAuth(async () => {
      try {
        await axiosInstance.post(`${resolvedBackendUrl}/api/edit-comment`, {
          commentId,
          newText
        });
        setComments((prev) =>
          updateCommentTree(prev, commentId, (item) => ({
            ...item,
            textOriginal: newText,
            textDisplay: newText,
            updatedAt: new Date().toISOString()
          }))
        );
      } catch (err) {
        console.error("Error editing comment:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to edit comment",
          confirmButtonText: "OK"
        });
      }
    });
  };

  const handleDelete = (commentId) => {
    requireAuth(async () => {
      try {
        await axiosInstance.post(`${resolvedBackendUrl}/api/delete-comment`, {
          commentId
        });
        setComments((prev) => removeCommentFromTree(prev, commentId));
      } catch (err) {
        console.error("Error deleting comment:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete comment",
          confirmButtonText: "OK"
        });
      }
    });
  };

  const handleLike = (commentId) => {
    requireAuth(async () => {
      try {
        console.log(`Liking comment with ID: ${commentId}`);
        const response = await axiosInstance.post(`${resolvedBackendUrl}/api/comment-rating`, {
          commentId,
          rating: "like"
        });
        console.log("Like response:", response.data);
        
        // Show a small toast or message that this is simulated
        Swal.fire({
          icon: "info",
          title: "Rating Simulated",
          text: "YouTube API does not support liking comments via third-party apps. This comment rating is only visible to you in this session.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });

        setComments((prev) =>
          updateCommentTree(prev, commentId, (item) => ({
            ...item,
            likeCount: (item.likeCount || 0) + 1
          }))
        );
      } catch (err) {
        console.error("Error liking comment:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.details?.message || "Failed to like comment";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
          confirmButtonText: "OK"
        });
      }
    });
  };

  const handleDislike = (commentId) => {
    requireAuth(async () => {
      try {
        console.log(`Disliking comment with ID: ${commentId}`);
        const response = await axiosInstance.post(`${resolvedBackendUrl}/api/comment-rating`, {
          commentId,
          rating: "dislike"
        });
        console.log("Dislike response:", response.data);

        // Show a small toast or message that this is simulated
        Swal.fire({
          icon: "info",
          title: "Rating Simulated",
          text: "YouTube API does not support disliking comments via third-party apps. This rating is only visible to you in this session.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'bottom-end'
        });

        setComments((prev) =>
          updateCommentTree(prev, commentId, (item) => ({
            ...item,
            likeCount: Math.max(0, (item.likeCount || 0) - 1)
          }))
        );
      } catch (err) {
        console.error("Error disliking comment:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.details?.message || "Failed to dislike comment";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
          confirmButtonText: "OK"
        });
      }
    });
  };

  const commentCountLabel = loading
    ? "Comments"
    : `${comments.length} Comment${comments.length === 1 ? "" : "s"}`;

  return (
    <div className="container-fluid px-4 pb-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="yt-comments">
            <div className="yt-comments__header">
              <h4 className="yt-comments__title">{commentCountLabel}</h4>
              <button
                type="button"
                className="yt-comments__sort"
                onClick={() =>
                  setSortMode(sortMode === "top" ? "newest" : "top")
                }
              >
                Sort by: {sortMode === "top" ? "Top comments" : "Newest first"}
              </button>
            </div>
            <AddCommentForm
              UserProfilePhoto={userProfilePhoto}
              onSubmit={handleAddComment}
              isSubmitting={isSubmitting}
            />
            {loading && (
              <div className="yt-comments__status">Loading comments...</div>
            )}
            {!loading && error && (
              <div className="yt-comments__status yt-comments__status--error">
                Failed to load comments
              </div>
            )}
            {!loading && !error && comments.length === 0 && (
              <div className="yt-comments__status">No comments yet</div>
            )}
            {!loading && !error && comments.length > 0 && (
              <div className="yt-comments__list">
                {sortedComments.map((comment) => (
                  <CommentThread
                    key={comment.commentId || comment.commentThreadId}
                    comment={comment}
                    depth={0}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    replyBox={replyBox}
                    setReplyBox={setReplyBox}
                    replyTexts={replyTexts}
                    setReplyTexts={setReplyTexts}
                    expandedReplies={expandedReplies}
                    setExpandedReplies={setExpandedReplies}
                    requireAuth={requireAuth}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onReply={handleReply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentComponent;
