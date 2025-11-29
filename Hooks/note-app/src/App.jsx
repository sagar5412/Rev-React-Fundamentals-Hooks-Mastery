import { NoteProvider } from "./context/NoteContext";
import NoteList from "./components/NoteList";
import NoteForm from "./components/NoteForm";

function App() {
  return (
    <NoteProvider>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>My Notes</h1>
        <NoteForm />
        <NoteList />
      </div>
    </NoteProvider>
  );
}

export default App;
