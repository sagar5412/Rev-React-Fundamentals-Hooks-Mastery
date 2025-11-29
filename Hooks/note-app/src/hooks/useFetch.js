import { useEffect, useReducer } from "react";

function editorReducer(state, action) {
  switch (action.type) {
    case "START_FETCH":
      return { ...state, loading: true };
    case "FINISHED_FETCH":
      return { ...state, data: action.payload, loading: false };
    case "ERROR_FETCH":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function useFetch(url) {
  const [state, dispatch] = useReducer(editorReducer, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: "START_FETCH" });
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((res) => dispatch({ type: "FINISHED_FETCH", payload: res }))
      .catch((res) => dispatch({ type: "ERROR_FETCH", payload: res }))
      .finally(() => dispatch({ type: "FINISHED_FETCH", payload: res }));
  }, [url]);

  return state;
}
