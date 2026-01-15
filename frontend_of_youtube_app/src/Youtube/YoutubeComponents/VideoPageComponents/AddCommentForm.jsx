import { useState } from "react";
import { useSelector } from "react-redux";
function AddCommentForm({ user, onSubmit }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim()) return;
    onSubmit(text);                
    setText("");    
  }
  const isUserAuthenticated = useSelector(state => state.harmeetsYoutube.isUserAuthenticated);
  if (isUserAuthenticated){
                                                    
  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="d-flex gap-2">
        <img src={user.photos?.[0]?.value} className="small-avatar" />     
        <textarea
          className="form-control"
          rows="3"
          placeholder="Add a public comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-2">Comment</button>
    </form>
  );

}else {return null ; }
}
export default AddCommentForm;