const API_BASE_URL = "http://localhost:3001/api";

export const apiService = {
  // Fetch all notes
  async fetchNotes() {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  },

  // Create a new note
  async createNote(note) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });
      if (!response.ok) {
        throw new Error("Failed to create note");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  },

  // Delete a note
  async deleteNote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },
};
