import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import { apiService } from "../services/apiService";

const NoteContext = createContext(null);

function noteReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return { ...state, notes: action.payload, loading: false };
    case "ADD":
      return { ...state, notes: [...state.notes, action.payload] };
    case "DELETE":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function NoteProvider({ children }) {
  const [state, dispatch] = useReducer(noteReducer, {
    notes: [],
    loading: true,
    error: null,
  });

  // Fetch notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const notes = await apiService.fetchNotes();
        dispatch({ type: "LOAD", payload: notes });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        console.error("Failed to load notes:", error);
      }
    };

    loadNotes();
  }, []);

  // Enhanced dispatch with API integration
  const enhancedDispatch = async (action) => {
    try {
      switch (action.type) {
        case "ADD":
          const newNote = await apiService.createNote(action.payload);
          dispatch({ type: "ADD", payload: newNote });
          break;
        case "DELETE":
          await apiService.deleteNote(action.payload);
          dispatch({ type: "DELETE", payload: action.payload });
          break;
        default:
          dispatch(action);
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Action failed:", error);
    }
  };

  const value = useMemo(() => ({ state, dispatch: enhancedDispatch }), [state]);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (!context) throw new Error("useNotes must be used in NoteProvider");
  return context;
}
