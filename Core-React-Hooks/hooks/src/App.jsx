import React, { useState, useEffect } from "react";

/**
 * Custom hook: sync state with localStorage
 */
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * Fake API: generate some dummy tweets
 */
function generateFakeTweets(page, pageSize = 5) {
  const baseId = (page - 1) * pageSize;
  return Array.from({ length: pageSize }, (_, i) => {
    const id = baseId + i + 1;
    return {
      id,
      user: `user_${((id - 1) % 4) + 1}`,
      handle: `@user${((id - 1) % 4) + 1}`,
      text: `This is fake tweet #${id}. Just some sample content.`,
      createdAt: new Date().toISOString(),
    };
  });
}

/**
 * Custom hook for tweets:
 * - uses localStorage to cache
 * - uses `page` to load more with useEffect
 */
function useTweets() {
  const [tweets, setTweets] = useLocalStorage("fake-twitter-feed", []);
  const [page, setPage] = useState(() => (tweets.length ? tweets.length / 5 : 1));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTweets() {
      setLoading(true);

      // simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (cancelled) return;

      const newTweets = generateFakeTweets(page);
      setTweets((prev) => {
        // avoid duplicating tweets if page was already loaded and restored from localStorage
        const existingIds = new Set(prev.map((t) => t.id));
        const combined = [...prev];
        for (const t of newTweets) {
          if (!existingIds.has(t.id)) combined.push(t);
        }
        return combined;
      });

      setLoading(false);
    }

    loadTweets();

    return () => {
      cancelled = true;
    };
  }, [page, setTweets]);

  const loadMore = () => {
    if (!loading) {
      setPage((p) => p + 1);
    }
  };

  return { tweets, loadMore, loading };
}

/**
 * UI component: fake Twitter feed
 */
export default function TwitterFeed() {
  const { tweets, loadMore, loading } = useTweets();

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
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Fake Twitter Feed</h2>

      <div>
        {tweets.map((tweet) => (
          <div
            key={tweet.id}
            style={{
              borderBottom: "1px solid #222",
              padding: "12px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <strong>{tweet.user}</strong>
              <span style={{ marginLeft: 8, color: "#777" }}>{tweet.handle}</span>
            </div>
            <p style={{ margin: 0 }}>{tweet.text}</p>
            <small style={{ color: "#555" }}>
              {new Date(tweet.createdAt).toLocaleString()}
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
    </div>
  );
}
