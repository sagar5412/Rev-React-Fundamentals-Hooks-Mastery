import { memo } from "react";
import { useNotes } from "../context/NoteContext";

const NoteItem = memo(({ note }) => {
  const { dispatch } = useNotes();

  return (
    <li
      onClick={() => dispatch({ type: "DELETE", payload: note.id })}
      style={{
        cursor: "pointer",
        padding: "10px",
        borderBottom: "1px solid #eee",
        listStyle: "none",
      }}
    >
      <strong>{note.title}</strong>
      <p style={{ margin: "5px 0 0", color: "#666" }}>{note.content}</p>
    </li>
  );
});

export default NoteItem;
