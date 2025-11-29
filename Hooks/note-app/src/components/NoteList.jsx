import { useNotes } from "../context/NoteContext";
import NoteItem from "./NoteItem";
import { memo } from "react";

export default function NoteList() {
  const { state } = useNotes();

  if (state.loading) return <div>Loading notes...</div>;
  if (state.error)
    return <div style={{ color: "red" }}>Error: {state.error}</div>;

  return (
    <ul>
      {state.notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
}
