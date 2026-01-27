import { useState } from "react";
import { useSelector } from "react-redux";

function AddCommentForm({ UserProfilePhoto, onSubmit, isSubmitting }) {
  const [text, setText] = useState("");
  const isUserAuthenticated = useSelector(
    (state) => state.harmeetsYoutube.isUserAuthenticated
  );
  const handleCancel = () => setText("");

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed || !onSubmit) return;
    onSubmit(trimmed);
    setText("");
  }

  if (!isUserAuthenticated) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="yt-comment-form">
      <div className="yt-comment-form__row">
        {UserProfilePhoto ? (
          <img
            src={UserProfilePhoto}
            alt="profile"
            className="yt-avatar yt-avatar--small"
          />
        ) : (
          <div className="yt-avatar yt-avatar--small yt-avatar--placeholder">
            U
          </div>
        )}
        <div className="yt-comment-form__input">
          <textarea
            className="yt-textarea"
            rows="2"
            placeholder="Add a public comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="yt-comment-form__actions">
            <button
              type="button"
              className="yt-button yt-button--ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="yt-button yt-button--primary"
              type="submit"
              disabled={isSubmitting || !text.trim()}
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddCommentForm;
