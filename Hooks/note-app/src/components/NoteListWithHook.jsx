import { useFetch } from "../hooks/useFetch";

export default function NoteListWithHook() {
  const { data: notes, loading, error } = useFetch("/api/notes");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}
