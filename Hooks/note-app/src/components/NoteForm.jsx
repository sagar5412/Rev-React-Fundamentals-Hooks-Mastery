import { useState } from "react";
import { useNotes } from "../context/NoteContext";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { dispatch } = useNotes();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    dispatch({
      type: "ADD",
      payload: { title, content },
    });

    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
          }}
        />
      </div>
      <div>
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "8px",
            minHeight: "100px",
          }}
        />
      </div>
      <button type="submit" style={{ padding: "8px 16px" }}>
        Add Note
      </button>
    </form>
  );
}
