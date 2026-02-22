"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";

type Bookmark = {
  id: number;
  url: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const supabase = getSupabase();

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  };

  // Add bookmark
  const addBookmark = async () => {
    if (!url) return;

    await supabase.from("bookmarks").insert([{ url }]);
    setUrl("");
  };

  // Load + Realtime
  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Smart Bookmark App 🔖</h1>

      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      <button
        onClick={addBookmark}
        style={{ marginLeft: "10px", padding: "8px 16px" }}
      >
        Add
      </button>

      <ul style={{ marginTop: "30px" }}>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <a href={bookmark.url} target="_blank">
              {bookmark.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}