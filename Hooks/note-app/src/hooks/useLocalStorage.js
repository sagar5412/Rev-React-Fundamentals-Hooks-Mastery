// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage (runs once)
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function NoteApp() {
  const [notes, setNotes] = useLocalStorage("notes", []);

  const addNote = (note) => {
    setNotes((prev) => [...prev, note]);
  };
}
