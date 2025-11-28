import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";

/* ---------------------- useLocalStorage Hook ---------------------- */
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

/* ---------------------- Fake API ---------------------- */
function generateFakeTweets(page, pageSize = 5) {
  const baseId = (page - 1) * pageSize;
  return Array.from({ length: pageSize }, (_, i) => {
    const id = baseId + i + 1;
    return {
      id,
      user: `user_${((id - 1) % 4) + 1}`,
      handle: `@user${((id - 1) % 4) + 1}`,
      text: `This is fake tweet #${id}`,
      createdAt: new Date().toISOString(),
    };
  });
}

/* ---------------------- Reducer ---------------------- */
const initialState = {
  tweets: [],
  page: 1,
  loading: false,
};

function tweetReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true };
    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        tweets: [...state.tweets, ...action.payload],
        page: state.page + 1,
      };
    case "RESTORE":
      return { ...state, tweets: action.payload, page: action.page };
    default:
      return state;
  }
}

/* ---------------------- Context ---------------------- */
const TweetContext = createContext(null);

function TweetProvider({ children }) {
  const [persistedTweets, setPersistedTweets] = useLocalStorage(
    "fake-twitter-feed",
    []
  );
  const [state, dispatch] = useReducer(tweetReducer, initialState);

  // Restore from localStorage on mount
  useEffect(() => {
    if (persistedTweets.length) {
      const page = Math.ceil(persistedTweets.length / 5) + 1;
      dispatch({ type: "RESTORE", payload: persistedTweets, page });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist tweets when changed
  useEffect(() => {
    if (state.tweets.length) setPersistedTweets(state.tweets);
  }, [state.tweets, setPersistedTweets]);

  // Load new tweets when requested
  async function loadMore() {
    if (state.loading) return;
    dispatch({ type: "LOAD_START" });

    await new Promise((r) => setTimeout(r, 500)); // simulate delay
    const newTweets = generateFakeTweets(state.page);
    dispatch({ type: "LOAD_SUCCESS", payload: newTweets });
  }

  return (
    <TweetContext.Provider value={{ state, loadMore }}>
      {children}
    </TweetContext.Provider>
  );
}

/* ---------------------- Custom Hook ---------------------- */
function useTweets() {
  const context = useContext(TweetContext);
  if (!context) throw new Error("useTweets must be used within TweetProvider");
  return context;
}

/* ---------------------- UI Component ---------------------- */
function TwitterFeed() {
  const { state, loadMore } = useTweets();
  const { tweets, loading } = state;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        border: "1px solid #333",
        borderRadius: 12,
        padding: 16,
        background: "#000",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Fake Twitter Feed</h2>

      {tweets.map((t) => (
        <div
          key={t.id}
          style={{ borderBottom: "1px solid #222", padding: "12px 0" }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <strong>{t.user}</strong>
            <span style={{ marginLeft: 8, color: "#777" }}>{t.handle}</span>
          </div>
          <p style={{ margin: 0 }}>{t.text}</p>
          <small style={{ color: "#555" }}>
            {new Date(t.createdAt).toLocaleString()}
          </small>
        </div>
      ))}

      <button
        onClick={loadMore}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "8px 16px",
          borderRadius: 999,
          border: "none",
          cursor: loading ? "default" : "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <TweetProvider>
      <TwitterFeed />
    </TweetProvider>
  );
}
