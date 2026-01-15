import { useSelector } from "react-redux";
function CommentComponent({ comment, user, onDelete, videoId }) {

const isUserAuthenticated = useSelector(
  state => state.harmeetsYoutube.isUserAuthenticated);  
  if ( isUserAuthenticated)
  {
  const top = comment.snippet.topLevelComment.snippet;
  const id = comment.snippet.topLevelComment.id;
  return (
    <div className="mb-4">
      <div className="d-flex gap-3">
        <img src={top.authorProfileImageUrl} className="avatar" />

        <div className="flex-grow-1">
           <strong>{top.authorDisplayName}</strong>
          <div className="text-muted small">
            {new Date(top.publishedAt).toLocaleString()}
          </div>
          <p>{top.textDisplay}</p>
          {user && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(id)}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.comments?.map(r => (
        <div key={r.id} className="ms-5 mt-3">
          <strong>{r.snippet.authorDisplayName}</strong>
          <p>{r.snippet.textDisplay}</p>
        </div>
      ))}
    </div>
  );}
  else{return null; }
}


export default CommentComponent;
