"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";

type Bookmark = {
  id: number;
  url: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setBookmarks(data);
      }
    };

    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addBookmark = async () => {
    const supabase = getSupabase();
    if (!supabase || !url.trim()) return;

    await supabase.from("bookmarks").insert([{ url }]);
    setUrl("");
  };

  const deleteBookmark = async (id: number) => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from("bookmarks").delete().eq("id", id);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Smart Bookmark App 🔖
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <button
          onClick={addBookmark}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "4px",
            }}
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#0070f3" }}
            >
              {bookmark.url}
            </a>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}